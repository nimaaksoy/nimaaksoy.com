"use client";

import {
  IconClipboard,
  IconDownload,
  IconFileAnalytics,
  IconInfoCircle,
  IconRefresh,
  IconSearch,
  IconUpload,
} from "@tabler/icons-react";
import { useMemo, useRef, useState } from "react";

type MetadataRow = {
  label: string;
  value: string;
};

type MetadataSection = {
  title: string;
  eyebrow: string;
  rows: MetadataRow[];
};

type MetadataResult = {
  file?: {
    name?: string;
    sizeBytes?: number;
    hashes?: {
      sha256?: string;
      md5?: string;
    } | null;
  };
  ffprobe?: {
    format?: Record<string, unknown>;
    streams?: Array<Record<string, unknown>>;
    chapters?: Array<Record<string, unknown>>;
    programs?: Array<Record<string, unknown>>;
  } | null;
  exif?: Record<string, unknown> | null;
  exifAvailable?: boolean;
};

function formatBytes(bytes?: number) {
  const size = Number(bytes);
  if (!Number.isFinite(size) || size <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = size;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${unit === 0 ? value : value.toFixed(value >= 100 ? 0 : 1)} ${units[unit]}`;
}

function valueToText(value: unknown): string {
  if (value == null || value === "") return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}

function prettyLabel(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

function flattenRows(source: unknown, prefix = ""): MetadataRow[] {
  if (!source || typeof source !== "object") return [];
  const rows: MetadataRow[] = [];

  for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
    if (value == null || value === "") continue;
    const label = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(value)) {
      if (value.every((item) => item == null || typeof item !== "object")) {
        rows.push({ label: prettyLabel(label), value: value.map(valueToText).filter(Boolean).join(", ") });
      } else {
        value.forEach((item, index) => {
          rows.push(...flattenRows(item, `${label}.${index + 1}`));
        });
      }
      continue;
    }

    if (typeof value === "object") {
      rows.push(...flattenRows(value, label));
      continue;
    }

    const text = valueToText(value);
    if (text) rows.push({ label: prettyLabel(label), value: text });
  }

  return rows;
}

function fileNameFromDisposition(header: string | null, fallback: string) {
  const match = header?.match(/filename="?([^"]+)"?/i);
  return match?.[1] || fallback;
}

function MetadataSectionView({ section, filter }: { section: MetadataSection; filter: string }) {
  const rows = section.rows.filter((row) => {
    const haystack = `${section.title} ${row.label} ${row.value}`.toLowerCase();
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
            className="grid gap-2 px-5 py-4 md:grid-cols-[240px_1fr]"
          >
            <p className="font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#7F7F7F]">
              {row.label}
            </p>
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
  const [downloadMode, setDownloadMode] = useState<"strip" | "compress" | null>(null);

  const sections = useMemo<MetadataSection[]>(() => {
    if (!result) return [];

    const fileRows: MetadataRow[] = [
      { label: "Name", value: valueToText(result.file?.name) },
      { label: "Size", value: `${formatBytes(result.file?.sizeBytes)} (${Number(result.file?.sizeBytes || 0).toLocaleString()} bytes)` },
      { label: "SHA 256", value: valueToText(result.file?.hashes?.sha256) },
      { label: "MD5", value: valueToText(result.file?.hashes?.md5) },
    ].filter((row) => row.value);

    const nextSections: MetadataSection[] = [
      { title: "File", eyebrow: "hash", rows: fileRows },
    ];

    const formatRows = flattenRows(result.ffprobe?.format);
    if (formatRows.length) {
      nextSections.push({ title: "Container", eyebrow: "ffprobe", rows: formatRows });
    }

    result.ffprobe?.streams?.forEach((stream, index) => {
      const rows = flattenRows(stream);
      if (rows.length) {
        nextSections.push({
          title: `Stream ${index + 1}`,
          eyebrow: valueToText(stream.codec_type || stream.codec_name || "ffprobe"),
          rows,
        });
      }
    });

    result.ffprobe?.chapters?.forEach((chapter, index) => {
      const rows = flattenRows(chapter);
      if (rows.length) {
        nextSections.push({ title: `Chapter ${index + 1}`, eyebrow: "ffprobe", rows });
      }
    });

    result.ffprobe?.programs?.forEach((program, index) => {
      const rows = flattenRows(program);
      if (rows.length) {
        nextSections.push({ title: `Program ${index + 1}`, eyebrow: "ffprobe", rows });
      }
    });

    if (result.exif && typeof result.exif === "object") {
      for (const [group, value] of Object.entries(result.exif)) {
        if (group === "SourceFile") continue;
        const rows = flattenRows(value);
        if (rows.length) {
          nextSections.push({ title: prettyLabel(group), eyebrow: "exiftool", rows });
        }
      }
    }

    return nextSections.filter((section) => section.rows.length);
  }, [result]);

  function selectFile(nextFile?: File) {
    if (!nextFile) return;
    setFile(nextFile);
    setResult(null);
    setStatus("");
    setFilter("");
  }

  function resetTool() {
    setFile(null);
    setResult(null);
    setFilter("");
    setStatus("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function inspectFile() {
    if (!file) return;
    setIsInspecting(true);
    setStatus("Reading full metadata...");

    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/metadata", {
        method: "POST",
        body: form,
      });
      const payload = (await response.json()) as MetadataResult & { error?: string };

      if (!response.ok) throw new Error(payload.error || "Metadata processing failed.");

      setResult(payload);
      setStatus("Metadata ready.");
    } catch (error) {
      setResult(null);
      setStatus(error instanceof Error ? error.message : "Metadata processing failed.");
    } finally {
      setIsInspecting(false);
    }
  }

  async function downloadSanitized(mode: "strip" | "compress") {
    if (!file) return;
    setDownloadMode(mode);
    setStatus(mode === "compress" ? "Sanitizing and compressing..." : "Sanitizing metadata...");

    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch(`/api/metadata/sanitize?mode=${mode}`, {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Metadata sanitization failed.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileNameFromDisposition(
        response.headers.get("Content-Disposition"),
        mode === "compress" ? "clean-compressed-file" : "clean-file",
      );
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      const cleanSize = Number(response.headers.get("X-Clean-Size"));
      setStatus(`Download ready. Clean file size: ${formatBytes(cleanSize)}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Metadata sanitization failed.");
    } finally {
      setDownloadMode(null);
    }
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
            <h2 className="mt-2 break-words font-monroe text-[32px] font-light leading-none text-[#EAEAEA]">
              {file ? file.name : "Drop a file here"}
            </h2>
            <p className="mt-3 max-w-2xl font-monroe text-[16px] italic leading-[1.55] text-[#9A9A9A]">
              Inspect full ffprobe and exiftool metadata, then download a clean copy. Free to use,
              no credits required.
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
              onClick={inspectFile}
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

      {file ? (
        <section className="grid gap-4 md:grid-cols-3">
          <button
            type="button"
            onClick={() => downloadSanitized("strip")}
            disabled={Boolean(downloadMode)}
            className="rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-5 text-left transition hover:border-[#2CFF05]/60 hover:bg-[#151515] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <IconDownload className="text-[#2CFF05]" size={20} stroke={1.6} />
            <p className="mt-4 font-monroe text-[30px] font-light leading-none text-[#EAEAEA]">
              Sanitize
            </p>
            <p className="mt-3 font-jetbrains text-[11px] leading-[1.6] text-[#8A8A8A]">
              Remove embedded metadata while keeping the same quality where the format supports it.
            </p>
          </button>
          <button
            type="button"
            onClick={() => downloadSanitized("compress")}
            disabled={Boolean(downloadMode)}
            className="rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-5 text-left transition hover:border-[#2CFF05]/60 hover:bg-[#151515] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <IconDownload className="text-[#2CFF05]" size={20} stroke={1.6} />
            <p className="mt-4 font-monroe text-[30px] font-light leading-none text-[#EAEAEA]">
              Sanitize + compress
            </p>
            <p className="mt-3 font-jetbrains text-[11px] leading-[1.6] text-[#8A8A8A]">
              Strip metadata and re-encode to reduce file size.
            </p>
          </button>
          <button
            type="button"
            onClick={copyJson}
            disabled={!result}
            className="rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-5 text-left transition hover:border-[#2CFF05]/60 hover:bg-[#151515] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <IconClipboard className="text-[#2CFF05]" size={20} stroke={1.6} />
            <p className="mt-4 font-monroe text-[30px] font-light leading-none text-[#EAEAEA]">
              Copy JSON
            </p>
            <p className="mt-3 font-jetbrains text-[11px] leading-[1.6] text-[#8A8A8A]">
              Copy the full metadata report for debugging or archiving.
            </p>
          </button>
        </section>
      ) : null}

      {status ? (
        <p className="font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#7F7F7F]">
          {status}
        </p>
      ) : null}

      {sections.length ? (
        <section className="space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="font-monroe text-[40px] font-light leading-none text-[#EAEAEA]">
              Metadata
            </h2>
            <label className="relative block md:w-[320px]">
              <IconSearch
                size={15}
                stroke={1.8}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#555555]"
              />
              <input
                type="search"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Search fields"
                className="h-11 w-full rounded-[8px] border border-[#2A2A2A] bg-[#0A0A0A] pl-10 pr-4 font-jetbrains text-[12px] text-[#EAEAEA] outline-none transition placeholder:text-[#555555] focus:border-[#2CFF05]"
              />
            </label>
          </div>
          {sections.map((section) => (
            <MetadataSectionView key={section.title} section={section} filter={normalizedFilter} />
          ))}
        </section>
      ) : null}
    </div>
  );
}
