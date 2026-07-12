"use client";

import Link from "next/link";
import type { Locale, RadarItem } from "@/lib/radar-shared";
import {
  absoluteItemUrl,
  copyForLocale,
  itemPath,
} from "@/lib/radar-shared";
import { ItemShare } from "@/components/radar/ItemShare";

type RadarItemCardProps = {
  item: RadarItem;
  date: string;
  locale: Locale;
  index: number;
};

export function RadarItemCard({
  item,
  date,
  locale,
  index,
}: RadarItemCardProps) {
  const isFa = locale === "fa";
  const labels = isFa
    ? {
        why: "چرا مهمه",
        openSource: "منبع",
        openPost: "باز کردن",
      }
    : {
        why: "Why it matters",
        openSource: "Source",
        openPost: "Open",
      };

  const itemHref = itemPath(date, item.slug, locale);
  const shareUrl = absoluteItemUrl(date, item.slug, locale);
  const take = copyForLocale(item.take, locale);
  const why = copyForLocale(item.why, locale);

  return (
    <article className="card-surface overflow-hidden rounded-2xl">
      {item.image ? (
        <Link href={itemHref} className="block border-b border-[#1F1F1F]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.name}
            className="h-48 w-full object-cover md:h-56"
            loading="lazy"
          />
        </Link>
      ) : null}

      <div className="p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-baseline gap-3">
            <span className="font-jetbrains text-[12px] text-[#2CFF05]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="font-monroe text-[28px] font-light leading-none text-[#EAEAEA] md:text-[32px]">
              <Link href={itemHref} className="transition hover:text-[#2CFF05]">
                {item.name}
              </Link>
            </h2>
          </div>
        </div>

        <p className="mt-4 max-w-2xl font-monroe text-[18px] leading-[1.55] text-[#9A9A9A]">
          {take}
        </p>

        <details className="group mt-5 rounded-xl border border-[#1F1F1F] bg-[#0A0A0A] p-4 open:border-[#2CFF05]/30">
          <summary className="cursor-pointer list-none font-jetbrains text-[11px] uppercase tracking-[0.14em] text-[#2CFF05] marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-2">
              {labels.why}
              <span className="text-[#7F7F7F] transition group-open:rotate-45">
                +
              </span>
            </span>
          </summary>
          <p className="mt-3 font-monroe text-[16px] leading-[1.65] text-[#EAEAEA]/90">
            {why}
          </p>
        </details>

        {item.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#1F1F1F] px-3 py-1 font-jetbrains text-[10px] uppercase tracking-[0.12em] text-[#7F7F7F]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4 font-jetbrains text-[12px] uppercase tracking-[0.14em]">
            <Link href={itemHref} className="text-[#2CFF05] transition hover:opacity-80">
              {labels.openPost} →
            </Link>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="text-[#9A9A9A] transition hover:text-[#2CFF05]"
            >
              {labels.openSource} ↗
            </a>
          </div>
          <ItemShare
            url={shareUrl}
            title={item.name}
            locale={locale}
            xCaption={copyForLocale(item.share.x, locale)}
            linkedinCaption={copyForLocale(item.share.linkedin, locale)}
          />
        </div>
      </div>
    </article>
  );
}
