import type { Metadata } from "next";

import PromptIndexPage from "@/components/prompts/PromptIndexPage";
import { normalizeSort, SITE_URL } from "@/lib/prompts";

type PromptsPageProps = {
  searchParams: Promise<{ q?: string; tag?: string; sort?: string }>;
};

export async function generateMetadata({ searchParams }: PromptsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const hasQuery = Boolean(params.q || params.tag || params.sort);

  return {
    title: "Prompts",
    description:
      "A public collection of useful prompts contributed by builders, writers, researchers, and creative operators.",
    alternates: {
      canonical: "/prompts",
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/prompts`,
      title: "Prompts | Nima Aksoy",
      description:
        "A public collection of useful prompts contributed by builders, writers, researchers, and creative operators.",
      siteName: "Nima Aksoy",
    },
    twitter: {
      card: "summary_large_image",
      title: "Prompts | Nima Aksoy",
      description:
        "A public collection of useful prompts contributed by builders, writers, researchers, and creative operators.",
    },
    robots: hasQuery
      ? {
          index: false,
          follow: true,
        }
      : undefined,
  };
}

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
  const params = await searchParams;

  return (
    <PromptIndexPage
      q={params.q}
      tag={params.tag}
      sort={normalizeSort(params.sort)}
      page={1}
    />
  );
}
