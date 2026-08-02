"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import PromptCopyButton from "@/components/prompts/PromptCopyButton";
import PromptMedia from "@/components/prompts/PromptMedia";
import { formatTag, type Prompt, type PromptSort } from "@/lib/prompt-shared";

type PromptGridProps = {
  prompts: Prompt[];
  initialCounts: Record<string, number>;
  sort: PromptSort;
};

export default function PromptGrid({ prompts, initialCounts, sort }: PromptGridProps) {
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts);

  useEffect(() => {
    if (!prompts.length) {
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams({
      slugs: prompts.map((prompt) => prompt.slug).join(","),
    });

    fetch(`/api/prompts/copy-counts?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { counts?: Record<string, number> } | null) => {
        if (data?.counts) {
          setCounts((current) => ({ ...current, ...data.counts }));
        }
      })
      .catch(() => {
        // Counts are secondary. Cards remain usable with the server-rendered values.
      });

    return () => controller.abort();
  }, [prompts]);

  const visiblePrompts = useMemo(() => {
    if (sort !== "most-copied") {
      return prompts;
    }

    return [...prompts].sort(
      (a, b) => (counts[b.slug] ?? 0) - (counts[a.slug] ?? 0) || a.title.localeCompare(b.title)
    );
  }, [counts, prompts, sort]);

  if (!visiblePrompts.length) {
    return (
      <div className="border-y border-[#1F1F1F] py-12">
        <p className="font-monroe text-[24px] font-light text-[#EAEAEA]">
          No prompts found.
        </p>
        <p className="mt-3 max-w-lg font-jetbrains text-[13px] leading-[1.8] text-[#9A9A9A]">
          Try a different search term or remove a tag filter.
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
      {visiblePrompts.map((prompt) => (
        <article
          key={prompt.slug}
          className="mb-5 break-inside-avoid overflow-hidden rounded-[8px] border border-[#1F1F1F] bg-[#111111] transition hover:border-[#2CFF05]/40"
        >
          {prompt.media.length ? (
            <Link
              href={`/prompts/${prompt.slug}`}
              className="block focus:outline-none focus:ring-2 focus:ring-[#2CFF05]"
              aria-label={`Open ${prompt.title}`}
            >
              <PromptMedia media={prompt.media} title={prompt.title} compact />
            </Link>
          ) : null}

          <div className="p-5">
            <Link
              href={`/prompts/${prompt.slug}`}
              className="group block focus:outline-none focus:ring-2 focus:ring-[#2CFF05]"
            >
              <h2 className="font-monroe text-[24px] font-light leading-[1.12] text-[#EAEAEA] transition group-hover:text-[#2CFF05]">
                {prompt.title}
              </h2>
              <p className="mt-3 font-jetbrains text-[12px] leading-[1.8] text-[#9A9A9A]">
                {prompt.description}
              </p>
            </Link>

            <div className="mt-4 flex flex-wrap gap-2">
              {prompt.tags.slice(0, 4).map((tag) => (
                <Link
                  key={tag}
                  href={`/prompts/tag/${tag}`}
                  className="rounded-full border border-[#2A2A2A] px-3 py-1 font-jetbrains text-[10px] uppercase tracking-[0.12em] text-[#9A9A9A] transition hover:border-[#2CFF05] hover:text-[#2CFF05] focus:outline-none focus:ring-2 focus:ring-[#2CFF05]"
                >
                  {formatTag(tag)}
                </Link>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <PromptCopyButton
                slug={prompt.slug}
                body={prompt.body}
                count={counts[prompt.slug] ?? 0}
                onCountChange={(slug, count) =>
                  setCounts((current) => ({ ...current, [slug]: count }))
                }
              />
              {prompt.sourceUrl ? (
                <a
                  href={prompt.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#7F7F7F] transition hover:text-[#2CFF05] focus:outline-none focus:ring-2 focus:ring-[#2CFF05]"
                >
                  Open Original
                </a>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
