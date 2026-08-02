import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PromptIndexPage from "@/components/prompts/PromptIndexPage";
import { getPaginationPages, normalizePage, normalizeSort, SITE_URL } from "@/lib/prompts";

type PromptPageRouteProps = {
  params: Promise<{ page: string }>;
  searchParams: Promise<{ q?: string; tag?: string; sort?: string }>;
};

export function generateStaticParams() {
  return getPaginationPages().map((page) => ({ page: String(page) }));
}

export async function generateMetadata({
  params,
  searchParams,
}: PromptPageRouteProps): Promise<Metadata> {
  const [{ page }, query] = await Promise.all([params, searchParams]);
  const pageNumber = normalizePage(page);
  const hasQuery = Boolean(query.q || query.tag || query.sort);

  return {
    title: `Prompts - Page ${pageNumber}`,
    description: `Browse page ${pageNumber} of the public prompt library.`,
    alternates: {
      canonical: `/prompts/page/${pageNumber}`,
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/prompts/page/${pageNumber}`,
      title: `Prompts - Page ${pageNumber} | Nima Aksoy`,
      description: `Browse page ${pageNumber} of the public prompt library.`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Prompts - Page ${pageNumber} | Nima Aksoy`,
      description: `Browse page ${pageNumber} of the public prompt library.`,
    },
    robots: hasQuery
      ? {
          index: false,
          follow: true,
        }
      : undefined,
  };
}

export default async function PromptPageRoute({
  params,
  searchParams,
}: PromptPageRouteProps) {
  const [{ page }, query] = await Promise.all([params, searchParams]);
  const pageNumber = normalizePage(page);
  const pages = getPaginationPages();

  if (!pages.includes(pageNumber)) {
    notFound();
  }

  return (
    <PromptIndexPage
      q={query.q}
      tag={query.tag}
      sort={normalizeSort(query.sort)}
      page={pageNumber}
      title={`Prompts / Page ${pageNumber}`}
    />
  );
}
