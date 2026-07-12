import type { Metadata } from "next";
import { RadarIndex } from "@/components/radar/RadarIndex";
import { SiteChrome } from "@/components/radar/SiteChrome";
import { getAllRadarDays } from "@/lib/radar";

export const metadata: Metadata = {
  title: "Radar",
  description: "What I’m watching — open source and AI finds from Nima Aksoy.",
  alternates: {
    canonical: "/radar",
    languages: {
      en: "/radar",
      fa: "/fa/radar",
    },
  },
  openGraph: {
    title: "Radar | Nima Aksoy",
    description: "Open source and AI finds from Nima Aksoy.",
    url: "https://nimaaksoy.com/radar",
  },
};

export default async function RadarPage() {
  const days = await getAllRadarDays();

  return (
    <SiteChrome locale="en" active="radar" showLocaleSwitch>
      <RadarIndex days={days} locale="en" />
    </SiteChrome>
  );
}
