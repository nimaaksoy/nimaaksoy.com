import "server-only";

import { parseMetadata, writeMetadata } from "@colorhythm/exiftool-wasm";
import { createHash } from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import { copyFile, mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const PROJECT_ROOT = process.cwd();
const FFMPEG_BIN = path.join(PROJECT_ROOT, "node_modules", "ffmpeg-static", "ffmpeg");
const FFPROBE_BIN = path.join(
  PROJECT_ROOT,
  "node_modules",
  "ffprobe-static",
  "bin",
  process.platform,
  process.arch,
  process.platform === "win32" ? "ffprobe.exe" : "ffprobe",
);

const MDATA_TMP_PREFIX = "nima-metadata-";
const MDATA_MAX_BYTES = 250 * 1024 * 1024;

export const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".tiff": "image/tiff",
  ".heic": "image/heic",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".mkv": "video/x-matroska",
  ".webm": "video/webm",
  ".m4a": "audio/mp4",
  ".mp3": "audio/mpeg",
  ".aac": "audio/aac",
  ".wav": "audio/wav",
  ".flac": "audio/flac",
};

export type MetadataUpload = {
  filePath: string;
  tempDir: string;
  originalName: string;
  sizeBytes: number;
};

export type SanitizedFile = {
  filePath: string;
  fileName: string;
  tempDir: string;
  contentType: string;
  sizeBytes: number;
  originalSizeBytes: number;
};

type FfprobeResult = {
  streams?: Array<Record<string, unknown>>;
  format?: {
    duration?: string | number;
    tags?: Record<string, string>;
    [key: string]: unknown;
  };
};

function runCommand(command: string, args: string[], parseJson = false) {
  return new Promise<string>((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (error: NodeJS.ErrnoException) => {
      reject(
        new Error(
          error.code === "ENOENT"
            ? `${command} is not available on this server.`
            : `Failed to start ${path.basename(command)}.`,
        ),
      );
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
        return;
      }
      reject(new Error(stderr.trim() || `${path.basename(command)} failed${parseJson ? " to read this file" : ""}.`));
    });
  });
}

function runFfprobe(filePath: string) {
  return runCommand(
    FFPROBE_BIN,
    [
      "-v",
      "error",
      "-show_format",
      "-show_streams",
      "-show_chapters",
      "-show_programs",
      "-show_private_data",
      "-print_format",
      "json",
      filePath,
    ],
    true,
  ).then((output) => JSON.parse(output) as FfprobeResult);
}

function stripZeroDispositionFields(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripZeroDispositionFields);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const source = value as Record<string, unknown>;
  const next: Record<string, unknown> = {};

  for (const [key, item] of Object.entries(source)) {
    if (key === "disposition" && item && typeof item === "object" && !Array.isArray(item)) {
      const activeDisposition = Object.fromEntries(
        Object.entries(item as Record<string, unknown>).filter(([, dispositionValue]) => {
          return Number(dispositionValue) !== 0;
        }),
      );
      if (Object.keys(activeDisposition).length) {
        next[key] = activeDisposition;
      }
      continue;
    }

    next[key] = stripZeroDispositionFields(item);
  }

  return next;
}

function cleanFfprobeResult(ffprobe: FfprobeResult | null) {
  return stripZeroDispositionFields(ffprobe) as FfprobeResult | null;
}

async function runExiftool(filePath: string) {
  try {
    const data = await readFile(filePath);
    const result = await parseMetadata<Array<Record<string, unknown>> | Record<string, unknown>>(
      { name: path.basename(filePath), data },
      {
        args: ["-json", "-g1", "-a", "-ee", "-api", "largefilesupport=1", "-c", "%+.6f"],
        transform: JSON.parse,
      },
    );

    if (!result.success) return null;

    const parsed = result.data;
    return Array.isArray(parsed) ? parsed[0] || null : parsed || null;
  } catch {
    return null;
  }
}

function runFfmpeg(args: string[]) {
  return runCommand(FFMPEG_BIN, ["-hide_banner", "-loglevel", "error", "-y", ...args]);
}

