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
    return { title: "Radar day not found" };
  }

  const names = day.items.map((item) => item.name).join(", ");
  const description = day.items
    .map((item) => `${item.name}: ${item.take.en}`)
    .slice(0, 2)
    .join(" · ");

  return {
    title: `Radar · ${date}`,
    description: description || `Radar picks for ${date}: ${names}`,
    alternates: {
      canonical: `/radar/${date}`,
      languages: {
        en: `/radar/${date}`,
        fa: `/fa/radar/${date}`,
      },
    },
    openGraph: {
      title: `Radar · ${date} | Nima Aksoy`,
      description: description || names,
      url: absoluteDayUrl(date, "en"),
    },
  };
}

export default async function RadarDayPage({ params }: PageProps) {
  const { date } = await params;
  const day = await getRadarDay(date);
  if (!day) notFound();

  const dates = await getAllRadarDates();
  const index = dates.indexOf(date);
  // dates are newest-first
  const nextDate = index > 0 ? dates[index - 1] : null;
  const prevDate = index >= 0 && index < dates.length - 1 ? dates[index + 1] : null;

  return (
    <SiteChrome locale="en">
      <RadarDayView
        day={day}
        locale="en"
        prevDate={prevDate}
        nextDate={nextDate}
      />
    </SiteChrome>
  );
}
