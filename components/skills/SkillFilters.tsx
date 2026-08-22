import Link from "next/link";

import type { SkillCategory } from "@/lib/skills";

export function SkillFilters({
  q,
  category,
  tag,
  categories,
  tags,
}: {
  q: string;
  category?: string;
  tag?: string;
  categories: SkillCategory[];
  tags: string[];
}) {
  return (
    <div className="space-y-5">
      <form action="/skills" className="grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search skills"
          className="h-12 rounded-[8px] border border-[#262626] bg-[#111111] px-4 font-jetbrains text-[12px] text-[#EAEAEA] outline-none transition placeholder:text-[#666666] focus:border-[#2CFF05]"
        />
        <button
          type="submit"
          className="h-12 rounded-[8px] border border-[#2CFF05] px-5 font-jetbrains text-[11px] uppercase text-[#2CFF05] transition hover:bg-[#2CFF05] hover:text-[#0A0A0A]"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/skills"
          className={`rounded-full border px-3 py-1.5 font-jetbrains text-[10px] uppercase transition ${
            !category && !tag
              ? "border-[#2CFF05] text-[#2CFF05]"
              : "border-[#242424] text-[#7F7F7F] hover:border-[#2CFF05] hover:text-[#2CFF05]"
          }`}
        >
          All
        </Link>
        {categories
          .filter((item) => item.count > 0)
          .map((item) => (
            <Link
              key={item.id}
              href={`/skills?category=${encodeURIComponent(item.id)}`}
              className={`rounded-full border px-3 py-1.5 font-jetbrains text-[10px] uppercase transition ${
                category === item.id
                  ? "border-[#2CFF05] text-[#2CFF05]"
                  : "border-[#242424] text-[#7F7F7F] hover:border-[#2CFF05] hover:text-[#2CFF05]"
              }`}
            >
              {item.name} · {item.count}
            </Link>
          ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.slice(0, 18).map((item) => (
          <Link
            key={item}
            href={`/skills?tag=${encodeURIComponent(item)}`}
            className={`rounded-full border px-2.5 py-1 font-jetbrains text-[10px] transition ${
              tag === item
                ? "border-[#2CFF05] text-[#2CFF05]"
                : "border-[#242424] text-[#7F7F7F] hover:border-[#2CFF05] hover:text-[#2CFF05]"
            }`}
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}
