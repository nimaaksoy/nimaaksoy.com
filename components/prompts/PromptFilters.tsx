import Link from "next/link";

import { formatTag, PROMPTS_CONTRIBUTING_URL, type PromptSort } from "@/lib/prompts";

type PromptFiltersProps = {
  q: string;
  tag?: string;
  sort: PromptSort;
  tags: Array<{ slug: string; label: string; count: number }>;
};

export default function PromptFilters({ q, tag, sort, tags }: PromptFiltersProps) {
  return (
    <div className="border-y border-[#1F1F1F] py-6">
      <form action="/prompts" className="grid gap-4 md:grid-cols-[1fr_220px_auto]">
        {tag ? <input type="hidden" name="tag" value={tag} /> : null}
        <label className="block">
          <span className="sr-only">Search prompts</span>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search prompts"
            className="h-12 w-full rounded-[8px] border border-[#1F1F1F] bg-[#0A0A0A] px-4 font-jetbrains text-[13px] text-[#EAEAEA] outline-none transition placeholder:text-[#5A5A5A] focus:border-[#2CFF05]"
          />
        </label>
        <label className="block">
          <span className="sr-only">Sort prompts</span>
          <select
            name="sort"
            defaultValue={sort}
            className="h-12 w-full rounded-[8px] border border-[#1F1F1F] bg-[#0A0A0A] px-4 font-jetbrains text-[12px] uppercase tracking-[0.1em] text-[#EAEAEA] outline-none transition focus:border-[#2CFF05]"
          >
            <option value="newest">Newest</option>
            <option value="most-copied">Most copied</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </label>
        <button
          type="submit"
          className="signal-button h-12 rounded-full px-6 font-jetbrains text-[12px] uppercase tracking-[0.12em]"
        >
          Apply
        </button>
      </form>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/prompts"
          aria-current={!tag ? "page" : undefined}
          className={`rounded-full border px-3 py-1.5 font-jetbrains text-[10px] uppercase tracking-[0.12em] transition focus:outline-none focus:ring-2 focus:ring-[#2CFF05] ${
            !tag
              ? "border-[#2CFF05] text-[#2CFF05]"
              : "border-[#2A2A2A] text-[#9A9A9A] hover:border-[#2CFF05] hover:text-[#2CFF05]"
          }`}
        >
          All
        </Link>
        {tags.map((item) => (
          <Link
            key={item.slug}
            href={`/prompts/tag/${item.slug}`}
            aria-current={tag === item.slug ? "page" : undefined}
            className={`rounded-full border px-3 py-1.5 font-jetbrains text-[10px] uppercase tracking-[0.12em] transition focus:outline-none focus:ring-2 focus:ring-[#2CFF05] ${
              tag === item.slug
                ? "border-[#2CFF05] text-[#2CFF05]"
                : "border-[#2A2A2A] text-[#9A9A9A] hover:border-[#2CFF05] hover:text-[#2CFF05]"
            }`}
          >
            {item.label} {item.count}
          </Link>
        ))}
      </div>

      <p className="mt-5 font-jetbrains text-[11px] leading-[1.8] text-[#7F7F7F]">
        Found something useful?{" "}
        <a
          href={PROMPTS_CONTRIBUTING_URL}
          target="_blank"
          rel="noreferrer"
          className="text-[#2CFF05] underline-offset-4 hover:underline"
        >
          Contribute through GitHub
        </a>
        . Reuse tags like {tag ? formatTag(tag) : "Video, Writing, Product, Research"} when
        they fit.
      </p>
    </div>
  );
}
