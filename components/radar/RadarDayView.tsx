import Link from "next/link";
import type { Locale, RadarDay } from "@/lib/radar-shared";
import {
  copyForLocale,
  dayPath,
  formatRadarDate,
  indexPath,
} from "@/lib/radar-shared";
import { ShareButtons } from "@/components/radar/ShareButtons";

type RadarDayViewProps = {
  day: RadarDay;
  locale: Locale;
  prevDate?: string | null;
  nextDate?: string | null;
};

export function RadarDayView({
  day,
  locale,
  prevDate,
  nextDate,
}: RadarDayViewProps) {
  const isFa = locale === "fa";
  const labels = isFa
    ? {
        eyebrow: "رادار",
        back: "همه روزها",
        open: "باز کردن پروژه",
        items: "مورد",
        prev: "روز قبل",
        next: "روز بعد",
        stars: "استار امروز",
      }
    : {
        eyebrow: "RADAR",
        back: "All days",
        open: "Open project",
        items: "items",
        prev: "Previous",
        next: "Next",
        stars: "gained today",
      };

  return (
    <div className="px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-[860px]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-jetbrains text-[11px] uppercase tracking-[0.2em] text-[#2CFF05]">
              {labels.eyebrow}
            </p>
            <h1 className="mt-3 font-monroe text-[clamp(34px,6vw,52px)] font-light leading-[1.05] text-[#EAEAEA]">
              {formatRadarDate(day.date, locale)}
            </h1>
            <p className="mt-3 font-jetbrains text-[12px] uppercase tracking-[0.14em] text-[#7F7F7F]">
              {day.items.length} {labels.items}
            </p>
          </div>
          <Link
            href={indexPath(locale)}
            className="font-jetbrains text-[12px] uppercase tracking-[0.14em] text-[#9A9A9A] transition hover:text-[#2CFF05]"
          >
            ← {labels.back}
          </Link>
        </div>

        <section className="mt-10 space-y-4">
          {day.items.map((item, index) => (
            <article
              key={item.slug}
              className="card-surface rounded-2xl p-6 md:p-7"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="font-jetbrains text-[12px] text-[#2CFF05]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-monroe text-[28px] font-light leading-none text-[#EAEAEA] md:text-[32px]">
                    {item.name}
                  </h2>
                </div>
                {typeof item.starsGained === "number" ? (
                  <p className="font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#7F7F7F]">
                    ★ {item.starsGained} {labels.stars}
                  </p>
                ) : null}
              </div>

              <p className="mt-4 max-w-2xl font-monroe text-[18px] leading-[1.55] text-[#9A9A9A]">
                {copyForLocale(item.take, locale)}
              </p>

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

              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-block font-jetbrains text-[12px] uppercase tracking-[0.14em] text-[#2CFF05] transition-opacity hover:opacity-80"
              >
                {labels.open} →
              </a>
            </article>
          ))}
        </section>

        <div className="mt-10">
          <ShareButtons day={day} locale={locale} />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#1F1F1F] pt-6 font-jetbrains text-[12px] uppercase tracking-[0.14em]">
          {prevDate ? (
            <Link
              href={dayPath(prevDate, locale)}
              className="text-[#9A9A9A] transition hover:text-[#2CFF05]"
            >
              ← {labels.prev}
            </Link>
          ) : (
            <span />
          )}
          {nextDate ? (
            <Link
              href={dayPath(nextDate, locale)}
              className="text-[#9A9A9A] transition hover:text-[#2CFF05]"
            >
              {labels.next} →
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
