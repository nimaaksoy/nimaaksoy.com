import type { Metadata } from "next";
import Link from "next/link";

import { SiteChrome } from "@/components/SiteChrome";
import { SponsorAdFrame } from "@/components/SponsorAdFrame";
import { SkillCard } from "@/components/skills/SkillCard";
import { SkillFilters } from "@/components/skills/SkillFilters";
import {
  getAllSkillTags,
  getFilteredSkills,
  skillCategories,
  skills,
} from "@/lib/skills";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Reusable AI skills for agent workflows, writing, music, ecommerce, and creator operations.",
  alternates: {
    canonical: "/skills",
  },
};

type SkillsPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    tag?: string;
  }>;
};

export default async function SkillsPage({ searchParams }: SkillsPageProps) {
  const params = await searchParams;
  const q = params.q || "";
  const category = params.category;
  const tag = params.tag;
  const filteredSkills = getFilteredSkills({ q, category, tag });
  const tags = getAllSkillTags();

  return (
    <SiteChrome active="skills">
      <div className="bg-[#0A0A0A] px-6 py-16 md:px-10 md:py-20">
        <SponsorAdFrame>
          <div className="mx-auto max-w-[1180px]">
            <header className="grid gap-8 md:grid-cols-[1fr_390px] md:items-end">
              <div>
                <p className="font-jetbrains text-[11px] uppercase tracking-[0.2em] text-[#7F7F7F]">
                  AI Skills
                </p>
                <h1 className="mt-4 font-monroe text-[clamp(42px,9vw,72px)] font-light leading-[1.02] text-[#EAEAEA]">
                  Reusable agent capabilities
                </h1>
              </div>
              <p className="font-monroe text-[18px] italic leading-[1.65] text-[#9A9A9A]">
                A source-available library of skills agents can load for focused workflows,
                from Persian writing and Suno lyrics to KDP publishing and sales outreach.
              </p>
            </header>

            <section className="mt-10 grid gap-x-8 gap-y-6 border-y border-[#1F1F1F] py-6 sm:grid-cols-3">
              <div>
                <p className="font-monroe text-[38px] font-light leading-none text-[#EAEAEA]">
                  {skills.length}
                </p>
                <p className="mt-2 font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
                  Skills
                </p>
              </div>
              <div>
                <p className="font-monroe text-[38px] font-light leading-none text-[#EAEAEA]">
                  {skillCategories.filter((item) => item.count > 0).length}
                </p>
                <p className="mt-2 font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
                  Active categories
                </p>
              </div>
              <div>
                <p className="font-monroe text-[38px] font-light leading-none text-[#EAEAEA]">
                  {tags.length}
                </p>
                <p className="mt-2 font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
                  Tags
                </p>
              </div>
            </section>

            <section className="mt-10">
              <SkillFilters
                q={q}
                category={category}
                tag={tag}
                categories={skillCategories}
                tags={tags}
              />
            </section>

            <section className="mt-10" aria-label="Skill results">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="font-jetbrains text-[11px] uppercase tracking-[0.16em] text-[#7F7F7F]">
                  {filteredSkills.length} skill{filteredSkills.length === 1 ? "" : "s"}
                </p>
                {(category || tag || q) ? (
                  <Link
                    href="/skills"
                    className="font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#2CFF05] transition hover:text-[#EAEAEA]"
                  >
                    Clear filters
                  </Link>
                ) : null}
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredSkills.map((skill) => (
                  <SkillCard
                    key={`${skill.category}/${skill.subcategory}/${skill.slug}`}
                    skill={skill}
                  />
                ))}
              </div>
            </section>
          </div>
        </SponsorAdFrame>
      </div>
    </SiteChrome>
  );
}
