import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RadarDayView } from "@/components/radar/RadarDayView";
import { SiteChrome } from "@/components/radar/SiteChrome";
import {
  absoluteDayUrl,
  getAllRadarDates,
  getRadarDay,
} from "@/lib/radar";

type PageProps = {
  params: Promise<{ date: string }>;
};

export async function generateStaticParams() {
  const dates = await getAllRadarDates();
  return dates.map((date) => ({ date }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { date } = await params;
  const day = await getRadarDay(date);
  if (!day) {
    return { title: "روز رادار پیدا نشد" };
  }

  const names = day.items.map((item) => item.name).join("، ");
  const description =
    day.items[0]?.why.fa || day.items[0]?.take.fa || `انتخاب‌های رادار برای ${date}: ${names}`;

  return {
    title: `رادار · ${date}`,
    description: description || `انتخاب‌های رادار برای ${date}: ${names}`,
    alternates: {
      canonical: `/fa/radar/${date}`,
      languages: {
        en: `/radar/${date}`,
        fa: `/fa/radar/${date}`,
      },
    },
    openGraph: {
      title: `رادار · ${date} | نیما آکسوی`,
      description: description || names,
      url: absoluteDayUrl(date, "fa"),
      locale: "fa_IR",
    },
  };
}

export default async function FaRadarDayPage({ params }: PageProps) {
  const { date } = await params;
  const day = await getRadarDay(date);
  if (!day) notFound();

  const dates = await getAllRadarDates();
  const index = dates.indexOf(date);
  const nextDate = index > 0 ? dates[index - 1] : null;
  const prevDate = index >= 0 && index < dates.length - 1 ? dates[index + 1] : null;

  return (
    <SiteChrome locale="fa">
      <RadarDayView
        day={day}
        locale="fa"
        prevDate={prevDate}
        nextDate={nextDate}
      />
    </SiteChrome>
  );
}
