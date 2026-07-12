"use client";

import { useState } from "react";
import type { Locale } from "@/lib/radar-shared";

type ItemShareProps = {
  url: string;
  title: string;
  locale: Locale;
};

export function ItemShare({ url, title, locale }: ItemShareProps) {
  const [copied, setCopied] = useState(false);
  const isFa = locale === "fa";
  const labels = isFa
    ? { share: "اشتراک", copy: "کپی لینک", copied: "کپی شد", x: "X" }
    : { share: "Share", copy: "Copy link", copied: "Copied", x: "X" };

  const xHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const onNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled or unsupported — fall through
      }
    }
    await onCopy();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onNativeShare}
        className="signal-button inline-flex items-center rounded-full px-4 py-2 font-jetbrains text-[11px] uppercase tracking-[0.12em]"
      >
        {labels.share}
      </button>
      <a
        href={xHref}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border border-[#1F1F1F] px-4 py-2 font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#9A9A9A] transition hover:border-[#2CFF05] hover:text-[#2CFF05]"
      >
        {labels.x}
      </a>
      <a
        href={linkedinHref}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border border-[#1F1F1F] px-4 py-2 font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#9A9A9A] transition hover:border-[#2CFF05] hover:text-[#2CFF05]"
      >
        LinkedIn
      </a>
      <button
        type="button"
        onClick={onCopy}
        className="rounded-full border border-[#1F1F1F] px-4 py-2 font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#9A9A9A] transition hover:border-[#2CFF05] hover:text-[#2CFF05]"
      >
        {copied ? labels.copied : labels.copy}
      </button>
    </div>
  );
}
