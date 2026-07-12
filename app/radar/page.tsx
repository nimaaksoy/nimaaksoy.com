import type { Metadata } from "next";
import { RadarIndex } from "@/components/radar/RadarIndex";
import { SiteChrome } from "@/components/radar/SiteChrome";
import { getAllRadarDays } from "@/lib/radar";

export const metadata: Metadata = {
  title: "Radar",
  description:
    "What I’m watching — 1–5 open source and AI finds a day, only things worth sharing.",
  alternates: {
    canonical: "/radar",
    languages: {
      en: "/radar",
      fa: "/fa/radar",
    },
  },
  openGraph: {
    title: "Radar | Nima Aksoy",
    description:
      "Curated open source and AI finds — short takes, no noise.",
    url: "https://nimaaksoy.com/radar",
  },
};

export default async function RadarPage() {
  const days = await getAllRadarDays();

  return (
    <SiteChrome locale="en">
      <RadarIndex days={days} locale="en" />
    </SiteChrome>
  );
}
