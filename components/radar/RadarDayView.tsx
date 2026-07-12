import Link from "next/link";
import type { Locale, RadarDay } from "@/lib/radar-shared";
import { dayPath, formatRadarDate } from "@/lib/radar-shared";
import { RadarItemCard } from "@/components/radar/RadarItemCard";

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
        items: "مورد",
        prev: "روز قبل",
        next: "روز بعد",
      }
    : {
        eyebrow: "RADAR",
        back: "All days",
        items: "items",
        prev: "Previous",
        next: "Next",
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
            href={locale === "fa" ? "/fa/radar" : "/radar"}
            className="font-jetbrains text-[12px] uppercase tracking-[0.14em] text-[#9A9A9A] transition hover:text-[#2CFF05]"
          >
            ← {labels.back}
          </Link>
        </div>

        <section className="mt-10 space-y-5">
          {day.items.map((item, index) => (
            <RadarItemCard
              key={item.slug}
              item={item}
              date={day.date}
              locale={locale}
              index={index}
            />
          ))}
        </section>

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
