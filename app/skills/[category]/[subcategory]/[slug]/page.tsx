import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IconArrowLeft,
  IconBrandGithub,
  IconDownload,
  IconFileText,
} from "@tabler/icons-react";

import { SiteChrome } from "@/components/SiteChrome";
import { SponsorAdFrame } from "@/components/SponsorAdFrame";
import { SkillCard } from "@/components/skills/SkillCard";
import { renderSkillMarkdown } from "@/lib/skills-markdown";
import {
  findSkill,
  findSkillCategory,
  findSkillSubcategory,
  formatFileSize,
  relatedSkills,
  skills,
} from "@/lib/skills";

type SkillPageProps = {
  params: Promise<{
    category: string;
    subcategory: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return skills.map((skill) => ({
    category: skill.category,
    subcategory: skill.subcategory,
    slug: skill.slug,
  }));
}

export async function generateMetadata({ params }: SkillPageProps): Promise<Metadata> {
  const resolved = await params;
  const skill = findSkill(resolved.category, resolved.subcategory, resolved.slug);

  if (!skill) {
    return {
      title: "Skill Not Found",
    };
  }

  return {
    title: skill.name,
    description: skill.description,
    alternates: {
      canonical: `/skills/${skill.category}/${skill.subcategory}/${skill.slug}`,
    },
  };
}

export default async function SkillPage({ params }: SkillPageProps) {
  const resolved = await params;
  const skill = findSkill(resolved.category, resolved.subcategory, resolved.slug);

  if (!skill) {
    notFound();
  }

  const category = findSkillCategory(skill.category);
  const subcategory = findSkillSubcategory(skill.category, skill.subcategory);
  const renderedBody = renderSkillMarkdown(skill.body.replace(/^# .+\n+/, ""));
  const related = relatedSkills(skill);

  return (
    <SiteChrome active="skills">
      <div className="bg-[#0A0A0A] px-6 py-16 md:px-10 md:py-20">
        <SponsorAdFrame>
          <div className="mx-auto max-w-[1180px]">
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 font-jetbrains text-[11px] uppercase tracking-[0.14em] text-[#7F7F7F] transition hover:text-[#2CFF05]"
            >
              <IconArrowLeft size={14} />
              Skills
            </Link>

            <header className="mt-8 grid gap-8 border-b border-[#1F1F1F] pb-8 lg:grid-cols-[1fr_320px]">
              <div>
                <p className="font-jetbrains text-[11px] uppercase tracking-[0.18em] text-[#7F7F7F]">
                  {category?.name || skill.category} / {subcategory?.name || skill.subcategory}
                </p>
                <h1 className="mt-4 font-monroe text-[clamp(42px,8vw,78px)] font-light leading-[1.02] text-[#EAEAEA]">
                  {skill.name}
                </h1>
                <p className="mt-5 max-w-3xl font-monroe text-[20px] italic leading-[1.6] text-[#9A9A9A]">
                  {skill.description}
                </p>
              </div>
              <aside className="rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-5">
                <dl className="space-y-4 font-jetbrains text-[11px]">
                  <div>
                    <dt className="uppercase text-[#7F7F7F]">Version</dt>
                    <dd className="mt-1 text-[#EAEAEA]">{skill.version}</dd>
                  </div>
                  <div>
                    <dt className="uppercase text-[#7F7F7F]">Updated</dt>
                    <dd className="mt-1 text-[#EAEAEA]">{skill.updated || "—"}</dd>
                  </div>
                  <div>
                    <dt className="uppercase text-[#7F7F7F]">License</dt>
                    <dd className="mt-1 text-[#EAEAEA]">{skill.license || "—"}</dd>
                  </div>
                </dl>
                <a
                  href={skill.zipPath}
                  className="mt-5 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-[8px] border border-[#2CFF05] px-4 font-jetbrains text-[11px] uppercase text-[#2CFF05] transition hover:bg-[#2CFF05] hover:text-[#0A0A0A]"
                >
                  <IconDownload size={14} />
                  Download ZIP
                </a>
              </aside>
            </header>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
              <main className="min-w-0">
                <div
                  className="skill-markdown rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-5 md:p-7"
                  dangerouslySetInnerHTML={{ __html: renderedBody }}
                />
              </main>

              <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
                <section className="rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-5">
                  <h2 className="font-jetbrains text-[11px] uppercase tracking-[0.16em] text-[#7F7F7F]">
                    Tags
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {skill.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/skills?tag=${encodeURIComponent(tag)}`}
                        className="rounded-full border border-[#242424] px-2.5 py-1 font-jetbrains text-[10px] text-[#9A9A9A] transition hover:border-[#2CFF05] hover:text-[#2CFF05]"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-5">
                  <h2 className="font-jetbrains text-[11px] uppercase tracking-[0.16em] text-[#7F7F7F]">
                    Files
                  </h2>
                  <div className="mt-4 space-y-3">
                    {skill.files.slice(0, 8).map((file) => (
                      <div key={file.path} className="flex items-center gap-2 text-[#9A9A9A]">
                        <IconFileText size={13} className="shrink-0 text-[#555555]" />
                        <span className="min-w-0 flex-1 truncate font-jetbrains text-[10px]">
                          {file.path}
                        </span>
                        <span className="shrink-0 font-jetbrains text-[9px] text-[#666666]">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-5">
                  <h2 className="font-jetbrains text-[11px] uppercase tracking-[0.16em] text-[#7F7F7F]">
                    Source
                  </h2>
                  <a
                    href={`https://github.com/nimaaksoy/nimaaksoy.com/tree/main/${skill.path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 font-jetbrains text-[11px] uppercase text-[#2CFF05] transition hover:text-[#EAEAEA]"
                  >
                    <IconBrandGithub size={14} />
                    GitHub
                  </a>
                </section>
              </aside>
            </div>

            {related.length ? (
              <section className="mt-12">
                <h2 className="font-monroe text-[34px] font-light text-[#EAEAEA]">
                  Related skills
                </h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {related.map((item) => (
                    <SkillCard
                      key={`${item.category}/${item.subcategory}/${item.slug}`}
                      skill={item}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </SponsorAdFrame>
      </div>
    </SiteChrome>
  );
}
