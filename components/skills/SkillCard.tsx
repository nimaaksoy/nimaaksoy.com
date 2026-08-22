import Link from "next/link";
import { IconArrowUpRight, IconDownload } from "@tabler/icons-react";

import { skillHref, type Skill } from "@/lib/skills";

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <article className="rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-5 transition hover:border-[#2CFF05]/50 hover:bg-[#151515]">
      <div className="flex min-h-[156px] flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
              {skill.category} / {skill.subcategory}
            </p>
            <h2 className="mt-3 font-monroe text-[28px] font-light leading-tight text-[#EAEAEA]">
              <Link href={skillHref(skill)} className="transition hover:text-[#2CFF05]">
                {skill.name}
              </Link>
            </h2>
          </div>
          <Link
            href={skillHref(skill)}
            aria-label={`Open ${skill.name}`}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-[#242424] text-[#7F7F7F] transition hover:border-[#2CFF05] hover:text-[#2CFF05]"
          >
            <IconArrowUpRight size={15} />
          </Link>
        </div>
        <p className="mt-4 line-clamp-3 font-jetbrains text-[12px] leading-[1.8] text-[#9A9A9A]">
          {skill.description}
        </p>
        <div className="mt-auto pt-5">
          <div className="flex flex-wrap gap-2">
            {skill.tags.slice(0, 4).map((tag) => (
              <Link
                key={tag}
                href={`/skills?tag=${encodeURIComponent(tag)}`}
                className="rounded-full border border-[#242424] px-2.5 py-1 font-jetbrains text-[10px] text-[#7F7F7F] transition hover:border-[#2CFF05] hover:text-[#2CFF05]"
              >
                {tag}
              </Link>
            ))}
          </div>
          <a
            href={skill.zipPath}
            className="mt-5 inline-flex items-center gap-2 font-jetbrains text-[11px] uppercase text-[#2CFF05] transition hover:text-[#EAEAEA]"
          >
            <IconDownload size={14} />
            Download
          </a>
        </div>
      </div>
    </article>
  );
}
