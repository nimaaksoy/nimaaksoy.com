import type { Metadata } from "next";
import Image from "next/image";
import {
  IconArrowRight,
  IconCheck,
  IconClock,
  IconLock,
} from "@tabler/icons-react";

import { SiteChrome } from "@/components/SiteChrome";
import { getSiteAnalytics } from "@/lib/site-analytics";
import { type SponsorSlot } from "@/lib/sponsor-slots";
import { getSponsorSlots } from "@/lib/sponsor-slots-live";
import SponsorSlotBoard from "./SponsorSlotBoard";

export const metadata: Metadata = {
  title: "Sponsor Nima Aksoy's Builder Network",
  description:
    "Put your product in front of founders, AI builders, and creators exploring tools, prompts, and ideas.",
  alternates: {
    canonical: "/sponsor",
  },
};

type SponsorPageProps = {
  searchParams: Promise<{
    checkout?: string;
    slot?: string;
    months?: string;
    company?: string;
  }>;
};

const audienceGroups = [
  "Founders",
  "AI engineers",
  "Indie hackers",
  "Product builders",
  "Designers",
  "Creators",
];

const placements = [
  {
    title: "Prompt Library",
    text: "Practical AI prompts and workflows.",
    placement: "Top banner + sidebar",
    audience: "People actively looking for AI workflows.",
  },
  {
    title: "AI Skills",
    text: "Discover reusable AI capabilities and agent skills.",
    placement: "Top banner",
    audience: "Developers building with AI agents.",
  },
  {
    title: "Radar",
    text: "Curated tools, products, and interesting projects.",
    placement: "Featured sponsor card",
    audience: "Early adopters discovering new technology.",
  },
];

const faqs = [
  {
    question: "Who sees these sponsors?",
    answer:
      "Founders, developers, designers, and AI enthusiasts exploring tools and workflows.",
  },
  {
    question: "Are sponsors rotated?",
    answer: "No. Each placement belongs to one sponsor during the campaign.",
  },
  {
    question: "Do links follow SEO rules?",
    answer:
      "Sponsor links are reviewed manually. Paid placement links can use sponsor-safe attributes where required by search guidelines.",
  },
];

function formatMetric(value: number | null | undefined) {
  if (!value) {
    return "—";
  }

  const rounded = value >= 1000 ? Math.round(value / 100) * 100 : value;
  return `${rounded.toLocaleString("en-US")}+`;
}

function SponsorBanner({ slot }: { slot: SponsorSlot }) {
  return (
    <a
      href={slot.href}
      className="group grid h-[86px] grid-cols-[48px_1fr] gap-3 overflow-hidden rounded-[8px] border border-[#202020] bg-[#111111] p-3 transition hover:border-[#2CFF05]/60 hover:bg-[#151515]"
    >
      <Image
        src={slot.logo}
        alt={`${slot.name} logo`}
        width={48}
        height={48}
        className="aspect-square rounded-[8px] border border-[#242424] object-cover"
      />
      <div className="min-w-0">
        <h3 className="truncate font-monroe text-[16px] font-light text-[#EAEAEA]">
          {slot.name}
        </h3>
        <p className="mt-1 line-clamp-2 font-jetbrains text-[10px] leading-[1.45] text-[#9A9A9A]">
          {slot.line}
        </p>
      </div>
    </a>
  );
}

function SponsorAvailabilityBanner({ openCount }: { openCount: number }) {
  return (
    <a
      href="/sponsor"
      className="flex h-[86px] flex-col items-center justify-center overflow-hidden rounded-[8px] border border-[#202020] bg-[#111111] p-3 text-center transition hover:border-[#2CFF05]/60 hover:bg-[#151515]"
    >
      <span className="font-jetbrains text-[10px] uppercase text-[#2CFF05]">
        Sponsor
      </span>
      <span className="mt-1 font-monroe text-[16px] font-light text-[#EAEAEA]">
        {openCount}/8 left
      </span>
    </a>
  );
}

function MobileBannerCard({ slot }: { slot: SponsorSlot }) {
  return (
    <a
      href={slot.href}
      className="grid h-9 w-[132px] shrink-0 grid-cols-[24px_1fr] items-center gap-2 overflow-hidden rounded-[6px] border border-[#202020] bg-[#111111] px-2"
    >
      <Image
        src={slot.logo}
        alt={`${slot.name} logo`}
        width={24}
        height={24}
        className="aspect-square rounded-[6px] border border-[#242424] object-cover"
      />
      <span className="truncate font-monroe text-[13px] font-light text-[#EAEAEA]">
        {slot.name}
      </span>
    </a>
  );
}

function MobileSponsorBanner({ openCount }: { openCount: number }) {
  return (
    <a
      href="/sponsor"
      className="flex h-9 w-[132px] shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-[6px] border border-[#202020] bg-[#111111] px-2 text-center"
    >
      <span className="font-jetbrains text-[9px] uppercase text-[#2CFF05]">
        Sponsor
      </span>
      <span className="font-monroe text-[13px] font-light text-[#EAEAEA]">
        {openCount}/8 left
      </span>
    </a>
  );
}

