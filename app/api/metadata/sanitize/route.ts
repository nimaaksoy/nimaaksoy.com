import { readFile } from "node:fs/promises";

import {
  cleanupMetadataTemp,
  receiveFormUpload,
  sanitizeMetadata,
} from "@/lib/metadata-processing";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  let tempDir: string | null = null;

  try {
    const mode = new URL(request.url).searchParams.get("mode") === "compress" ? "compress" : "strip";
    const upload = await receiveFormUpload(request);
    tempDir = upload.tempDir;
    const output = await sanitizeMetadata(upload, mode);
    const file = await readFile(output.filePath);

    return new Response(file, {
      headers: {
        "Content-Type": output.contentType,
        "Content-Length": String(output.sizeBytes),
        "Content-Disposition": `attachment; filename="${output.fileName.replace(/"/g, "")}"`,
        "X-Clean-Size": String(output.sizeBytes),
        "X-Original-Size": String(output.originalSizeBytes),
      },
    });
  } catch (error) {
    const status = typeof error === "object" && error && "status" in error ? Number(error.status) : 500;
    const message = error instanceof Error ? error.message : "Metadata sanitization failed.";
    return Response.json({ error: message }, { status: Number.isFinite(status) ? status : 500 });
  } finally {
    await cleanupMetadataTemp(tempDir);
  }
}
