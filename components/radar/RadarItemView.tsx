import Link from "next/link";
import type { Locale, RadarDay, RadarItem } from "@/lib/radar-shared";
import {
  absoluteItemUrl,
  copyForLocale,
  dayPath,
  formatRadarDate,
  indexPath,
} from "@/lib/radar-shared";
import { ItemShare } from "@/components/radar/ItemShare";

type RadarItemViewProps = {
  day: RadarDay;
  item: RadarItem;
  locale: Locale;
};

export function RadarItemView({ day, item, locale }: RadarItemViewProps) {
  const isFa = locale === "fa";
  const labels = isFa
    ? {
        eyebrow: "رادار",
        backDay: "برگشت به روز",
        backAll: "همه روزها",
        why: "چرا مهمه",
        source: "منبع اصلی",
      }
    : {
        eyebrow: "RADAR",
        backDay: "Back to day",
        backAll: "All days",
        why: "Why it matters",
        source: "Source",
      };

  const take = copyForLocale(item.take, locale);
  const why = copyForLocale(item.why, locale);
  const shareUrl = absoluteItemUrl(day.date, item.slug, locale);

  return (
    <div className="px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-[760px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-jetbrains text-[11px] uppercase tracking-[0.2em] text-[#2CFF05]">
            {labels.eyebrow}
          </p>
          <div className="flex flex-wrap gap-4 font-jetbrains text-[12px] uppercase tracking-[0.14em] text-[#9A9A9A]">
            <Link
              href={dayPath(day.date, locale)}
              className="transition hover:text-[#2CFF05]"
            >
              ← {labels.backDay}
            </Link>
            <Link
              href={indexPath(locale)}
              className="transition hover:text-[#2CFF05]"
            >
              {labels.backAll}
            </Link>
          </div>
        </div>

        <p className="mt-6 font-jetbrains text-[12px] uppercase tracking-[0.14em] text-[#7F7F7F]">
          {formatRadarDate(day.date, locale)}
        </p>

        <h1 className="mt-3 font-monroe text-[clamp(36px,7vw,56px)] font-light leading-[1.05] text-[#EAEAEA]">
          {item.name}
        </h1>

        <p className="mt-5 font-monroe text-[20px] leading-[1.55] text-[#9A9A9A]">
          {take}
        </p>

        {item.image ? (
          <div className="mt-8 overflow-hidden rounded-2xl border border-[#1F1F1F]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.name}
              className="max-h-[420px] w-full object-cover"
            />
          </div>
        ) : null}

        <section className="mt-10 rounded-2xl border border-[#1F1F1F] bg-[#111111] p-6 md:p-8">
          <p className="font-jetbrains text-[11px] uppercase tracking-[0.2em] text-[#2CFF05]">
            {labels.why}
          </p>
          <p className="mt-4 font-monroe text-[18px] leading-[1.7] text-[#EAEAEA]">
            {why}
          </p>
        </section>

        {item.tags?.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
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

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#1F1F1F] pt-6">
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="font-jetbrains text-[12px] uppercase tracking-[0.14em] text-[#2CFF05] transition hover:opacity-80"
          >
            {labels.source} ↗
          </a>
          <ItemShare
            url={shareUrl}
            title={item.name}
            locale={locale}
            xCaption={copyForLocale(item.share.x, locale)}
            linkedinCaption={copyForLocale(item.share.linkedin, locale)}
          />
        </div>
      </div>
    </div>
  );
}
