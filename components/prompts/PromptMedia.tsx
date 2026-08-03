"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

import type { PromptMedia as PromptMediaType } from "@/lib/prompt-shared";

type PromptMediaProps = {
  media: PromptMediaType[];
  title: string;
  compact?: boolean;
};

export default function PromptMedia({ media, title, compact = false }: PromptMediaProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!media.length) {
    return null;
  }

  const active = media[activeIndex] ?? media[0];
  const hasMultiple = media.length > 1;

  const previous = () => {
    setActiveIndex((index) => (index === 0 ? media.length - 1 : index - 1));
  };

  const next = () => {
    setActiveIndex((index) => (index + 1) % media.length);
  };

  return (
    <div className="relative overflow-hidden rounded-[8px] border border-[#1F1F1F] bg-[#0A0A0A]">
      {active.type === "image" ? (
        <img
          src={active.url}
          alt={active.alt || title}
          loading="lazy"
          // X/CDN hotlinks often 403 when Referer is our domain.
          referrerPolicy="no-referrer"
          className={`w-full object-cover ${compact ? "max-h-[360px]" : "max-h-[620px]"}`}
        />
      ) : (
        <video
          src={active.url}
          poster={active.poster}
          controls
          preload="metadata"
          playsInline
          className={`w-full bg-black object-contain ${compact ? "max-h-[360px]" : "max-h-[620px]"}`}
          aria-label={active.alt || `${title} video`}
        />
      )}

      {hasMultiple ? (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/75 px-3 py-2 backdrop-blur-sm">
          <button
            type="button"
            onClick={previous}
            className="rounded-full border border-[#3A3A3A] px-3 py-1 font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#EAEAEA] transition hover:border-[#2CFF05] hover:text-[#2CFF05] focus:outline-none focus:ring-2 focus:ring-[#2CFF05]"
            aria-label="Show previous media"
          >
            Prev
          </button>
          <span className="font-jetbrains text-[11px] text-[#9A9A9A]">
            {activeIndex + 1} / {media.length}
          </span>
          <button
            type="button"
            onClick={next}
            className="rounded-full border border-[#3A3A3A] px-3 py-1 font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#EAEAEA] transition hover:border-[#2CFF05] hover:text-[#2CFF05] focus:outline-none focus:ring-2 focus:ring-[#2CFF05]"
            aria-label="Show next media"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
