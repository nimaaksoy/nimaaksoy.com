import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PromptIndexPage from "@/components/prompts/PromptIndexPage";
import {
  formatTag,
  getAllTags,
  normalizePage,
  normalizeSort,
  normalizeTag,
  SITE_URL,
} from "@/lib/prompts";

type PromptTagPageProps = {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>;
};

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: tag.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: PromptTagPageProps): Promise<Metadata> {
  const [{ tag }, query] = await Promise.all([params, searchParams]);
  const normalizedTag = normalizeTag(tag);
  const label = formatTag(normalizedTag);
  const hasQuery = Boolean(query.q || query.sort || query.page);

  return {
    title: `${label} Prompts`,
    description: `Browse useful ${label.toLowerCase()} prompts from the public prompt library.`,
    alternates: {
      canonical: `/prompts/tag/${normalizedTag}`,
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/prompts/tag/${normalizedTag}`,
      title: `${label} Prompts | Nima Aksoy`,
      description: `Browse useful ${label.toLowerCase()} prompts from the public prompt library.`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${label} Prompts | Nima Aksoy`,
      description: `Browse useful ${label.toLowerCase()} prompts from the public prompt library.`,
    },
    robots: hasQuery
      ? {
          index: false,
          follow: true,
        }
      : undefined,
  };
}

export default async function PromptTagPage({ params, searchParams }: PromptTagPageProps) {
  const [{ tag }, query] = await Promise.all([params, searchParams]);
  const normalizedTag = normalizeTag(tag);
  const knownTag = getAllTags().some((item) => item.slug === normalizedTag);

  if (!knownTag) {
    notFound();
  }

  return (
    <PromptIndexPage
      q={query.q}
      tag={normalizedTag}
      sort={normalizeSort(query.sort)}
      page={normalizePage(query.page)}
      title={`${formatTag(normalizedTag)} Prompts`}
      description={`Useful ${formatTag(normalizedTag).toLowerCase()} prompts from the public library.`}
    />
  );
}