async function runExiftoolStrip(filePath: string) {
  const data = await readFile(filePath);
  const result = await writeMetadata({ name: path.basename(filePath), data }, { all: "" });

  if (!result.success) {
    throw new Error(result.error || "ExifTool failed to strip metadata.");
  }

  await writeFile(filePath, Buffer.from(result.data));
}

function hashFile(filePath: string) {
  return new Promise<{ sha256: string; md5: string } | null>((resolve) => {
    try {
      const sha256 = createHash("sha256");
      const md5 = createHash("md5");
      const stream = createReadStream(filePath);
      stream.on("data", (chunk) => {
        sha256.update(chunk);
        md5.update(chunk);
      });
      stream.on("error", () => resolve(null));
      stream.on("end", () => resolve({ sha256: sha256.digest("hex"), md5: md5.digest("hex") }));
    } catch {
      resolve(null);
    }
  });
}

function isCoverStream(stream: Record<string, unknown>) {
  const disposition = stream.disposition as { attached_pic?: number } | undefined;
  if (disposition?.attached_pic) return true;
  const stillCodecs = ["mjpeg", "png", "bmp", "gif", "webp", "tiff"];
  return stillCodecs.includes(String(stream.codec_name || "")) && (Number(stream.nb_frames) || 1) <= 1;
}

function detectMediaKind(ffprobe: FfprobeResult | null) {
  const streams = ffprobe?.streams || [];
  const duration = Number(ffprobe?.format?.duration) || 0;
  const audio = streams.find((stream) => stream.codec_type === "audio");
  const videoStreams = streams.filter((stream) => stream.codec_type === "video");
  const motionVideo = videoStreams.find((stream) => !isCoverStream(stream) && (Number(stream.nb_frames) > 1 || duration > 1));
  if (motionVideo) return "video";
  if (audio) return "audio";
  if (videoStreams.length) return "image";
  return "other";
}

const AUDIO_KEEP_KEYS = new Set([
  "title",
  "artist",
  "album",
  "album_artist",
  "albumartist",
  "composer",
  "performer",
  "track",
  "tracktotal",
  "disc",
  "disctotal",
  "disc_number",
  "genre",
  "date",
  "year",
  "originaldate",
  "grouping",
  "compilation",
  "publisher",
  "copyright",
  "lyricist",
  "conductor",
  "lyrics",
  "language",
  "bpm",
  "tempo",
  "description",
]);

function audioKeepArgs(ffprobe: FfprobeResult | null) {
  const tags = ffprobe?.format?.tags || {};
  const args: string[] = [];
  for (const [key, value] of Object.entries(tags)) {
    if (value == null || String(value) === "") continue;
    if (AUDIO_KEEP_KEYS.has(key.toLowerCase())) args.push("-metadata", `${key}=${value}`);
  }
  return args;
}

