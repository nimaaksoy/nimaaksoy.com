import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RadarItemView } from "@/components/radar/RadarItemView";
import { SiteChrome } from "@/components/radar/SiteChrome";
import {
  absoluteItemUrl,
  getAllRadarItemParams,
  getRadarItem,
} from "@/lib/radar";

type PageProps = {
  params: Promise<{ date: string; slug: string }>;
};

export async function generateStaticParams() {
  return getAllRadarItemParams();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { date, slug } = await params;
  const result = await getRadarItem(date, slug);
  if (!result) return { title: "Radar item not found" };

  const { item } = result;
  const description = item.why.en;
  const url = absoluteItemUrl(date, slug, "en");

  return {
    title: `${item.name} · Radar`,
    description,
    alternates: {
      canonical: `/radar/${date}/${slug}`,
      languages: {
        en: `/radar/${date}/${slug}`,
        fa: `/fa/radar/${date}/${slug}`,
      },
    },
    openGraph: {
      title: `${item.name} | Nima Aksoy Radar`,
      description,
      url,
      images: item.image ? [{ url: item.image }] : undefined,
    },
    twitter: {
      card: item.image ? "summary_large_image" : "summary",
      title: `${item.name} | Radar`,
      description,
      images: item.image ? [item.image] : undefined,
    },
  };
}

export default async function RadarItemPage({ params }: PageProps) {
  const { date, slug } = await params;
  const result = await getRadarItem(date, slug);
  if (!result) notFound();

  return (
    <SiteChrome locale="en">
      <RadarItemView day={result.day} item={result.item} locale="en" />
    </SiteChrome>
  );
}
