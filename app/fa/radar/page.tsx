import type { Metadata } from "next";
import { RadarIndex } from "@/components/radar/RadarIndex";
import { SiteChrome } from "@/components/radar/SiteChrome";
import { getAllRadarDays } from "@/lib/radar";

export const metadata: Metadata = {
  title: "رادار",
  description: "چی دارم نگاه می‌کنم — پروژه‌های متن‌باز و هوش مصنوعی از نیما آکسوی.",
  alternates: {
    canonical: "/fa/radar",
    languages: {
      en: "/radar",
      fa: "/fa/radar",
    },
  },
  openGraph: {
    title: "رادار | نیما آکسوی",
    description: "پروژه‌های متن‌باز و آپدیت‌های AI — کوتاه و گزیده.",
    url: "https://nimaaksoy.com/fa/radar",
    locale: "fa_IR",
  },
};

export default async function FaRadarPage() {
  const days = await getAllRadarDays();

  return (
    <SiteChrome locale="fa">
      <RadarIndex days={days} locale="fa" />
    </SiteChrome>
  );
}
