import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RadarProjectView } from "@/components/radar/RadarProjectView";
import { SiteChrome } from "@/components/radar/SiteChrome";
import {
  absoluteItemUrl,
  getAllRadarSlugs,
  getRadarProject,
} from "@/lib/radar";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllRadarSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getRadarProject(slug);
  if (!project) return { title: "Radar item not found" };

  const description = project.why.en || project.take.en;
  const url = absoluteItemUrl(slug);

  return {
    title: `${project.name} · Radar`,
    description,
    alternates: {
      canonical: `/radar/${slug}`,
    },
    openGraph: {
      title: `${project.name} | Nima Aksoy Radar`,
      description,
      url,
      type: "article",
      siteName: "Nima Aksoy",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | Radar`,
      description,
      creator: "@Nima1980",
    },
  };
}

export default async function RadarProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getRadarProject(slug);
  if (!project) notFound();

  return (
    <SiteChrome active="radar">
      <RadarProjectView project={project} />
    </SiteChrome>
  );
}
