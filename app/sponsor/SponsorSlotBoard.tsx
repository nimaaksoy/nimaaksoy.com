"use client";

import Image from "next/image";
import { useState } from "react";
import {
  IconArrowRight,
  IconLink,
  IconLoader2,
  IconPhoto,
  IconUpload,
  IconX,
} from "@tabler/icons-react";

export type SponsorSlotForBoard = {
  id: string;
  rail: "left" | "right";
  name: string;
  line: string;
  href: string;
  logo: string;
  status: "taken" | "open";
  reservedUntil?: string;
};

type CheckoutResponse = {
  checkoutUrl?: string;
  error?: string;
};

type LogoUploadResponse = {
  url?: string;
  error?: string;
};

type LogoMode = "upload" | "url";

const logoDisplaySize = 48;
const resizedLogoSize = logoDisplaySize * 2;
const maxLogoBytes = 5 * 1024 * 1024;

async function loadLogoImage(file: File) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Logo image could not be read."));
      img.src = objectUrl;
    });

    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function resizeLogo(file: File) {
  const image = await loadLogoImage(file);
  const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
  const sourceX = (image.naturalWidth - sourceSize) / 2;
  const sourceY = (image.naturalHeight - sourceSize) / 2;
  const canvas = document.createElement("canvas");
  canvas.width = resizedLogoSize;
  canvas.height = resizedLogoSize;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Logo image could not be resized.");
  }

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    0,
    0,
    resizedLogoSize,
    resizedLogoSize,
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png", 0.92),
  );

  if (!blob) {
    throw new Error("Logo image could not be resized.");
  }

  return {
    blob,
    previewUrl: canvas.toDataURL("image/png"),
  };
}

function SlotAd({ slot }: { slot: SponsorSlotForBoard }) {
  return (
    <a
      href={slot.href}
      className="group grid h-[86px] grid-cols-[48px_1fr] gap-3 overflow-hidden rounded-[8px] border border-[#202020] bg-[#111111] p-3 transition hover:border-[#2CFF05]/60 hover:bg-[#151515]"
    >
      <Image
        src={slot.logo}
        alt={`${slot.name} logo`}
        width={48}
        height={48}
        className="aspect-square rounded-[8px] border border-[#242424] object-cover"
      />
      <div className="min-w-0">
        <h3 className="truncate font-monroe text-[16px] font-light leading-[1.2] text-[#EAEAEA]">
          {slot.name}
        </h3>
        <p className="mt-1 line-clamp-2 font-jetbrains text-[10px] leading-[1.45] text-[#9A9A9A]">
          {slot.line}
        </p>
      </div>
    </a>
  );
}

