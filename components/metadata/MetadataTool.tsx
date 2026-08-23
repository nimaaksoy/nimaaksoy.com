"use client";

import {
  IconClipboard,
  IconFileAnalytics,
  IconHash,
  IconInfoCircle,
  IconPhoto,
  IconRefresh,
  IconUpload,
} from "@tabler/icons-react";
import { useMemo, useRef, useState } from "react";

type MetadataRow = {
  label: string;
  value: string;
  note?: string;
};

type MetadataSection = {
  title: string;
  eyebrow: string;
  rows: MetadataRow[];
};

type MetadataResult = {
  file: {
    name: string;
    type: string;
    size: number;
    lastModified: string;
    sha256?: string;
  };
  media: MetadataRow[];
  exif: MetadataRow[];
  gps: MetadataRow[];
};

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

const TIFF_TYPES: Record<number, { bytes: number; read: (view: DataView, offset: number, little: boolean) => number | string }> = {
  1: { bytes: 1, read: (view, offset) => view.getUint8(offset) },
  2: { bytes: 1, read: (view, offset) => view.getUint8(offset) },
  3: { bytes: 2, read: (view, offset, little) => view.getUint16(offset, little) },
  4: { bytes: 4, read: (view, offset, little) => view.getUint32(offset, little) },
  5: {
    bytes: 8,
    read: (view, offset, little) => {
      const top = view.getUint32(offset, little);
      const bottom = view.getUint32(offset + 4, little);
      return bottom ? top / bottom : top;
    },
  },
  9: { bytes: 4, read: (view, offset, little) => view.getInt32(offset, little) },
  10: {
    bytes: 8,
    read: (view, offset, little) => {
      const top = view.getInt32(offset, little);
      const bottom = view.getInt32(offset + 4, little);
      return bottom ? top / bottom : top;
    },
  },
};

const EXIF_LABELS: Record<number, string> = {
  0x010f: "Camera make",
  0x0110: "Camera model",
  0x0112: "Orientation",
  0x0131: "Software",
  0x0132: "Modified",
  0x829a: "Exposure time",
  0x829d: "F number",
  0x8827: "ISO",
  0x9003: "Date taken",
  0x9209: "Flash",
  0x920a: "Focal length",
  0xa002: "Image width",
  0xa003: "Image height",
  0xa405: "35mm focal length",
  0xa434: "Lens model",
};

