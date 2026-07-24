"use client";

import Link from "next/link";
import type { RadarProject } from "@/lib/radar-shared";
import {
  absoluteItemUrl,
  copyEn,
  formatRadarDate,
  itemPath,
  projectImage,
} from "@/lib/radar-shared";
import {
  CapabilityBadges,
  TagList,
  VerdictBadge,
} from "@/components/radar/RadarBadges";
import { ExpandableText } from "@/components/radar/ExpandableText";
import { ItemShare } from "@/components/radar/ItemShare";

type RadarProjectCardProps = {
  project: RadarProject;
};

function StarsLine({ project }: { project: RadarProject }) {
  const parts: string[] = [];
  if (typeof project.stars === "number") {
    parts.push(`${project.stars.toLocaleString("en-US")} stars`);
  }
  if (typeof project.starsGained === "number" && project.starsGained > 0) {
    parts.push(`+${project.starsGained.toLocaleString("en-US")} recent`);
  }
  if (!parts.length) return null;
  return (
    <p className="font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#7F7F7F]">
      {parts.join(" · ")}
    </p>
  );
}

export function RadarProjectCard({ project }: RadarProjectCardProps) {
  const href = itemPath(project.slug);
  const shareUrl = absoluteItemUrl(project.slug);
  const explanation = copyEn(project.take);
  const why = copyEn(project.why);
  const imageSrc = projectImage(project);
  const hasWhy = why.trim().length > 0 && why.trim() !== explanation.trim();

  return (
    <article className="card-surface overflow-hidden rounded-2xl">
      <div className="flex flex-col md:flex-row">
        {/* Image: ~40% tablet / 30% desktop, full width mobile */}
        <Link
          href={href}
          className="relative flex w-full shrink-0 items-center justify-center border-b border-[#1F1F1F] bg-[#0A0A0A] md:w-[40%] md:border-b-0 md:border-r lg:w-[30%]"
        >
          <div className="flex max-h-44 w-full items-center justify-center p-4 md:max-h-none md:min-h-[160px] md:p-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={project.name}
              className="max-h-40 w-full object-contain object-center md:max-h-52"
              loading="lazy"
            />
          </div>
        </Link>

        {/* Content: 60% tablet / 70% desktop */}
        <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 md:w-[60%] md:p-5 lg:w-[70%]">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[#7F7F7F]">
                {formatRadarDate(project.date)}
              </p>
              <h2 className="mt-1 font-monroe text-[22px] font-light leading-tight text-[#EAEAEA] md:text-[24px]">
                <Link href={href} className="transition hover:text-[#2CFF05]">
                  {project.name}
                </Link>
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {project.verdict ? <VerdictBadge verdict={project.verdict} /> : null}
              <CapabilityBadges project={project} />
            </div>
          </div>

          <ExpandableText text={explanation} collapsedChars={280} />

          {hasWhy ? (
            <details className="group rounded-xl border border-[#1F1F1F] bg-[#0A0A0A] px-3 py-2 open:border-[#2CFF05]/30">
              <summary className="cursor-pointer list-none font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[#2CFF05] marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="inline-flex items-center gap-2">
                  Why it matters
                  <span className="text-[#7F7F7F] transition group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-2 font-monroe text-[14px] leading-[1.6] text-[#EAEAEA]/90">
                {why}
              </p>
            </details>
          ) : null}

          {project.trending?.length ? (
            <p className="font-jetbrains text-[11px] leading-relaxed text-[#9A9A9A]">
              <span className="text-[#7F7F7F]">Signals · </span>
              {project.trending.join(" · ")}
            </p>
          ) : null}

          <StarsLine project={project} />

          <TagList tags={project.tags} />

          {project.similar?.length ? (
            <p className="font-monroe text-[13px] text-[#7F7F7F]">
              <span className="font-jetbrains text-[10px] uppercase tracking-[0.12em]">
                Similar ·{" "}
              </span>
              {project.similar.map((s, i) => (
                <span key={`${s.name}-${i}`}>
                  {i > 0 ? ", " : null}
                  {s.slug ? (
                    <Link
                      href={itemPath(s.slug)}
                      className="text-[#9A9A9A] transition hover:text-[#2CFF05]"
                    >
                      {s.name}
                    </Link>
                  ) : s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#9A9A9A] transition hover:text-[#2CFF05]"
                    >
                      {s.name}
                    </a>
                  ) : (
                    s.name
                  )}
                </span>
              ))}
            </p>
          ) : null}

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[#1F1F1F] pt-3">
            <div className="flex flex-wrap gap-3 font-jetbrains text-[11px] uppercase tracking-[0.12em]">
              <Link
                href={href}
                className="text-[#2CFF05] transition hover:opacity-80"
              >
                Open →
              </Link>
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="text-[#9A9A9A] transition hover:text-[#2CFF05]"
              >
                Source ↗
              </a>
            </div>
            <ItemShare
              url={shareUrl}
              title={project.name}
              xCaption={copyEn(project.share.x)}
              linkedinCaption={copyEn(project.share.linkedin)}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
