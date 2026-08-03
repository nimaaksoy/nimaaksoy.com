import type { Metadata } from "next";
import LifeInDotsApp from "@/components/life-in-dots/LifeInDotsApp";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Life in Dots — See Your Life in Time",
  description:
    "Visualize the days, months, years and hours you have lived, explore the time that may still be ahead, and make today count.",
  applicationName: "Life in Dots",
  keywords: [
    "Life in Dots",
    "life calendar",
    "new tab extension",
    "time visualization",
    "daily intention",
    "days lived",
    "make today count",
  ],
  authors: [{ name: "Nima Aksoy", url: "https://nimaaksoy.com" }],
  creator: "@nima1980",
  alternates: {
    canonical: "/life-in-dots",
  },
  openGraph: {
    title: "Life in Dots — See Your Life in Time",
    description:
      "Visualize the days, months, years and hours you have lived, explore the time that may still be ahead, and make today count.",
    url: "https://nimaaksoy.com/life-in-dots",
    type: "website",
    siteName: "Nima Aksoy",
    locale: "en_US",
    images: [
      {
        url: "/life-in-dots-og.png",
        width: 1200,
        height: 630,
        alt: "Life in Dots new tab experience showing a daily intention and a timeline made of dots.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Life in Dots — See Your Life in Time",
    description:
      "Visualize the days, months, years and hours you have lived, explore the time that may still be ahead, and make today count.",
    creator: "@nima1980",
    site: "@nima1980",
    images: [
      {
        url: "/life-in-dots-og.png",
        alt: "Life in Dots new tab experience showing a daily intention and a timeline made of dots.",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LifeInDotsPage() {
  return (
    <SiteChrome>
      <LifeInDotsApp />
    </SiteChrome>
  );
}
