import Link from "next/link";
import type { ReactNode } from "react";
import type { RadarProject } from "@/lib/radar-shared";
import {
  absoluteItemUrl,
  copyEn,
  formatRadarDateLong,
  indexPath,
  itemPath,
  projectImage,
  youtubeEmbedUrl,
} from "@/lib/radar-shared";
import {
  CapabilityBadges,
  TagList,
  VerdictBadge,
} from "@/components/radar/RadarBadges";
import { ItemShare } from "@/components/radar/ItemShare";

type RadarProjectViewProps = {
  project: RadarProject;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#1F1F1F] bg-[#111111] p-5 md:p-7">
      <p className="font-jetbrains text-[11px] uppercase tracking-[0.2em] text-[#2CFF05]">
        {title}
      </p>
      <div className="mt-3 space-y-4 font-monroe text-[17px] leading-[1.7] text-[#EAEAEA]">
        {children}
      </div>
    </section>
  );
}

function uniqueParagraphs(...parts: (string | null | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of parts) {
    const t = (part ?? "").trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

export function RadarProjectView({ project }: RadarProjectViewProps) {
  const shareUrl = absoluteItemUrl(project.slug);
  const take = copyEn(project.take);
  const why = copyEn(project.why);
  const explanation = project.explanation
    ? copyEn(project.explanation)
    : null;
  const howItWorks = project.howItWorks ? copyEn(project.howItWorks) : null;
  const different = project.different ? copyEn(project.different) : null;
  const imageSrc = projectImage(project);
  const embedUrl = youtubeEmbedUrl(project.youtube);

  // Two clean sections only — drop repeated take / dual headings
  const whyParagraphs = uniqueParagraphs(
    explanation && explanation !== take ? explanation : null,
    why && why !== take && why !== explanation ? why : null,
    // If nothing else, still show why when it is the only body
    !explanation && why && why !== take ? why : null
  );
  // Guarantee at least why when no explanation (required field)
  if (whyParagraphs.length === 0 && why.trim()) {
    whyParagraphs.push(why.trim());
  }

  const howParagraphs = uniqueParagraphs(howItWorks, different);

  const starCount =
    typeof project.liveStars === "number"
      ? project.liveStars
      : typeof project.stars === "number"
        ? project.stars
        : null;

  return (
    <div className="px-4 py-12 sm:px-6 md:px-10 md:py-16">
      <div className="mx-auto max-w-[880px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-jetbrains text-[11px] uppercase tracking-[0.2em] text-[#2CFF05]">
            Radar
          </p>
          <Link
            href={indexPath()}
            className="font-jetbrains text-[12px] uppercase tracking-[0.14em] text-[#9A9A9A] transition hover:text-[#2CFF05]"
          >
            ← All projects
          </Link>
        </div>

        <p className="mt-6 font-jetbrains text-[12px] uppercase tracking-[0.14em] text-[#7F7F7F]">
          {formatRadarDateLong(project.date)}
          {starCount !== null ? (
            <span className="text-[#5A5A5A]">
              {" "}
              · {starCount.toLocaleString("en-US")} stars
            </span>
          ) : null}
        </p>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <h1 className="max-w-[720px] font-monroe text-[clamp(32px,6vw,52px)] font-light leading-[1.05] text-[#EAEAEA]">
            {project.name}
          </h1>
          <div className="flex flex-wrap items-center gap-1.5">
            {project.verdict ? <VerdictBadge verdict={project.verdict} /> : null}
            <CapabilityBadges project={project} />
          </div>
        </div>

        <p className="mt-5 max-w-3xl font-monroe text-[19px] leading-[1.55] text-[#9A9A9A]">
          {take}
        </p>

        {embedUrl ? (
          <div className="mt-8 overflow-hidden rounded-2xl border border-[#1F1F1F] bg-[#0A0A0A]">
            <div className="relative aspect-video w-full">
              <iframe
                src={embedUrl}
                title={`${project.name} video`}
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-[#1F1F1F] bg-[#0A0A0A]">
            <div className="flex max-h-[420px] items-center justify-center p-4 md:p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={project.name}
                className="max-h-[380px] w-full object-contain object-center"
              />
            </div>
          </div>
        )}

        <div className="mt-8 space-y-4">
          {whyParagraphs.length > 0 ? (
            <Section title="Why it matters">
              {whyParagraphs.map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            </Section>
          ) : null}

          {howParagraphs.length > 0 ? (
            <Section title="How it works">
              {howParagraphs.map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            </Section>
          ) : null}

          {(project.hasDemo || project.hasApi || project.hasMcp) && (
            <Section title="Capabilities">
              <div className="flex flex-wrap gap-2">
                <CapabilityBadges project={project} />
              </div>
              <ul className="mt-1 space-y-1 font-monroe text-[15px] text-[#9A9A9A]">
                {project.hasDemo ? <li>Public demo available</li> : null}
                {project.hasApi ? <li>API / SDK surface</li> : null}
                {project.hasMcp ? <li>MCP server / client support</li> : null}
              </ul>
            </Section>
          )}

          {project.similar?.length ? (
            <Section title="Similar tools">
              <ul className="space-y-2">
                {project.similar.map((tool, i) => (
                  <li key={`${tool.name}-${i}`}>
                    {tool.slug ? (
                      <Link
                        href={itemPath(tool.slug)}
                        className="text-[#EAEAEA] transition hover:text-[#2CFF05]"
                      >
                        {tool.name}
                      </Link>
                    ) : tool.url ? (
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#EAEAEA] transition hover:text-[#2CFF05]"
                      >
                        {tool.name} ↗
                      </a>
                    ) : (
                      tool.name
                    )}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}
        </div>

        {project.tags?.length ? (
          <div className="mt-6">
            <TagList tags={project.tags} />
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#1F1F1F] pt-6">
          <div className="flex flex-col gap-2">
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="font-jetbrains text-[12px] uppercase tracking-[0.14em] text-[#2CFF05] transition hover:opacity-80"
            >
              Source ↗
            </a>
            {project.source ? (
              <p className="font-jetbrains text-[10px] uppercase tracking-[0.12em] text-[#7F7F7F]">
                Via {project.source}
              </p>
            ) : null}
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
  );
}
