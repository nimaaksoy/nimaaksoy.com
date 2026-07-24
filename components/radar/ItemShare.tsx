"use client";

import { useState } from "react";
import { withShareUrl } from "@/lib/radar-shared";

type ItemShareProps = {
  url: string;
  title: string;
  /** Human caption for X — never shown on page, only used in share intent */
  xCaption: string;
  /** Human caption for LinkedIn — never shown on page */
  linkedinCaption: string;
};

export function ItemShare({
  url,
  title,
  xCaption,
  linkedinCaption,
}: ItemShareProps) {
  const [copied, setCopied] = useState<"link" | "post" | null>(null);

  const xText = withShareUrl(xCaption, url);
  const linkedinText = withShareUrl(linkedinCaption, url);

  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(xText)}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const copyValue = async (key: "link" | "post", value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  };

  const onNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: xText, url });
        return;
      } catch {
        // cancelled
      }
    }
    await copyValue("post", xText);
  };

  const onLinkedIn = async () => {
    await copyValue("post", linkedinText);
    window.open(linkedinHref, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onNativeShare}
        className="signal-button inline-flex items-center rounded-full px-4 py-2 font-jetbrains text-[11px] uppercase tracking-[0.12em]"
      >
        Share
      </button>
      <a
        href={xHref}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border border-[#1F1F1F] px-4 py-2 font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#9A9A9A] transition hover:border-[#2CFF05] hover:text-[#2CFF05]"
      >
        X
      </a>
      <button
        type="button"
        onClick={onLinkedIn}
        className="rounded-full border border-[#1F1F1F] px-4 py-2 font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#9A9A9A] transition hover:border-[#2CFF05] hover:text-[#2CFF05]"
      >
        LinkedIn
      </button>
      <button
        type="button"
        onClick={() => copyValue("post", xText)}
        className="rounded-full border border-[#1F1F1F] px-4 py-2 font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#9A9A9A] transition hover:border-[#2CFF05] hover:text-[#2CFF05]"
      >
        {copied === "post" ? "Copied" : "Copy post"}
      </button>
      <button
        type="button"
        onClick={() => copyValue("link", url)}
        className="rounded-full border border-[#1F1F1F] px-4 py-2 font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#9A9A9A] transition hover:border-[#2CFF05] hover:text-[#2CFF05]"
      >
        {copied === "link" ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
