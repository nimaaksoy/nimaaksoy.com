import type { Metadata } from "next";
import { IconBrandChrome, IconExternalLink } from "@tabler/icons-react";
import TodayDashboard from "@/components/today/TodayDashboard";
import { SiteChrome } from "@/components/SiteChrome";
import { SponsorAdFrame } from "@/components/SponsorAdFrame";
import { getAllPrompts } from "@/lib/prompts";
import { getAllRadarProjects } from "@/lib/radar";

const CHROME_EXTENSION_URL =
  "https://chromewebstore.google.com/detail/nima-aksoy-today/opbhlhnfhgidddaoombbhkafcmefbjip?authuser=0&hl=en";

export const metadata: Metadata = {
  title: "Nima Aksoy Today — Daily Dashboard",
  description:
    "Nima Aksoy Today is a local-first daily dashboard with calendar views, Persian dates, currency rates, a private note, and the latest from Nima Aksoy.",
  applicationName: "Nima Aksoy Today",
  keywords: [
    "daily dashboard",
    "Persian calendar",
    "Iran currency",
    "Google Calendar",
    "local first notes",
    "new tab dashboard",
  ],
  alternates: {
    canonical: "/today",
  },
  openGraph: {
    title: "Nima Aksoy Today — Daily Dashboard",
    description:
      "Nima Aksoy Today provides calendar views, Persian dates, currency rates, a private note, and the latest Radar and Prompts.",
    url: "https://nimaaksoy.com/today",
    type: "website",
    siteName: "Nima Aksoy",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Nima Aksoy Today — Daily Dashboard",
    description:
      "A local-first daily dashboard with calendar, currency, private note, Radar, and Prompts.",
    creator: "@nima1980",
    site: "@nima1980",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function TodayPage() {
  const [radarProjects, prompts] = await Promise.all([
    getAllRadarProjects(),
    getAllPrompts(),
  ]);

  const latestRadar = radarProjects.slice(0, 3).map((project) => ({
    title: project.name,
    description: project.take.en,
    href: `/radar/${project.slug}`,
    date: project.date,
    stars: project.stars,
  }));

  const latestPrompts = prompts.slice(0, 3).map((prompt) => ({
    title: prompt.title,
    description: prompt.description,
    href: `/prompts/${prompt.slug}`,
    date: prompt.date,
    image:
      prompt.media.find((item) => item.type === "image")?.url ??
      prompt.media.find((item) => item.poster)?.poster,
  }));

  return (
    <SiteChrome active="today">
      <div className="px-4 py-6 md:px-8 md:py-8">
        <SponsorAdFrame>
      <TodayDashboard latestRadar={latestRadar} latestPrompts={latestPrompts} />
      <section className="mx-auto max-w-[1280px] px-4 pb-5 md:px-8 md:pb-6">
        <div className="flex flex-col gap-5 rounded-lg border border-[#1F1F1F] bg-[#101010] p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div className="flex min-w-0 gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-[#181818] text-[#2CFF05] ring-1 ring-[#2A2A2A]">
              <IconBrandChrome size={22} stroke={1.7} />
            </span>
            <div className="min-w-0">
              <p className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">
                Chrome extension
              </p>
              <h2 className="mt-1 font-monroe text-[24px] font-light leading-tight text-[#EAEAEA]">
                Make Today your new tab.
              </h2>
              <p className="mt-2 max-w-2xl text-[14px] leading-6 text-[#9A9A9A]">
                Open the same calendar, note, rates, Radar, and prompts every time
                Chrome starts a fresh page.
              </p>
            </div>
          </div>
          <a
            href={CHROME_EXTENSION_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-[#2CFF05] px-4 font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A] transition hover:bg-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#2CFF05] focus:ring-offset-2 focus:ring-offset-[#101010]"
          >
            Add to Chrome
            <IconExternalLink size={15} stroke={1.9} />
          </a>
        </div>
      </section>
      <section className="mx-auto max-w-[1280px] px-4 pb-12 pt-2 md:px-8 md:pb-16">
        <div className="rounded-lg bg-[#0D0D0D] p-5 md:p-6">
          <p className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">
            Purpose of this app
          </p>
          <h2 className="mt-2 font-monroe text-[30px] font-light leading-tight text-[#EAEAEA]">
            Nima Aksoy Today
          </h2>
          <div className="mt-4 max-w-4xl space-y-3 text-[15px] leading-7 text-[#B8B8B8]">
            <p>
              Nima Aksoy Today is a local-first daily dashboard for seeing the day in
              one place: calendar, Gregorian and Persian dates, currency conversion,
              one private note, Radar updates, Prompts, and latest public news.
            </p>
            <p>
              Google Calendar access is optional and read-only. When a user connects
              Google Calendar, Nima Aksoy Today uses calendar event data only to show
              events inside the visible calendar view and event tooltips. Calendar
              data is not saved on Nima Aksoy servers.
            </p>
            <p>
              The planned Chrome extension will use Nima Aksoy Today as a new-tab or
              new-page dashboard, with personal notes and preferences stored locally
              in the user&apos;s browser.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-4 font-jetbrains text-[11px] uppercase tracking-[0.12em]">
            <a href="/today/privacy" className="text-[#2CFF05] transition-opacity hover:opacity-80">
              Privacy policy
            </a>
            <a href="/today/terms" className="text-[#2CFF05] transition-opacity hover:opacity-80">
              Terms of service
            </a>
          </div>
        </div>
      </section>
        </SponsorAdFrame>
      </div>
    </SiteChrome>
  );
}
