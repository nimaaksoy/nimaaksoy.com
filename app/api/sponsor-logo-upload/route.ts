import { createHash } from "node:crypto";

const maxLogoBytes = 5 * 1024 * 1024;
const uploadFolder = process.env.CLOUDINARY_SPONSOR_FOLDER || "nimaaksoy/sponsors";

type CloudinaryUploadResponse = {
  secure_url?: string;
  public_id?: string;
  width?: number;
  height?: number;
  error?: {
    message?: string;
  };
};

function signCloudinaryParams(params: Record<string, string>, secret: string) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${payload}${secret}`).digest("hex");
}

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    return { cloudName, apiKey, apiSecret };
  }

  if (!process.env.CLOUDINARY_URL) {
    return null;
  }

  try {
    const cloudinaryUrl = new URL(process.env.CLOUDINARY_URL);

    if (cloudinaryUrl.protocol !== "cloudinary:") {
      return null;
    }

    return {
      cloudName: cloudinaryUrl.hostname,
      apiKey: decodeURIComponent(cloudinaryUrl.username),
      apiSecret: decodeURIComponent(cloudinaryUrl.password),
    };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const config = getCloudinaryConfig();

  if (!config) {
    return Response.json({ error: "Cloudinary is not configured." }, { status: 500 });
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid upload request." }, { status: 400 });
  }

  const logo = formData.get("logo");

  if (!(logo instanceof File)) {
    return Response.json({ error: "Logo image is required." }, { status: 400 });
  }

  if (!logo.type.startsWith("image/")) {
    return Response.json({ error: "Logo must be an image file." }, { status: 400 });
  }

  if (logo.size > maxLogoBytes) {
    return Response.json({ error: "Logo must be 5MB or smaller." }, { status: 400 });
  }

  const timestamp = String(Math.floor(Date.now() / 1000));
  const publicId = `sponsor-logo-${timestamp}-${Math.random().toString(36).slice(2, 9)}`;
  const signatureParams = {
    folder: uploadFolder,
    public_id: publicId,
    timestamp,
  };
  const signature = signCloudinaryParams(signatureParams, config.apiSecret);
  const uploadData = new FormData();
  uploadData.set("file", logo);
  uploadData.set("api_key", config.apiKey);
  uploadData.set("timestamp", timestamp);
  uploadData.set("folder", uploadFolder);
  uploadData.set("public_id", publicId);
  uploadData.set("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
    method: "POST",
    body: uploadData,
  });
  const payload = (await response.json()) as CloudinaryUploadResponse;

  if (!response.ok || !payload.secure_url) {
    return Response.json(
      { error: payload.error?.message || "Logo upload failed." },
      { status: 500 },
    );
  }

  return Response.json({
    url: payload.secure_url,
    publicId: payload.public_id,
    width: payload.width,
    height: payload.height,
  });
}