function OpenSlotAd({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-[86px] grid-cols-[48px_1fr] gap-3 overflow-hidden rounded-[8px] border border-[#2CFF05]/70 bg-[#111111] p-3 text-left transition hover:border-[#2CFF05] hover:bg-[#151515]"
    >
      <span className="flex aspect-square h-12 w-12 items-center justify-center rounded-[8px] border border-[#242424]">
        <span className="font-monroe text-[26px] font-light text-[#2CFF05]">+</span>
      </span>
      <span className="min-w-0">
        <span className="block truncate font-monroe text-[16px] font-light leading-[1.2] text-[#EAEAEA]">
          Become sponsor
        </span>
        <span className="mt-1 block font-jetbrains text-[10px] leading-[1.45] text-[#9A9A9A]">
          Add your ad details and continue to payment.
        </span>
      </span>
    </button>
  );
}

export default function SponsorSlotBoard({ slots }: { slots: SponsorSlotForBoard[] }) {
  const [selectedSlot, setSelectedSlot] = useState<SponsorSlotForBoard | null>(null);
  const [months, setMonths] = useState<1 | 3>(1);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [logoMode, setLogoMode] = useState<LogoMode>("upload");
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState("");
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState("");
  const [uploadStatus, setUploadStatus] =
    useState<"idle" | "loading" | "ready" | "error">("idle");
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState("");

  function closeModal() {
    setSelectedSlot(null);
    setMonths(1);
    setStatus("idle");
    setLogoMode("upload");
    setUploadedLogoUrl("");
    setUploadedPreviewUrl("");
    setUploadStatus("idle");
    setUploadError("");
    setError("");
  }

  async function handleLogoUpload(file: File | undefined) {
    setUploadedLogoUrl("");
    setUploadedPreviewUrl("");
    setUploadError("");
    setUploadStatus("idle");

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadStatus("error");
      setUploadError("Upload an image file.");
      return;
    }

    if (file.size > maxLogoBytes) {
      setUploadStatus("error");
      setUploadError("Logo must be 5MB or smaller.");
      return;
    }

    setUploadStatus("loading");

    try {
      const resizedLogo = await resizeLogo(file);
      const uploadData = new FormData();
      uploadData.set("logo", resizedLogo.blob, "sponsor-logo.png");

      const response = await fetch("/api/sponsor-logo-upload", {
        method: "POST",
        body: uploadData,
      });
      const payload = (await response.json()) as LogoUploadResponse;

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Logo upload failed.");
      }

      setUploadedPreviewUrl(resizedLogo.previewUrl);
      setUploadedLogoUrl(payload.url);
      setUploadStatus("ready");
    } catch (uploadError) {
      const message =
        uploadError instanceof Error ? uploadError.message : "Logo upload failed.";
      setUploadStatus("error");
      setUploadError(message);
    }
  }

  async function handleSubmit(formData: FormData) {
    if (!selectedSlot) {
      return;
    }

    setStatus("loading");
    setError("");

    const logoUrl =
      logoMode === "upload"
        ? uploadedLogoUrl
        : String(formData.get("logoUrl") || "").trim();

    if (!logoUrl) {
      setStatus("error");
      setError("Add a logo URL or upload a logo image.");
      return;
    }

    const response = await fetch("/api/sponsor-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slotId: selectedSlot.id,
        months,
        company: formData.get("company"),
        text: formData.get("text"),
        logoUrl,
        url: formData.get("url"),
        email: formData.get("email"),
      }),
    });
    const payload = (await response.json()) as CheckoutResponse;

    if (!response.ok || !payload.checkoutUrl) {
      setStatus("error");
      setError(payload.error || "Checkout could not be started.");
      return;
    }

    window.location.href = payload.checkoutUrl;
  }

  return (
    <>
      <div className="mt-5 grid gap-4 sm:grid-cols-[repeat(auto-fill,220px)]">
        {slots.map((slot) => (
          <article key={slot.id} className="w-full sm:w-[220px]">
            {slot.status === "taken" ? (
              <SlotAd slot={slot} />
            ) : (
              <OpenSlotAd onClick={() => setSelectedSlot(slot)} />
            )}
            <div className="mt-2 flex min-h-5 items-center justify-between gap-3 font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
              <span>
                Slot {slot.id} · {slot.rail === "left" ? "Left rail" : "Right rail"}
              </span>
              {slot.status === "taken" && slot.reservedUntil ? (
                <span>Available {slot.reservedUntil}</span>
              ) : (
                <span className="text-[#2CFF05]">Open</span>
              )}
            </div>
          </article>
        ))}
      </div>

      {selectedSlot ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-[620px] overflow-auto rounded-[8px] border border-[#242424] bg-[#111111] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
                  Slot {selectedSlot.id}
                </p>
                <h3 className="mt-2 font-monroe text-[30px] font-light text-[#EAEAEA]">
                  Become sponsor
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#262626] text-[#9A9A9A] transition hover:border-[#2CFF05]/60 hover:text-[#EAEAEA]"
                aria-label="Close"
              >
                <IconX size={16} />
              </button>
            </div>

            <form action={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-2 rounded-[8px] border border-[#1F1F1F] bg-[#0A0A0A] p-1">
                {([1, 3] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setMonths(option)}
                    className={`min-h-10 rounded-[6px] px-3 font-jetbrains text-[11px] uppercase transition ${
                      months === option
                        ? "bg-[#2CFF05] text-[#0A0A0A]"
                        : "text-[#9A9A9A] hover:text-[#EAEAEA]"
                    }`}
                  >
                    {option} {option === 1 ? "month" : "months"} · ${option * 300}
                  </button>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
                    Name · 28 max
                  </span>
                  <input
                    name="company"
                    required
                    maxLength={28}
                    placeholder="Company"
                    className="h-11 w-full rounded-[8px] border border-[#262626] bg-[#0A0A0A] px-3 font-jetbrains text-[12px] text-[#EAEAEA] outline-none transition focus:border-[#2CFF05]"
                  />
                </label>
                <label className="space-y-2">
                  <span className="font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
                    Email · 80 max
                  </span>
                  <input
                    name="email"
                    required
                    type="email"
                    maxLength={80}
                    placeholder="you@company.com"
                    className="h-11 w-full rounded-[8px] border border-[#262626] bg-[#0A0A0A] px-3 font-jetbrains text-[12px] text-[#EAEAEA] outline-none transition focus:border-[#2CFF05]"
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
                  Text · 72 max
                </span>
                <input
                  name="text"
                  required
                  maxLength={72}
                  placeholder="One clear sentence."
                  className="h-11 w-full rounded-[8px] border border-[#262626] bg-[#0A0A0A] px-3 font-jetbrains text-[12px] text-[#EAEAEA] outline-none transition focus:border-[#2CFF05]"
                />
              </label>

              <div className="space-y-3 rounded-[8px] border border-[#1F1F1F] bg-[#0A0A0A] p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
                    Logo · 1:1
                  </span>
                  <div className="grid grid-cols-2 rounded-[8px] border border-[#262626] p-1">
                    {(["upload", "url"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => {
                          setLogoMode(mode);
                          setError("");
                        }}
                        className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-[6px] px-3 font-jetbrains text-[10px] uppercase transition ${
                          logoMode === mode
                            ? "bg-[#2CFF05] text-[#0A0A0A]"
                            : "text-[#9A9A9A] hover:text-[#EAEAEA]"
                        }`}
                      >
                        {mode === "upload" ? <IconUpload size={13} /> : <IconLink size={13} />}
                        {mode === "upload" ? "Upload" : "Link"}
                      </button>
                    ))}
                  </div>
                </div>

                {logoMode === "upload" ? (
                  <div className="grid gap-3 sm:grid-cols-[64px_1fr]">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[8px] border border-[#262626] bg-[#111111]">
                      {uploadedPreviewUrl ? (
                        <Image
                          src={uploadedPreviewUrl}
                          alt="Logo preview"
                          width={64}
                          height={64}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <IconPhoto size={20} className="text-[#7F7F7F]" />
                      )}
                    </div>
                    <label className="flex min-h-16 cursor-pointer flex-col justify-center rounded-[8px] border border-dashed border-[#2CFF05]/50 bg-[#111111] px-3 transition hover:border-[#2CFF05]">
                      <span className="font-jetbrains text-[11px] uppercase text-[#EAEAEA]">
                        Choose image
                      </span>
                      <span className="mt-1 font-jetbrains text-[10px] leading-[1.5] text-[#7F7F7F]">
                        Cropped square and resized to {resizedLogoSize}px automatically.
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => handleLogoUpload(event.currentTarget.files?.[0])}
                      />
                    </label>
                  </div>
                ) : (
                  <input
                    name="logoUrl"
                    required={logoMode === "url"}
                    type="url"
                    placeholder="https://example.com/logo.png"
                    className="h-11 w-full rounded-[8px] border border-[#262626] bg-[#111111] px-3 font-jetbrains text-[12px] text-[#EAEAEA] outline-none transition focus:border-[#2CFF05]"
                  />
                )}

                {uploadStatus === "loading" ? (
                  <p className="inline-flex items-center gap-2 font-jetbrains text-[10px] uppercase text-[#9A9A9A]">
                    <IconLoader2 size={13} className="animate-spin" />
                    Uploading logo
                  </p>
                ) : null}
                {uploadStatus === "ready" ? (
                  <p className="font-jetbrains text-[10px] uppercase text-[#2CFF05]">
                    Logo ready
                  </p>
                ) : null}
                {uploadError ? (
                  <p className="font-jetbrains text-[11px] leading-[1.6] text-[#ff6b6b]">
                    {uploadError}
                  </p>
                ) : null}
              </div>

              <label className="block space-y-2">
                <span className="font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
                  Destination URL
                </span>
                <input
                  name="url"
                  required
                  type="url"
                  placeholder="https://example.com"
                  className="h-11 w-full rounded-[8px] border border-[#262626] bg-[#0A0A0A] px-3 font-jetbrains text-[12px] text-[#EAEAEA] outline-none transition focus:border-[#2CFF05]"
                />
              </label>

              <button
                type="submit"
                disabled={status === "loading" || uploadStatus === "loading"}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[8px] border border-[#2CFF05] px-4 font-jetbrains text-[11px] uppercase text-[#2CFF05] transition hover:bg-[#2CFF05] hover:text-[#0A0A0A] disabled:cursor-wait disabled:opacity-70"
              >
                {status === "loading" ? (
                  <IconLoader2 size={16} className="animate-spin" />
                ) : (
                  <IconArrowRight size={16} />
                )}
                Continue to payment
              </button>
              {error ? (
                <p className="font-jetbrains text-[11px] leading-[1.6] text-[#ff6b6b]">
                  {error}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
