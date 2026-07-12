import Link from "next/link";
import type { Locale, RadarDay } from "@/lib/radar-shared";
import {
  copyForLocale,
  dayPath,
  formatRadarDate,
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
        subtitle:
          "هر روز ۱ تا ۵ پروژه یا آپدیت متن‌باز و هوش مصنوعی که واقعاً ارزش اشتراک دارن. نه همه‌چیز — فقط چیزایی که ارزش وقتت رو دارن.",
        empty: "هنوز روزی ثبت نشده.",
        items: "مورد",
        open: "باز کردن روز",
      }
    : {
        eyebrow: "RADAR",
        title: "What I’m watching",
        subtitle:
          "1–5 open source and AI finds a day — only things worth sharing. Short takes, no noise.",
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
        <p className="mt-5 max-w-2xl font-monroe text-[18px] italic leading-[1.55] text-[#9A9A9A]">
          {labels.subtitle}
        </p>

        <section className="mt-12 space-y-4">
          {days.length === 0 ? (
            <p className="font-monroe text-[16px] text-[#7F7F7F]">{labels.empty}</p>
          ) : (
            days.map((day) => (
              <Link
                key={day.date}
                href={dayPath(day.date, locale)}
                className="card-surface block rounded-2xl p-6 md:p-7"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-jetbrains text-[11px] uppercase tracking-[0.16em] text-[#7F7F7F]">
                      {formatRadarDate(day.date, locale)}
                    </p>
                    <h2 className="mt-2 font-monroe text-[24px] font-light text-[#EAEAEA] md:text-[28px]">
                      {day.items.map((item) => item.name).join(" · ")}
                    </h2>
                  </div>
                  <p className="font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#2CFF05]">
                    {day.items.length} {labels.items}
                  </p>
                </div>
                <ul className="mt-4 space-y-2">
                  {day.items.slice(0, 3).map((item) => (
                    <li
                      key={item.slug}
                      className="font-monroe text-[15px] leading-relaxed text-[#9A9A9A]"
                    >
                      <span className="text-[#EAEAEA]">{item.name}</span>
                      {" — "}
                      {copyForLocale(item.take, locale)}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 font-jetbrains text-[12px] uppercase tracking-[0.14em] text-[#2CFF05]">
                  {labels.open} →
                </p>
              </Link>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