export function safeFilename(value: string) {
  let decoded = String(value || "");
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    // Keep raw value if it is not valid percent encoding.
  }
  const cleaned = path.basename(decoded).replace(/[<>:"/\\|?*]+/g, "_").replace(/\s+/g, " ").trim();
  return cleaned.slice(0, 200) || "upload";
}

export async function receiveFormUpload(request: Request): Promise<MetadataUpload> {
  const form = await request.formData();
  const uploaded = form.get("file");

  if (!(uploaded instanceof File)) {
    throw Object.assign(new Error("No file was received."), { status: 400 });
  }

  if (uploaded.size > MDATA_MAX_BYTES) {
    throw Object.assign(new Error("File is too large. Maximum upload size is 250 MB."), { status: 413 });
  }

  const tempDir = await mkdtemp(path.join(tmpdir(), MDATA_TMP_PREFIX));
  await mkdir(tempDir, { recursive: true });
  const filePath = path.join(tempDir, "media");
  const bytes = Buffer.from(await uploaded.arrayBuffer());

  await new Promise<void>((resolve, reject) => {
    const writeStream = createWriteStream(filePath);
    writeStream.on("error", reject);
    writeStream.on("finish", resolve);
    writeStream.end(bytes);
  });

  return {
    filePath,
    tempDir,
    originalName: safeFilename(uploaded.name || "upload"),
    sizeBytes: uploaded.size,
  };
}

export async function inspectMetadata(upload: MetadataUpload) {
  const [ffprobe, exif, hashes] = await Promise.all([
    runFfprobe(upload.filePath).then(cleanFfprobeResult).catch(() => null),
    runExiftool(upload.filePath),
    hashFile(upload.filePath),
  ]);

  if (!ffprobe && !exif) {
    throw Object.assign(new Error("Could not read metadata from this file. It may be corrupt or unsupported."), {
      status: 422,
    });
  }

  return {
    file: {
      name: upload.originalName,
      sizeBytes: upload.sizeBytes,
      hashes,
    },
    ffprobe,
    exif,
    exifAvailable: Boolean(exif),
  };
}

export async function sanitizeMetadata(upload: MetadataUpload, mode: "strip" | "compress"): Promise<SanitizedFile> {
  const ext = (path.extname(upload.originalName) || "").toLowerCase().slice(0, 12) || ".bin";
  const base = upload.originalName.slice(0, upload.originalName.length - path.extname(upload.originalName).length) || "media";
  const ffprobe = await runFfprobe(upload.filePath).catch(() => null);
  const kind = detectMediaKind(ffprobe);

  let outPath: string;
  let outName: string;

  if (kind === "image") {
    if (mode === "compress") {
      outPath = path.join(upload.tempDir, "out.jpg");
      outName = `${base}-clean.jpg`;
      await runFfmpeg(["-i", upload.filePath, "-map_metadata", "-1", "-c:v", "mjpeg", "-q:v", "3", "-pix_fmt", "yuvj420p", outPath]);
      await runExiftoolStrip(outPath);
    } else {
      outPath = path.join(upload.tempDir, `out${ext}`);
      outName = `${base}-clean${ext}`;
      await copyFile(upload.filePath, outPath);
      await runExiftoolStrip(outPath);
    }
  } else if (kind === "video") {
    const isMp4ish = [".mp4", ".mov", ".m4v"].includes(ext);
    if (mode === "compress") {
      outPath = path.join(upload.tempDir, "out.mp4");
      outName = `${base}-clean.mp4`;
      await runFfmpeg([
        "-i",
        upload.filePath,
        "-map",
        "0",
        "-map_metadata",
        "-1",
        "-map_chapters",
        "-1",
        "-c:v",
        "libx265",
        "-crf",
        "24",
        "-preset",
        "medium",
        "-tag:v",
        "hvc1",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "+faststart",
        outPath,
      ]);
      await runExiftoolStrip(outPath);
    } else {
      outPath = path.join(upload.tempDir, `out${isMp4ish ? ext : ".mp4"}`);
      outName = `${base}-clean${isMp4ish ? ext : ".mp4"}`;
      const args = ["-i", upload.filePath, "-map", "0", "-map_metadata", "-1", "-map_chapters", "-1", "-c", "copy"];
      if ([".mp4", ".mov", ".m4v"].includes(path.extname(outPath))) args.push("-movflags", "+faststart");
      await runFfmpeg([...args, outPath]);
      await runExiftoolStrip(outPath);
    }
  } else if (kind === "audio") {
    const keep = audioKeepArgs(ffprobe);
    if (mode === "compress") {
      outPath = path.join(upload.tempDir, "out.m4a");
      outName = `${base}-clean.m4a`;
      await runFfmpeg([
        "-i",
        upload.filePath,
        "-map",
        "0",
        "-map_metadata",
        "-1",
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        ...keep,
        outPath,
      ]);
    } else {
      outPath = path.join(upload.tempDir, `out${ext}`);
      outName = `${base}-clean${ext}`;
      await runFfmpeg(["-i", upload.filePath, "-map", "0", "-map_metadata", "-1", "-c", "copy", ...keep, outPath]);
    }
  } else {
    throw Object.assign(new Error("Unsupported file type. Use an image, video, or audio file."), { status: 422 });
  }

  const fileStat = await stat(outPath);

  return {
    filePath: outPath,
    fileName: outName,
    tempDir: upload.tempDir,
    contentType: CONTENT_TYPES[path.extname(outName).toLowerCase()] || "application/octet-stream",
    sizeBytes: fileStat.size,
    originalSizeBytes: upload.sizeBytes,
  };
}

export async function cleanupMetadataTemp(tempDir?: string | null) {
  if (tempDir) await rm(tempDir, { recursive: true, force: true }).catch(() => {});
}
