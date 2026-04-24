type ToolCard = {
  name: string;
  description: string;
  cta: string;
  href?: string;
};

const toolCards: ToolCard[] = [
  {
    name: "XDL",
    description: "Download videos from social media. Simple, fast, no friction.",
    cta: "→",
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
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-24 md:px-10">
      <div className="mx-auto max-w-[1180px]">
        <p className="font-jetbrains text-[11px] uppercase tracking-[0.2em] text-[#7F7F7F]">
          PRIVATE TOOLS
        </p>
        <h1 className="mt-4 font-monroe text-[clamp(38px,7vw,64px)] font-light leading-[1.04] text-[#EAEAEA]">
          Private tools
        </h1>

        <section className="mt-12 grid gap-5 md:grid-cols-2">
          {toolCards.map((card) => (
            <article
              key={card.name}
              className="rounded-2xl border border-[#1F1F1F] bg-[#111111] p-7"
            >
              <h2 className="font-monroe text-[32px] font-light leading-none text-[#EAEAEA]">
                {card.name}
              </h2>
              <p className="mt-4 max-w-md font-monroe text-[18px] italic leading-[1.55] text-[#9A9A9A]">
                {card.description}
              </p>
              {card.href ? (
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
    </main>
  );
}
