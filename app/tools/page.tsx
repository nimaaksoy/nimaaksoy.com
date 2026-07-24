import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/radar/SiteChrome";

export const metadata: Metadata = {
  title: "Tools",
  description: "Content tools for AI agents — utilities I use when building and shipping.",
  alternates: {
    canonical: "/tools",
  },
};

type ToolCard = {
  name: string;
  description: string;
  cta: string;
  href?: string;
};

const toolCards: ToolCard[] = [
  {
    name: "Life in Dots",
    description:
      "A thoughtful life calendar and Chrome new-tab ritual for seeing today in context.",
    cta: "→ nimaaksoy.com/life-in-dots",
    href: "/life-in-dots",
  },
  {
    name: "Verinio",
    description:
      "Content tools for AI agents. Pull media, clean it up, and feed your workflows.",
    cta: "→ verinio.com",
    href: "https://verinio.com",
  },
  {
    name: "PDF",
    description: "Tools that make everyday things easier. Merge, convert, simplify.",
    cta: "→ pdf.nimaaksoy.com",
    href: "https://pdf.nimaaksoy.com",
  },
  {
    name: "T-Shirt",
    description: "Things I'd actually wear. If you like my taste, take a look.",
    cta: "→ tshirt.nimaaksoy.com",
    href: "https://tshirt.nimaaksoy.com",
  },
  {
    name: "Prompts",
    description: "Useful prompts I use myself. Clear, practical, no fluff.",
    cta: "→",
  },
];

export default function ToolsPage() {
  return (
    <SiteChrome active="tools">
      <div className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1180px]">
          <p className="font-jetbrains text-[11px] uppercase tracking-[0.2em] text-[#7F7F7F]">
            TOOLS
          </p>
          <h1 className="mt-4 font-monroe text-[clamp(38px,7vw,64px)] font-light leading-[1.04] text-[#EAEAEA]">
            Content tools for AI agents
          </h1>
          <p className="mt-5 max-w-2xl font-monroe text-[18px] italic leading-[1.55] text-[#9A9A9A]">
            Small utilities I use when building, shipping, and feeding agent workflows.
          </p>

          <section className="mt-12 grid gap-5 md:grid-cols-2">
            {toolCards.map((card) => (
              <article
                key={card.name}
                className="card-surface rounded-2xl border border-[#1F1F1F] bg-[#111111] p-7"
              >
                <h2 className="font-monroe text-[32px] font-light leading-none text-[#EAEAEA]">
                  {card.name}
                </h2>
                <p className="mt-4 max-w-md font-monroe text-[18px] italic leading-[1.55] text-[#9A9A9A]">
                  {card.description}
                </p>
                {card.href?.startsWith("/") ? (
                  <Link
                    href={card.href}
                    className="mt-8 inline-block font-jetbrains text-[12px] uppercase tracking-[0.14em] text-[#2CFF05] transition-opacity hover:opacity-80"
                  >
                    {card.cta}
                  </Link>
                ) : card.href ? (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-block font-jetbrains text-[12px] uppercase tracking-[0.14em] text-[#2CFF05] transition-opacity hover:opacity-80"
                  >
                    {card.cta}
                  </a>
                ) : (
                  <span className="mt-8 inline-block font-jetbrains text-[12px] uppercase tracking-[0.14em] text-[#2CFF05]">
                    {card.cta}
                  </span>
                )}
              </article>
            ))}
          </section>
        </div>
      </div>
    </SiteChrome>
  );
}
