import Link from "next/link";
import type { Locale, RadarDay } from "@/lib/radar-shared";
import {
  copyForLocale,
  dayPath,
  formatRadarDate,
  itemPath,
} from "@/lib/radar-shared";

type RadarIndexProps = {
  days: RadarDay[];
  locale: Locale;
};

export function RadarIndex({ days, locale }: RadarIndexProps) {
  const isFa = locale === "fa";
  const labels = isFa
    ? {
        eyebrow: "رادار",
        title: "چی دارم نگاه می‌کنم",
        empty: "هنوز روزی ثبت نشده.",
        items: "مورد",
        open: "باز کردن روز",
      }
    : {
        eyebrow: "RADAR",
        title: "What I’m watching",
        empty: "No days published yet.",
        items: "items",
        open: "Open day",
      };

  return (
    <div className="px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-[860px]">
        <p className="font-jetbrains text-[11px] uppercase tracking-[0.2em] text-[#2CFF05]">
          {labels.eyebrow}
        </p>
        <h1 className="mt-4 font-monroe text-[clamp(38px,7vw,64px)] font-light leading-[1.04] text-[#EAEAEA]">
          {labels.title}
        </h1>

        <section className="mt-12 space-y-4">
          {days.length === 0 ? (
            <p className="font-monroe text-[16px] text-[#7F7F7F]">{labels.empty}</p>
          ) : (
            days.map((day) => {
              const lead = day.items[0];
              return (
                <article
                  key={day.date}
                  className="card-surface overflow-hidden rounded-2xl"
                >
                  {lead?.image ? (
                    <Link
                      href={dayPath(day.date, locale)}
                      className="block border-b border-[#1F1F1F]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={lead.image}
                        alt={lead.name}
                        className="h-44 w-full object-cover md:h-52"
                        loading="lazy"
                      />
                    </Link>
                  ) : null}
                  <div className="p-6 md:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-jetbrains text-[11px] uppercase tracking-[0.16em] text-[#7F7F7F]">
                          {formatRadarDate(day.date, locale)}
                        </p>
                        <h2 className="mt-2 font-monroe text-[24px] font-light text-[#EAEAEA] md:text-[28px]">
                          <Link
                            href={dayPath(day.date, locale)}
                            className="transition hover:text-[#2CFF05]"
                          >
                            {day.items.map((item) => item.name).join(" · ")}
                          </Link>
                        </h2>
                      </div>
                      <p className="font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#2CFF05]">
                        {day.items.length} {labels.items}
                      </p>
                    </div>
                    <ul className="mt-4 space-y-3">
                      {day.items.map((item) => (
                        <li key={item.slug}>
                          <Link
                            href={itemPath(day.date, item.slug, locale)}
                            className="block font-monroe text-[15px] leading-relaxed text-[#9A9A9A] transition hover:text-[#EAEAEA]"
                          >
                            <span className="text-[#EAEAEA]">{item.name}</span>
                            <span className="mt-1 block">
                              {copyForLocale(item.take, locale)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={dayPath(day.date, locale)}
                      className="mt-5 inline-block font-jetbrains text-[12px] uppercase tracking-[0.14em] text-[#2CFF05]"
                    >
                      {labels.open} →
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
}