const GPS_LABELS: Record<number, string> = {
  0x0001: "GPS latitude ref",
  0x0002: "GPS latitude",
  0x0003: "GPS longitude ref",
  0x0004: "GPS longitude",
  0x0005: "GPS altitude ref",
  0x0006: "GPS altitude",
  0x0010: "GPS image direction ref",
  0x0011: "GPS image direction",
  0x001d: "GPS date stamp",
};

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${unit === 0 ? value : value.toFixed(value >= 100 ? 0 : 1)} ${units[unit]}`;
}

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

function formatExifValue(label: string, value: string | number) {
  if (typeof value === "string") return value.trim();
  if (label === "Exposure time" && value > 0 && value < 1) return `1/${Math.round(1 / value)} sec`;
  if (label === "F number") return `f/${Number(value).toFixed(1)}`;
  if (label === "Focal length") return `${Number(value).toFixed(1)} mm`;
  if (label === "GPS altitude") return `${Number(value).toFixed(1)} m`;
  return Number.isInteger(value) ? String(value) : Number(value).toFixed(4).replace(/\.?0+$/, "");
}

function readAscii(view: DataView, offset: number, length: number) {
  let value = "";
  for (let index = 0; index < length; index += 1) {
    const code = view.getUint8(offset + index);
    if (code === 0) break;
    value += String.fromCharCode(code);
  }
  return value;
}

function readTiffValue(view: DataView, tiffStart: number, entryOffset: number, little: boolean) {
  const type = view.getUint16(entryOffset + 2, little);
  const count = view.getUint32(entryOffset + 4, little);
  const spec = TIFF_TYPES[type];
  if (!spec || !count) return null;

  const byteLength = spec.bytes * count;
  const valueOffset = byteLength <= 4 ? entryOffset + 8 : tiffStart + view.getUint32(entryOffset + 8, little);
  if (valueOffset < 0 || valueOffset + byteLength > view.byteLength) return null;

  if (type === 2) return readAscii(view, valueOffset, count);

  const values: Array<number | string> = [];
  for (let index = 0; index < count; index += 1) {
    values.push(spec.read(view, valueOffset + index * spec.bytes, little));
  }

  return values.length === 1 ? values[0] : values;
}

function parseIfd(
  view: DataView,
  tiffStart: number,
  ifdOffset: number,
  little: boolean,
  labels: Record<number, string>,
) {
  const rows: MetadataRow[] = [];
  const pointers: Record<number, number> = {};
  const start = tiffStart + ifdOffset;
  if (start < 0 || start + 2 > view.byteLength) return { rows, pointers };

  const count = view.getUint16(start, little);
  for (let index = 0; index < count; index += 1) {
    const entry = start + 2 + index * 12;
    if (entry + 12 > view.byteLength) break;
    const tag = view.getUint16(entry, little);
    const value = readTiffValue(view, tiffStart, entry, little);

    if ((tag === 0x8769 || tag === 0x8825) && typeof value === "number") {
      pointers[tag] = value;
      continue;
    }

    const label = labels[tag];
    if (!label || value == null) continue;
    const text = Array.isArray(value)
      ? value.map((item) => formatExifValue(label, item)).join(", ")
      : formatExifValue(label, value);
    if (text) rows.push({ label, value: text });
  }

  return { rows, pointers };
}

function gpsToDecimal(values?: MetadataRow, ref?: MetadataRow) {
  if (!values || !ref) return null;
  const parts = values.value.split(",").map((part) => Number(part.trim()));
  if (parts.length < 3 || parts.some((part) => !Number.isFinite(part))) return null;
  const sign = /[SW]/i.test(ref.value) ? -1 : 1;
  return sign * (parts[0] + parts[1] / 60 + parts[2] / 3600);
}

function parseJpegExif(buffer: ArrayBuffer) {
  const view = new DataView(buffer);
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) {
    return { exif: [], gps: [] };
  }

  let offset = 2;
  while (offset + 4 < view.byteLength) {
    const marker = view.getUint16(offset);
    const size = view.getUint16(offset + 2);
    if (marker === 0xffe1 && readAscii(view, offset + 4, 6) === "Exif") {
      const tiffStart = offset + 10;
      const little = readAscii(view, tiffStart, 2) === "II";
      const firstIfd = view.getUint32(tiffStart + 4, little);
      const root = parseIfd(view, tiffStart, firstIfd, little, EXIF_LABELS);
      const exifIfd = root.pointers[0x8769]
        ? parseIfd(view, tiffStart, root.pointers[0x8769], little, EXIF_LABELS)
        : { rows: [] };
      const gpsIfd = root.pointers[0x8825]
        ? parseIfd(view, tiffStart, root.pointers[0x8825], little, GPS_LABELS)
        : { rows: [] };
      const gpsRows = [...gpsIfd.rows];
      const lat = gpsToDecimal(
        gpsRows.find((row) => row.label === "GPS latitude"),
        gpsRows.find((row) => row.label === "GPS latitude ref"),
      );
      const lon = gpsToDecimal(
        gpsRows.find((row) => row.label === "GPS longitude"),
        gpsRows.find((row) => row.label === "GPS longitude ref"),
      );
      if (lat != null && lon != null) {
        gpsRows.unshift({
          label: "Coordinates",
          value: `${lat.toFixed(6)}, ${lon.toFixed(6)}`,
          note: "Location embedded in the file.",
        });
      }
      return {
        exif: [...root.rows, ...exifIfd.rows],
        gps: gpsRows,
      };
    }
    offset += 2 + size;
  }

  return { exif: [], gps: [] };
}

async function sha256(buffer: ArrayBuffer) {
  if (!crypto.subtle) return undefined;
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function readImage(file: File) {
  return new Promise<MetadataRow[]>((resolve) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      resolve([
        { label: "Dimensions", value: `${image.naturalWidth} x ${image.naturalHeight}` },
        { label: "Pixels", value: `${(image.naturalWidth * image.naturalHeight).toLocaleString()} px` },
      ]);
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      resolve([]);
      URL.revokeObjectURL(url);
    };
    image.src = url;
  });
}

function readMedia(file: File) {
  return new Promise<MetadataRow[]>((resolve) => {
    const url = URL.createObjectURL(file);
    const element = document.createElement(file.type.startsWith("audio/") ? "audio" : "video");
    element.preload = "metadata";
    element.onloadedmetadata = () => {
      const rows: MetadataRow[] = [];
      if ("videoWidth" in element && element.videoWidth) {
        rows.push({ label: "Dimensions", value: `${element.videoWidth} x ${element.videoHeight}` });
      }
      const duration = formatDuration(element.duration);
      if (duration) rows.push({ label: "Duration", value: duration });
      resolve(rows);
      URL.revokeObjectURL(url);
    };
    element.onerror = () => {
      resolve([]);
      URL.revokeObjectURL(url);
    };
    element.src = url;
  });
}

function ResultSection({ section, filter }: { section: MetadataSection; filter: string }) {
  const rows = section.rows.filter((row) => {
    const haystack = `${section.title} ${row.label} ${row.value} ${row.note || ""}`.toLowerCase();
    return haystack.includes(filter);
  });

  if (!rows.length) return null;

  return (
    <section className="rounded-[8px] border border-[#1F1F1F] bg-[#111111]">
      <div className="flex items-center justify-between gap-4 border-b border-[#1F1F1F] px-5 py-4">
        <h2 className="font-monroe text-[24px] font-light leading-none text-[#EAEAEA]">
          {section.title}
        </h2>
        <span className="font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[#7F7F7F]">
          {section.eyebrow}
        </span>
      </div>
      <div className="divide-y divide-[#1F1F1F]">
        {rows.map((row) => (
          <div
            key={`${section.title}-${row.label}-${row.value}`}
            className="grid gap-2 px-5 py-4 md:grid-cols-[220px_1fr]"
          >
            <div>
              <p className="font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#7F7F7F]">
                {row.label}
              </p>
              {row.note ? (
                <p className="mt-1 font-monroe text-[13px] italic leading-[1.4] text-[#777777]">
                  {row.note}
                </p>
              ) : null}
            </div>
            <p className="min-w-0 break-words font-jetbrains text-[12px] leading-[1.7] text-[#DADADA]">
              {row.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function MetadataTool() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<MetadataResult | null>(null);
  const [filter, setFilter] = useState("");
  const [status, setStatus] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);

  const sections = useMemo<MetadataSection[]>(() => {
    if (!result) return [];
    return [
      {
        title: "File",
        eyebrow: "local",
        rows: [
          { label: "Name", value: result.file.name },
          { label: "Type", value: result.file.type || "Unknown" },
          { label: "Size", value: `${formatBytes(result.file.size)} (${result.file.size.toLocaleString()} bytes)` },
          { label: "Last modified", value: result.file.lastModified },
        ],
      },
      { title: "Media", eyebrow: "preview", rows: result.media },
      { title: "Embedded EXIF", eyebrow: "image", rows: result.exif },
      { title: "Location", eyebrow: "gps", rows: result.gps },
      {
        title: "Fingerprint",
        eyebrow: "hash",
        rows: result.file.sha256
          ? [
              {
                label: "SHA-256",
                value: result.file.sha256,
                note: "Useful when you need to confirm two files are identical.",
              },
            ]
          : [],
      },
    ].filter((section) => section.rows.length);
  }, [result]);

  async function inspectFile(targetFile: File) {
    setIsInspecting(true);
    setStatus("Reading metadata locally...");

    try {
      const buffer = await targetFile.arrayBuffer();
      const mediaRows = targetFile.type.startsWith("image/")
        ? await readImage(targetFile)
        : targetFile.type.startsWith("video/") || targetFile.type.startsWith("audio/")
          ? await readMedia(targetFile)
          : [];
      const parsed = targetFile.type === "image/jpeg" ? parseJpegExif(buffer) : { exif: [], gps: [] };
      const hash = await sha256(buffer);

      setResult({
        file: {
          name: targetFile.name,
          type: targetFile.type,
          size: targetFile.size,
          lastModified: new Date(targetFile.lastModified).toLocaleString(),
          sha256: hash,
        },
        media: mediaRows,
        exif: parsed.exif,
        gps: parsed.gps,
      });
      setStatus("Metadata ready. File stayed in your browser.");
    } catch {
      setStatus("Could not read this file. Try another image, video, or audio file.");
      setResult(null);
    } finally {
      setIsInspecting(false);
    }
  }

  function selectFile(nextFile?: File) {
    if (!nextFile) return;
    setFile(nextFile);
    setResult(null);
    setStatus("");
  }

  function resetTool() {
    setFile(null);
    setResult(null);
    setFilter("");
    setStatus("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function copyJson() {
    if (!result) return;
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setStatus("Raw JSON copied.");
  }

  const normalizedFilter = filter.trim().toLowerCase();

  return (
    <div className="space-y-8">
      <section
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          selectFile(event.dataTransfer.files?.[0]);
        }}
        className={`rounded-[8px] border border-dashed bg-[#111111] p-6 transition md:p-8 ${
          isDragging ? "border-[#2CFF05] bg-[#151515]" : "border-[#2A2A2A]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*,audio/*"
          className="hidden"
          onChange={(event) => selectFile(event.target.files?.[0])}
        />
        <div className="grid gap-6 md:grid-cols-[88px_1fr_auto] md:items-center">
          <div className="flex aspect-square h-[88px] items-center justify-center rounded-[8px] border border-[#2A2A2A] bg-[#0A0A0A] text-[#7F7F7F]">
            <IconFileAnalytics size={36} stroke={1.4} />
          </div>
          <div>
            <p className="font-jetbrains text-[11px] uppercase tracking-[0.16em] text-[#7F7F7F]">
              File metadata
            </p>
            <h2 className="mt-2 font-monroe text-[32px] font-light leading-none text-[#EAEAEA]">
              {file ? file.name : "Drop a file here"}
            </h2>
            <p className="mt-3 max-w-2xl font-monroe text-[16px] italic leading-[1.55] text-[#9A9A9A]">
              Inspect common image, video, audio, EXIF, GPS, and fingerprint metadata. Free to use,
              no credits required, and the file is not uploaded.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-11 items-center gap-2 rounded-[8px] border border-[#2CFF05] bg-[#2CFF05] px-4 font-jetbrains text-[11px] uppercase tracking-[0.12em] text-black transition hover:bg-transparent hover:text-[#2CFF05]"
            >
              <IconUpload size={16} stroke={1.8} />
              Choose file
            </button>
            <button
              type="button"
              disabled={!file || isInspecting}
              onClick={() => file && inspectFile(file)}
              className="inline-flex h-11 items-center gap-2 rounded-[8px] border border-[#2A2A2A] px-4 font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#EAEAEA] transition hover:border-[#2CFF05] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IconInfoCircle size={16} stroke={1.8} />
              {isInspecting ? "Reading" : "Inspect"}
            </button>
            {file ? (
              <button
                type="button"
                onClick={resetTool}
                className="inline-flex h-11 items-center gap-2 rounded-[8px] border border-[#2A2A2A] px-4 font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#9A9A9A] transition hover:border-[#EAEAEA] hover:text-[#EAEAEA]"
              >
                <IconRefresh size={16} stroke={1.8} />
                Reset
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {status ? (
        <p className="font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#7F7F7F]">
          {status}
        </p>
      ) : null}

      {result ? (
        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-5">
            <IconPhoto className="text-[#2CFF05]" size={20} stroke={1.6} />
            <p className="mt-4 font-monroe text-[32px] font-light leading-none text-[#EAEAEA]">
              {IMAGE_TYPES.has(result.file.type) ? "Image" : result.file.type.split("/")[0] || "File"}
            </p>
            <p className="mt-2 font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[#7F7F7F]">
              Media type
            </p>
          </div>
          <div className="rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-5">
            <IconHash className="text-[#2CFF05]" size={20} stroke={1.6} />
            <p className="mt-4 font-monroe text-[32px] font-light leading-none text-[#EAEAEA]">
              {formatBytes(result.file.size)}
            </p>
            <p className="mt-2 font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[#7F7F7F]">
              File size
            </p>
          </div>
          <button
            type="button"
            onClick={copyJson}
            className="rounded-[8px] border border-[#2CFF05] bg-[#111111] p-5 text-left transition hover:bg-[#151515]"
          >
            <IconClipboard className="text-[#2CFF05]" size={20} stroke={1.6} />
            <p className="mt-4 font-monroe text-[32px] font-light leading-none text-[#EAEAEA]">
              JSON
            </p>
            <p className="mt-2 font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[#7F7F7F]">
              Copy report
            </p>
          </button>
        </section>
      ) : null}

      {sections.length ? (
        <section className="space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="font-monroe text-[40px] font-light leading-none text-[#EAEAEA]">
              Metadata
            </h2>
            <input
              type="search"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Search fields"
              className="h-11 rounded-[8px] border border-[#2A2A2A] bg-[#0A0A0A] px-4 font-jetbrains text-[12px] text-[#EAEAEA] outline-none transition placeholder:text-[#555555] focus:border-[#2CFF05] md:w-[320px]"
            />
          </div>
          {sections.map((section) => (
            <ResultSection key={section.title} section={section} filter={normalizedFilter} />
          ))}
        </section>
      ) : null}
    </div>
  );
}
