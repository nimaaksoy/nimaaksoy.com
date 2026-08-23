import {
  cleanupMetadataTemp,
  inspectMetadata,
  receiveFormUpload,
} from "@/lib/metadata-processing";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  let tempDir: string | null = null;

  try {
    const upload = await receiveFormUpload(request);
    tempDir = upload.tempDir;
    const payload = await inspectMetadata(upload);
    return Response.json(payload);
  } catch (error) {
    const status = typeof error === "object" && error && "status" in error ? Number(error.status) : 500;
    const message = error instanceof Error ? error.message : "Metadata processing failed.";
    return Response.json({ error: message }, { status: Number.isFinite(status) ? status : 500 });
  } finally {
    await cleanupMetadataTemp(tempDir);
  }
}
