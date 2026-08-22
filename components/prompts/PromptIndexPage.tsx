import Link from "next/link";

import PromptFilters from "@/components/prompts/PromptFilters";
import PromptGrid from "@/components/prompts/PromptGrid";
import { SiteChrome } from "@/components/SiteChrome";
import { SponsorAdFrame } from "@/components/SponsorAdFrame";
import {
  getAllPrompts,
  getAllTags,
  getPromptPage,
  PROMPTS_CONTRIBUTING_URL,
  type PromptSort,
} from "@/lib/prompts";
import { getCopyCounts } from "@/lib/prompt-copy-counts";

type PromptIndexPageProps = {
  q?: string;
  tag?: string;
  sort?: PromptSort;
  page?: number;
  title?: string;
  description?: string;
};

function pageHref(page: number, tag?: string) {
  if (tag) {
    return page === 1 ? `/prompts/tag/${tag}` : `/prompts/tag/${tag}?page=${page}`;
  }
  return page === 1 ? "/prompts" : `/prompts/page/${page}`;
}

export default async function PromptIndexPage({
  q = "",
  tag,
  sort = "newest",
  page = 1,
  title = "Prompts",
  description = "A community-contributed collection of useful prompts for building, writing, research, product work, and creative production.",
}: PromptIndexPageProps) {
  const tags = getAllTags();
  const sortableCounts =
    sort === "most-copied"
      ? await getCopyCounts(getAllPrompts().map((prompt) => prompt.slug))
      : {};
  const result = getPromptPage({ q, tag, sort, page, copyCounts: sortableCounts });
  const initialCounts =
    sort === "most-copied"
      ? sortableCounts
      : await getCopyCounts(result.prompts.map((prompt) => prompt.slug));

  return (
    <SiteChrome active="prompts">
      <div className="bg-[#0A0A0A] px-6 py-16 md:px-10 md:py-20">
      <SponsorAdFrame>
      <div className="mx-auto max-w-[1180px]">
        <header className="grid gap-8 md:grid-cols-[1fr_360px] md:items-end">
          <div>
            <p className="font-jetbrains text-[11px] uppercase tracking-[0.2em] text-[#7F7F7F]">
              PUBLIC LIBRARY
            </p>
            <h1 className="mt-4 font-monroe text-[clamp(42px,9vw,72px)] font-light leading-[1.02] text-[#EAEAEA]">
              {title}
            </h1>
          </div>
          <p className="font-monroe text-[18px] italic leading-[1.65] text-[#9A9A9A]">
            {description}
          </p>
        </header>

        <div className="mt-6 flex flex-wrap gap-4 font-jetbrains text-[11px] uppercase tracking-[0.14em]">
          <a
            href={PROMPTS_CONTRIBUTING_URL}
            target="_blank"
            rel="noreferrer"
            className="text-[#2CFF05] transition hover:text-[#EAEAEA]"
          >
            Contribute
          </a>
          <Link href="/tools" className="text-[#7F7F7F] transition hover:text-[#2CFF05]">
            Tools
          </Link>
        </div>

        <section className="mt-10">
          <PromptFilters q={result.q} tag={result.tag} sort={result.sort} tags={tags} />
        </section>

        <section className="mt-10" aria-label="Prompt results">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="font-jetbrains text-[11px] uppercase tracking-[0.16em] text-[#7F7F7F]">
              {result.totalPrompts} prompt{result.totalPrompts === 1 ? "" : "s"}
            </p>
            <p className="font-jetbrains text-[11px] text-[#7F7F7F]">
              Page {result.currentPage} of {result.totalPages}
            </p>
          </div>
          <PromptGrid prompts={result.prompts} initialCounts={initialCounts} sort={result.sort} />
        </section>

        {result.totalPages > 1 ? (
          <nav
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
            aria-label="Prompt pages"
          >
            {Array.from({ length: result.totalPages }, (_, index) => index + 1).map((item) => (
              <Link
                key={item}
                href={pageHref(item, result.tag)}
                aria-current={item === result.currentPage ? "page" : undefined}
                className={`rounded-full border px-4 py-2 font-jetbrains text-[11px] uppercase tracking-[0.12em] transition focus:outline-none focus:ring-2 focus:ring-[#2CFF05] ${
                  item === result.currentPage
                    ? "border-[#2CFF05] text-[#2CFF05]"
                    : "border-[#2A2A2A] text-[#9A9A9A] hover:border-[#2CFF05] hover:text-[#2CFF05]"
                }`}
              >
                {item}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Prompts",
            description,
            url: "https://nimaaksoy.com/prompts",
            numberOfItems: result.totalPrompts,
          }),
        }}
      />
      </SponsorAdFrame>
      </div>
    </SiteChrome>
  );
}