function MobileSponsorMarquee({
  rail,
  slots,
  openCount,
  reverse = false,
  className = "",
}: {
  rail: SponsorSlot["rail"];
  slots: SponsorSlot[];
  openCount: number;
  reverse?: boolean;
  className?: string;
}) {
  const mobileSlots = slots.filter((slot) => slot.rail === rail && slot.status === "taken");
  const showAvailability = rail === "right";

  if (!mobileSlots.length && !showAvailability) {
    return null;
  }

  return (
    <div className={`sponsor-mobile-marquee lg:hidden ${className}`}>
      <div
        className={`sponsor-mobile-marquee-track ${
          reverse ? "sponsor-mobile-marquee-reverse" : ""
        }`}
      >
        {Array.from({ length: 3 }).flatMap((_, set) => [
          ...mobileSlots.map((slot) => (
            <MobileBannerCard key={`${set}-${slot.id}`} slot={slot} />
          )),
          ...(showAvailability ? [<MobileSponsorBanner key={`${set}-sponsor`} openCount={openCount} />] : []),
        ])}
      </div>
    </div>
  );
}

function SponsorRail({
  side,
  slots,
  openCount,
}: {
  side: SponsorSlot["rail"];
  slots: SponsorSlot[];
  openCount: number;
}) {
  const railSlots = slots.filter((slot) => slot.rail === side && slot.status === "taken");
  const showAvailability = side === "right";

  if (!railSlots.length && !showAvailability) {
    return null;
  }

  return (
    <aside
      className="hidden flex-col gap-3 lg:flex lg:sticky lg:top-24 lg:self-start"
      aria-label={`${side} sponsor rail`}
    >
      {railSlots.map((slot) => (
        <div key={slot.id} className="contents">
          <SponsorBanner slot={slot} />
        </div>
      ))}
      {showAvailability ? <SponsorAvailabilityBanner openCount={openCount} /> : null}
    </aside>
  );
}

