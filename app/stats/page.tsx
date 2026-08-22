import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { SiteChrome } from "@/components/SiteChrome";
import { SponsorAdFrame } from "@/components/SponsorAdFrame";
import {
  getSiteAnalytics,
  hasAnalyticsCredentials,
} from "@/lib/site-analytics";

// Serve a cached page and refresh it in the background, so a visitor never
// waits on a live PostHog query.
export const revalidate = 120;

export const metadata: Metadata = {
  title: "Stats",
  description: "Public aggregate analytics for nimaaksoy.com.",
  alternates: {
    canonical: "/stats",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function formatNumber(value: number | null | undefined) {
  if (value == null) {
    return "—";
  }

  return value.toLocaleString("en-US");
}

function shortDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function StatTile({
  label,
  value,
  detail,
}: {
  label: string;
  value: number | null | undefined;
  detail: string;
}) {
  return (
    <div className="rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-5">
      <p className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">
        {label}
      </p>
      <p className="mt-4 font-monroe text-[40px] font-light leading-none text-[#EAEAEA]">
        {formatNumber(value)}
      </p>
      <p className="mt-3 font-jetbrains text-[11px] leading-[1.7] text-[#9A9A9A]">
        {detail}
      </p>
    </div>
  );
}

function HorizontalBars({
  rows,
  empty,
}: {
  rows: Array<{ label: string; value: number }>;
  empty: string;
}) {
  const max = Math.max(1, ...rows.map((row) => row.value));

  if (!rows.length) {
    return <p className="font-jetbrains text-[12px] text-[#7F7F7F]">{empty}</p>;
  }

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="flex items-center justify-between gap-4 font-jetbrains text-[11px] text-[#9A9A9A]">
            <span className="min-w-0 truncate">{row.label}</span>
            <span>{formatNumber(row.value)}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#1A1A1A]">
            <div
              className="h-full rounded-full bg-[#2CFF05]"
              style={{ width: `${Math.max(4, (row.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonPanel({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[8px] border border-[#1F1F1F] bg-[#111111] ${className}`}
    />
  );
}

function StatsSkeleton() {
  return (
    <div aria-hidden>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((tile) => (
          <SkeletonPanel key={tile} className="h-[148px]" />
        ))}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <SkeletonPanel className="h-[360px]" />
        <SkeletonPanel className="h-[360px]" />
      </div>
      <SkeletonPanel className="mt-5 h-[280px]" />
      <p className="sr-only">Loading stats…</p>
    </div>
  );
}

async function StatsPanels() {
  const data = await getSiteAnalytics();
  const maxDailyViews = Math.max(
    1,
    ...(data?.byDay.map((day) => day.views) || []),
  );

  return (
    <>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Views Today"
          value={data?.tiles.viewsToday}
          detail="Page views since midnight UTC."
        />
        <StatTile
          label="Visitors 7D"
          value={data?.tiles.visitors7d}
          detail="Unique visitors across the full site."
        />
        <StatTile
          label="Views 7D"
          value={data?.tiles.views7d}
          detail="All page views over the last week."
        />
        <StatTile
          label="Prompt Copies 7D"
          value={data?.tiles.promptCopies7d}
          detail="Prompt copy events from the prompt library."
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <section className="rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-jetbrains text-[11px] uppercase tracking-[0.16em] text-[#7F7F7F]">
              Page Views / 14D
            </h2>
            <span className="font-jetbrains text-[11px] text-[#7F7F7F]">
              Peak day {formatNumber(data?.tiles.bestDay)}
            </span>
          </div>
          {data?.byDay.length ? (
            <div className="mt-8 flex h-64 items-end gap-2">
              {data.byDay.map((day) => (
                <div
                  key={day.date}
                  className="flex min-w-0 flex-1 flex-col items-center gap-3"
                >
                  <div className="flex h-52 w-full items-end">
                    <div
                      className="w-full rounded-t-[4px] bg-[#2CFF05]"
                      style={{
                        height: `${Math.max(3, (day.views / maxDailyViews) * 100)}%`,
                      }}
                      title={`${formatNumber(day.views)} views, ${formatNumber(day.visitors)} visitors`}
                    />
                  </div>
                  <span className="font-jetbrains text-[10px] text-[#7F7F7F]">
                    {shortDate(day.date)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-8 font-jetbrains text-[12px] leading-[1.8] text-[#7F7F7F]">
              Waiting for page-view events.
            </p>
          )}
        </section>

        <section className="rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-5 md:p-6">
          <h2 className="font-jetbrains text-[11px] uppercase tracking-[0.16em] text-[#7F7F7F]">
            Top Pages / 7D
          </h2>
          <div className="mt-6">
            <HorizontalBars
              rows={(data?.pages || []).map((page) => ({
                label: page.path,
                value: page.views,
              }))}
              empty="Waiting for page-view events."
            />
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-jetbrains text-[11px] uppercase tracking-[0.16em] text-[#7F7F7F]">
            Most Copied Prompts / 7D
          </h2>
          <Link
            href="/prompts"
            className="font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#2CFF05] transition hover:text-[#EAEAEA]"
          >
            Browse Prompts
          </Link>
        </div>
        <div className="mt-6">
          <HorizontalBars
            rows={(data?.promptCopies || []).map((prompt) => ({
              label: prompt.prompt,
              value: prompt.copies,
            }))}
            empty="Waiting for prompt copy events."
          />
        </div>
      </section>
    </>
  );
}

export default function StatsPage() {
  const configured = hasAnalyticsCredentials();

  return (
    <SiteChrome active="stats">
      <section className="bg-[#0A0A0A] px-6 py-16 md:px-10 md:py-20">
        <SponsorAdFrame>
        <div className="mx-auto max-w-[1180px]">
          <header className="border-b border-[#1F1F1F] pb-8">
            <p className="font-jetbrains text-[11px] uppercase tracking-[0.18em] text-[#2CFF05]">
              Public Stats
            </p>
            <h1 className="mt-4 font-monroe text-[clamp(44px,8vw,84px)] font-light leading-[0.98] text-[#EAEAEA]">
              nimaaksoy.com
            </h1>
            <p className="mt-5 max-w-2xl font-monroe text-[20px] italic leading-[1.65] text-[#9A9A9A]">
              Aggregate site analytics across home, Radar, tools, prompts, and
              project pages.
            </p>
          </header>

          {!configured ? (
            <div className="mt-10 rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-6 md:p-8">
              <h2 className="font-monroe text-[28px] font-light text-[#EAEAEA]">
                Analytics is ready for credentials.
              </h2>
              <p className="mt-4 max-w-3xl font-jetbrains text-[13px] leading-[1.9] text-[#9A9A9A]">
                Create a PostHog project and add POSTHOG_KEY,
                POSTHOG_PROJECT_ID, and POSTHOG_PERSONAL_KEY in production. Once
                traffic starts flowing, this page will show live aggregate
                stats.
              </p>
            </div>
          ) : null}

          {/* The page shell renders immediately; numbers stream in when the
              analytics query resolves. */}
          <Suspense fallback={<StatsSkeleton />}>
            <StatsPanels />
          </Suspense>

          <p className="mt-8 font-jetbrains text-[11px] leading-[1.9] text-[#7F7F7F]">
            First-party PostHog analytics, queried server-side and published as
            aggregate numbers. Refreshed every two minutes.
          </p>
        </div>
        </SponsorAdFrame>
      </section>
    </SiteChrome>
  );
}
