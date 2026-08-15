import type { Metadata } from "next";
import TodayDashboard from "@/components/today/TodayDashboard";
import { SiteChrome } from "@/components/SiteChrome";
import { getAllPrompts } from "@/lib/prompts";
import { getAllRadarProjects } from "@/lib/radar";

export const metadata: Metadata = {
  title: "Today — Daily Dashboard",
  description:
    "A local-first daily dashboard with calendar views, Persian dates, currency rates, a private note, and the latest from Nima Aksoy.",
  applicationName: "Today",
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
    title: "Today — Daily Dashboard",
    description:
      "Calendar views, Persian dates, currency rates, a private note, and the latest Radar and Prompts.",
    url: "https://nimaaksoy.com/today",
    type: "website",
    siteName: "Nima Aksoy",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Today — Daily Dashboard",
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
    </SiteChrome>
  );
}