export default async function SponsorPage({ searchParams }: SponsorPageProps) {
  const params = await searchParams;
  const slots = await getSponsorSlots();
  const openCount = slots.filter((slot) => slot.status === "open").length;
  const checkoutComplete = params.checkout === "success";
  const hasLeftRail = slots.some((slot) => slot.rail === "left" && slot.status === "taken");
  const gridTemplate = hasLeftRail
    ? "lg:grid-cols-[220px_minmax(0,1fr)_220px]"
    : "lg:grid-cols-[minmax(0,1fr)_220px]";
  const analytics = await getSiteAnalytics();
  const audienceStats = [
    {
      value: formatMetric(analytics?.tiles.views30d),
      label: "Monthly page views",
    },
    {
      value: formatMetric(analytics?.tiles.promptCopies30d),
      label: "Prompt copies",
    },
    {
      value: analytics?.tiles.countries30d
        ? `${analytics.tiles.countries30d.toLocaleString("en-US")}+`
        : "—",
      label: "Countries reached",
    },
    {
      value: formatMetric(analytics?.tiles.visitors30d),
      label: "Builders reached",
    },
  ];

  return (
    <SiteChrome active="sponsor">
      <MobileSponsorMarquee rail="right" slots={slots} openCount={openCount} className="fixed left-0 top-14 z-[45] bg-[#0A0A0A]/95 py-1 backdrop-blur-sm md:top-16" />
      <div className="px-6 pb-24 pt-8 md:px-10 md:pt-12 lg:py-16">
        <div className={`mx-auto grid max-w-[1580px] gap-8 ${gridTemplate} lg:items-start xl:gap-10`}>
          {hasLeftRail ? <SponsorRail side="left" slots={slots} openCount={openCount} /> : null}

          <div className="min-w-0">
            {checkoutComplete ? (
              <div className="mb-8 rounded-[8px] border border-[#2CFF05]/50 bg-[#12220f] p-5">
                <div className="flex items-start gap-3">
                  <IconCheck size={20} className="mt-1 shrink-0 text-[#2CFF05]" />
                  <div>
                    <p className="font-jetbrains text-[11px] uppercase text-[#2CFF05]">
                      Your ads set
                    </p>
                    <p className="mt-2 font-jetbrains text-[12px] leading-[1.7] text-[#CFCFCF]">
                      {params.company || "Your company"} reserved slot {params.slot} for{" "}
                      {params.months || "1"} {params.months === "3" ? "months" : "month"}.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

          <section>
            <p className="font-jetbrains text-[11px] uppercase text-[#7F7F7F]">
              Sponsor nimaaksoy.com
            </p>
            <h1 className="mt-4 font-monroe text-[clamp(42px,8vw,78px)] font-light leading-[1.02] text-[#EAEAEA]">
              Sponsor Nima Aksoy&apos;s Builder Network
            </h1>
            <p className="mt-5 max-w-4xl font-monroe text-[20px] italic leading-[1.6] text-[#9A9A9A]">
              Put your product in front of founders, AI builders, and creators exploring the
              tools, prompts, and ideas shaping the future.
            </p>

            <div className="mt-10 grid gap-x-8 gap-y-6 border-y border-[#1F1F1F] py-6 sm:grid-cols-2 xl:grid-cols-4">
              {audienceStats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-monroe text-[38px] font-light leading-none text-[#EAEAEA]">
                    {stat.value}
                  </p>
                  <p className="mt-2 font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
                Your audience
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {audienceGroups.map((group) => (
                  <span
                    key={group}
                    className="rounded-full border border-[#242424] px-3 py-2 font-jetbrains text-[11px] text-[#CFCFCF]"
                  >
                    {group}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="mt-2 font-monroe text-[34px] font-light text-[#EAEAEA]">
                  The slots
                </h2>
              </div>
              <p className="font-jetbrains text-[11px] uppercase text-[#2CFF05]">
                $300 / month
              </p>
            </div>
            <SponsorSlotBoard slots={slots} />
          </section>

          <section className="mt-14">
            <h2 className="font-monroe text-[38px] font-light leading-tight text-[#EAEAEA]">
              Where your brand appears
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {placements.map((placement) => (
                <article
                  key={placement.title}
                  className="rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-5"
                >
                  <h3 className="font-monroe text-[22px] font-light text-[#EAEAEA]">
                    {placement.title}
                  </h3>
                  <p className="mt-2 font-jetbrains text-[11px] leading-[1.7] text-[#9A9A9A]">
                    {placement.text}
                  </p>
                  <div className="mt-5 border-t border-[#202020] pt-4">
                    <p className="font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
                      Sponsor placement
                    </p>
                    <p className="mt-2 font-jetbrains text-[12px] text-[#EAEAEA]">
                      {placement.placement}
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
                      Audience
                    </p>
                    <p className="mt-2 font-jetbrains text-[12px] leading-[1.7] text-[#CFCFCF]">
                      {placement.audience}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="pricing" className="mt-14 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div>
              <p className="font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
                Pricing
              </p>
              <h2 className="mt-3 font-monroe text-[38px] font-light leading-tight text-[#EAEAEA]">
                Founder Sponsor
              </h2>
              <p className="mt-3 font-monroe text-[34px] font-light text-[#2CFF05]">
                $300 <span className="text-[18px] text-[#9A9A9A]">/ month</span>
              </p>
              <p className="mt-4 max-w-2xl font-jetbrains text-[12px] leading-[1.9] text-[#9A9A9A]">
                30-day minimum. Buy one month or three months. It is not recurring and it
                will not renew automatically.
              </p>
            </div>
            <div className="rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-5">
              {[
                "One exclusive placement",
                "Logo + description",
                "Direct link",
                "Visible across selected pages",
                "No rotation",
                "No competing sponsors",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border-b border-[#202020] py-3 last:border-0"
                >
                  <IconCheck size={15} className="shrink-0 text-[#2CFF05]" />
                  <span className="font-jetbrains text-[12px] text-[#CFCFCF]">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <h2 className="font-monroe text-[38px] font-light leading-tight text-[#EAEAEA]">
              How it works
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "01 Choose placement",
                  text: "Pick where your audience fits best.",
                  icon: IconArrowRight,
                },
                {
                  title: "02 Send your details",
                  text: "Logo, name, description, link.",
                  icon: IconCheck,
                },
                {
                  title: "03 Go live",
                  text: "Your sponsor placement appears after review.",
                  icon: IconClock,
                },
              ].map((step) => {
                const StepIcon = step.icon;
                return (
                  <article
                    key={step.title}
                    className="rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-5"
                  >
                    <StepIcon size={20} className="text-[#2CFF05]" />
                    <h3 className="mt-4 font-jetbrains text-[11px] uppercase text-[#EAEAEA]">
                      {step.title}
                    </h3>
                    <p className="mt-3 font-jetbrains text-[11px] leading-[1.7] text-[#9A9A9A]">
                      {step.text}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-14 rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-6">
            <div className="flex items-start gap-3">
              <IconLock size={18} className="mt-1 shrink-0 text-[#2CFF05]" />
              <div>
                <p className="font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
                  Built for products, not impressions.
                </p>
                <p className="mt-3 font-jetbrains text-[12px] leading-[1.8] text-[#9A9A9A]">
                  Sponsorships are manually reviewed. We only accept products that are useful
                  for builders and AI creators.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-14">
            <h2 className="font-monroe text-[38px] font-light leading-tight text-[#EAEAEA]">
              FAQ
            </h2>
            <div className="mt-6 divide-y divide-[#1F1F1F] border-y border-[#1F1F1F]">
              {faqs.map((faq) => (
                <div key={faq.question} className="py-5">
                  <h3 className="font-jetbrains text-[12px] uppercase text-[#EAEAEA]">
                    {faq.question}
                  </h3>
                  <p className="mt-3 font-jetbrains text-[12px] leading-[1.8] text-[#9A9A9A]">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          </div>

          <SponsorRail side="right" slots={slots} openCount={openCount} />
        </div>
      </div>
      <MobileSponsorMarquee
        rail="left"
        slots={slots}
        openCount={openCount}
        reverse
        className="fixed bottom-0 left-0 z-[60] bg-[#0A0A0A]/95 py-1 backdrop-blur-sm"
      />
    </SiteChrome>
  );
}
