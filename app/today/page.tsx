import type { Metadata } from "next";
import TodayDashboard from "@/components/today/TodayDashboard";
import { SiteChrome } from "@/components/SiteChrome";
import { getAllPrompts } from "@/lib/prompts";
import { getAllRadarProjects } from "@/lib/radar";

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
    <SiteChrome active="tools">
      <TodayDashboard latestRadar={latestRadar} latestPrompts={latestPrompts} />
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
    </SiteChrome>
  );
}
