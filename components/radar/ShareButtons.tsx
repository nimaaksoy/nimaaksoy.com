"use client";

import { useState } from "react";
import type { Locale, RadarDay } from "@/lib/radar-shared";
import { absoluteDayUrl, copyForLocale } from "@/lib/radar-shared";

type ShareButtonsProps = {
  day: RadarDay;
  locale: Locale;
};

export function ShareButtons({ day, locale }: ShareButtonsProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const dayUrl = absoluteDayUrl(day.date, locale);
  const xCaption = copyForLocale(day.social.x, locale);
  const linkedinCaption = copyForLocale(day.social.linkedin, locale);

  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(xCaption)}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(dayUrl)}`;

  const labels =
    locale === "fa"
      ? {
          title: "اشتراک‌گذاری",
          x: "اشتراک در X",
          linkedin: "اشتراک در LinkedIn",
          copyX: "کپی کپشن X",
          copyLi: "کپی کپشن LinkedIn",
          copied: "کپی شد",
          hint: "کپشن آماده است. لینک روز به سایت برمی‌گردد.",
        }
      : {
          title: "Share",
          x: "Share on X",
          linkedin: "Share on LinkedIn",
          copyX: "Copy X caption",
          copyLi: "Copy LinkedIn caption",
          copied: "Copied",
          hint: "Captions are ready. Day link points back to this site.",
        };

  const copyText = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  };

  return (
    <section className="rounded-2xl border border-[#1F1F1F] bg-[#111111] p-6 md:p-7">
      <p className="font-jetbrains text-[11px] uppercase tracking-[0.2em] text-[#7F7F7F]">
        {labels.title}
      </p>
      <p className="mt-2 font-monroe text-[15px] text-[#9A9A9A]">{labels.hint}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={xHref}
          target="_blank"
          rel="noreferrer"
          className="signal-button inline-flex items-center rounded-full px-5 py-2.5 font-jetbrains text-[11px] uppercase tracking-[0.12em]"
        >
          {labels.x}
        </a>
        <a
          href={linkedinHref}
          target="_blank"
          rel="noreferrer"
          className="signal-button inline-flex items-center rounded-full px-5 py-2.5 font-jetbrains text-[11px] uppercase tracking-[0.12em]"
        >
          {labels.linkedin}
        </a>
        <button
          type="button"
          onClick={() => copyText("x", xCaption)}
          className="rounded-full border border-[#1F1F1F] px-5 py-2.5 font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#9A9A9A] transition hover:border-[#2CFF05] hover:text-[#2CFF05]"
        >
          {copied === "x" ? labels.copied : labels.copyX}
        </button>
        <button
          type="button"
          onClick={() => copyText("li", linkedinCaption)}
          className="rounded-full border border-[#1F1F1F] px-5 py-2.5 font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#9A9A9A] transition hover:border-[#2CFF05] hover:text-[#2CFF05]"
        >
          {copied === "li" ? labels.copied : labels.copyLi}
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl border border-[#1F1F1F] bg-[#0A0A0A] p-4 font-monroe text-[14px] leading-relaxed text-[#9A9A9A]">
          {xCaption}
        </pre>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl border border-[#1F1F1F] bg-[#0A0A0A] p-4 font-monroe text-[14px] leading-relaxed text-[#9A9A9A]">
          {linkedinCaption}
        </pre>
      </div>
    </section>
  );
}
