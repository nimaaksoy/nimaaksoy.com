import type { Metadata } from "next";
import { RadarFeed } from "@/components/radar/RadarFeed";
import { SiteChrome } from "@/components/radar/SiteChrome";
import { getAllRadarProjects } from "@/lib/radar";

export const metadata: Metadata = {
  title: "Radar",
  description:
    "What I’m watching — open source and AI finds from Nima Aksoy.",
  alternates: {
    canonical: "/radar",
  },
  openGraph: {
    title: "Radar | Nima Aksoy",
    description: "Open source and AI finds from Nima Aksoy.",
    url: "https://nimaaksoy.com/radar",
  },
};

export default async function RadarPage() {
  let projects: Awaited<ReturnType<typeof getAllRadarProjects>> = [];
  let error: string | null = null;

  try {
    projects = await getAllRadarProjects();
  } catch {
    error = "Could not load Radar projects. Try again later.";
  }

  return (
    <SiteChrome active="radar">
      {error ? (
        <div className="px-6 py-20">
          <div className="mx-auto max-w-[640px] rounded-2xl border border-red-400/30 bg-[#111111] px-6 py-12 text-center">
            <p className="font-monroe text-[20px] text-[#EAEAEA]">
              Something went wrong
            </p>
            <p className="mt-2 font-monroe text-[15px] text-[#9A9A9A]">{error}</p>
          </div>
        </div>
      ) : (
        <RadarFeed projects={projects} />
      )}
    </SiteChrome>
  );
}
