import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import PromptCopyButton from "@/components/prompts/PromptCopyButton";
import PromptMedia from "@/components/prompts/PromptMedia";
import {
  formatTag,
  getAllPrompts,
  getPromptBySlug,
  getPromptNeighbors,
  getPromptOgImage,
  SITE_URL,
} from "@/lib/prompts";
import { getCopyCounts } from "@/lib/prompt-copy-counts";

type PromptDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPrompts().map((prompt) => ({ slug: prompt.slug }));
}

export async function generateMetadata({ params }: PromptDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const prompt = getPromptBySlug(slug);

  if (!prompt) {
    return {
      title: "Prompt Not Found",
    };
  }

  const image = getPromptOgImage(prompt);

  return {
    title: prompt.title,
    description: prompt.description,
    alternates: {
      canonical: `/prompts/${prompt.slug}`,
    },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/prompts/${prompt.slug}`,
      title: `${prompt.title} | Nima Aksoy`,
      description: prompt.description,
      publishedTime: prompt.date,
      authors: prompt.authorName ? [prompt.authorName] : undefined,
      images: image
        ? [
            {
              url: image,
              alt: prompt.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${prompt.title} | Nima Aksoy`,
      description: prompt.description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
  const { slug } = await params;
  const prompt = getPromptBySlug(slug);

  if (!prompt) {
    notFound();
  }

  const counts = await getCopyCounts([prompt.slug]);
  const { previous, next } = getPromptNeighbors(prompt.slug);

  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: prompt.title,
    description: prompt.description,
    url: `${SITE_URL}/prompts/${prompt.slug}`,
    datePublished: prompt.date,
    author: prompt.authorName
      ? {
          "@type": "Person",
          name: prompt.authorName,
          url: prompt.authorUrl,
        }
      : undefined,
    isBasedOn: prompt.sourceUrl,
    text: prompt.body,
    keywords: prompt.tags.join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Prompts",
        item: `${SITE_URL}/prompts`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: prompt.title,
        item: `${SITE_URL}/prompts/${prompt.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-20 md:px-10 md:py-24">
      <article className="mx-auto max-w-[980px]">
        <nav className="mb-10 flex flex-wrap items-center justify-between gap-4 font-jetbrains text-[11px] uppercase tracking-[0.16em] text-[#7F7F7F]">
          <Link href="/prompts" className="transition hover:text-[#2CFF05]">
            Back to Prompts
          </Link>
          <Link href="/" className="transition hover:text-[#2CFF05]">
            Nima Aksoy
          </Link>
        </nav>

        <header className="border-b border-[#1F1F1F] pb-8">
          <div className="flex flex-wrap gap-2">
            {prompt.tags.map((tag) => (
              <Link
                key={tag}
                href={`/prompts/tag/${tag}`}
                className="rounded-full border border-[#2A2A2A] px-3 py-1 font-jetbrains text-[10px] uppercase tracking-[0.12em] text-[#9A9A9A] transition hover:border-[#2CFF05] hover:text-[#2CFF05]"
              >
                {formatTag(tag)}
              </Link>
            ))}
          </div>
          <h1 className="mt-6 font-monroe text-[clamp(40px,8vw,72px)] font-light leading-[1.02] text-[#EAEAEA]">
            {prompt.title}
          </h1>
          <p className="mt-5 max-w-2xl font-monroe text-[20px] italic leading-[1.65] text-[#9A9A9A]">
            {prompt.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <PromptCopyButton
              slug={prompt.slug}
              body={prompt.body}
              count={counts[prompt.slug] ?? 0}
              size="large"
            />
            {prompt.sourceUrl ? (
              <a
                href={prompt.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="font-jetbrains text-[12px] uppercase tracking-[0.12em] text-[#2CFF05] transition hover:text-[#EAEAEA]"
              >
                Open Original
              </a>
            ) : null}
          </div>

          {prompt.authorName || prompt.date ? (
            <p className="mt-5 font-jetbrains text-[11px] leading-[1.8] text-[#7F7F7F]">
              {prompt.authorName ? (
                prompt.authorUrl ? (
                  <a href={prompt.authorUrl} target="_blank" rel="noreferrer" className="hover:text-[#2CFF05]">
                    {prompt.authorName}
                  </a>
                ) : (
                  prompt.authorName
                )
              ) : null}
              {prompt.authorName && prompt.date ? " / " : null}
              {prompt.date ? new Date(`${prompt.date}T00:00:00Z`).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }) : null}
            </p>
          ) : null}
        </header>

        {prompt.media.length ? (
          <section className="mt-8">
            <PromptMedia media={prompt.media} title={prompt.title} />
          </section>
        ) : null}

        <section className="mt-8 rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-5 md:p-7">
          <h2 className="font-jetbrains text-[11px] uppercase tracking-[0.16em] text-[#7F7F7F]">
            Prompt
          </h2>
          <pre className="mt-5 overflow-x-auto whitespace-pre-wrap break-words font-jetbrains text-[13px] leading-[1.9] text-[#EAEAEA]">
            {prompt.body}
          </pre>
        </section>

        <nav className="mt-10 grid gap-4 border-t border-[#1F1F1F] pt-8 md:grid-cols-2">
          {previous ? (
            <Link
              href={`/prompts/${previous.slug}`}
              className="rounded-[8px] border border-[#1F1F1F] p-5 transition hover:border-[#2CFF05]/40"
            >
              <p className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">
                Previous
              </p>
              <p className="mt-2 font-monroe text-[20px] text-[#EAEAEA]">{previous.title}</p>
            </Link>
          ) : <span />}
          {next ? (
            <Link
              href={`/prompts/${next.slug}`}
              className="rounded-[8px] border border-[#1F1F1F] p-5 transition hover:border-[#2CFF05]/40 md:text-right"
            >
              <p className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">
                Next
              </p>
              <p className="mt-2 font-monroe text-[20px] text-[#EAEAEA]">{next.title}</p>
            </Link>
          ) : null}
        </nav>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </main>
  );
}
