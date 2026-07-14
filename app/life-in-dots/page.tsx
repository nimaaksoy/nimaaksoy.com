import type { Metadata } from "next";
import Link from "next/link";
import LifeInDotsApp from "@/components/life-in-dots/LifeInDotsApp";

export const metadata: Metadata = {
  title: "Life in Dots — See Your Life in Time",
  description:
    "Visualize the days, months, years and hours you have lived, explore the time that may still be ahead, and make today count.",
  alternates: {
    canonical: "/life-in-dots",
  },
  openGraph: {
    title: "Life in Dots — See Your Life in Time",
    description:
      "Visualize the days, months, years and hours you have lived, explore the time that may still be ahead, and make today count.",
    url: "https://nimaaksoy.com/life-in-dots",
    type: "website",
    siteName: "Nima Aksoy",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Life in Dots — See Your Life in Time",
    description:
      "Visualize the days, months, years and hours you have lived, explore the time that may still be ahead, and make today count.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LifeInDotsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EAEAEA] flex flex-col">
      {/* Custom Minimal Header */}
      <nav className="fixed left-0 top-0 z-50 w-full border-b border-[#1A1A1A] bg-black/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-5 md:h-16 md:px-10">
          <Link
            href="/life-in-dots"
            className="font-jetbrains text-[11px] font-medium uppercase tracking-[0.2em] text-[#EAEAEA] transition-colors hover:text-[#2CFF05] md:text-sm md:tracking-[0.24em]"
          >
            Life in Dots
          </Link>
          
          <div className="flex items-center gap-4 font-jetbrains text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-[#EAEAEA] sm:gap-6">
            <a href="#about-section" className="transition-colors hover:text-[#2CFF05]">
              About
            </a>
            <a href="#privacy-section" className="transition-colors hover:text-[#2CFF05]">
              Privacy
            </a>
            <a href="#chrome-extension" className="transition-colors hover:text-[#2CFF05] hidden sm:inline">
              Add to Chrome
            </a>
            <span className="hidden sm:inline text-[#1F1F1F]">|</span>
            <Link href="/" className="text-[#9A9A9A] transition-colors hover:text-[#EAEAEA]">
              nimaaksoy.com
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content wrapper */}
      <main className="pt-14 md:pt-16 flex-grow">
        <LifeInDotsApp />
      </main>

      {/* Custom Minimal Footer */}
      <footer className="border-t border-[#1F1F1F] bg-[#0A0A0A] px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-[1280px] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1">
            <p className="font-monroe text-[14px] text-[#EAEAEA]">
              Life in Dots is a small experiment by{" "}
              <a
                href="https://nimaaksoy.com"
                target="_blank"
                rel="noreferrer"
                className="underline text-[#2CFF05] hover:opacity-85"
              >
                Nima Aksoy
              </a>
              .
            </p>
            <p className="font-jetbrains text-[10px] text-[#7F7F7F]">
              &copy; {new Date().getFullYear()} Nima Aksoy • All personal data remains local to your browser.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-jetbrains text-[11px] uppercase tracking-[0.1em] text-[#7F7F7F]">
            <a href="#about-section" className="hover:text-[#2CFF05] transition-colors">
              About
            </a>
            <a href="#privacy-section" className="hover:text-[#2CFF05] transition-colors">
              Privacy
            </a>
            <a href="#methodology-section" className="hover:text-[#2CFF05] transition-colors">
              Source and methodology
            </a>
            <a href="#chrome-extension" className="hover:text-[#2CFF05] transition-colors">
              Add to Chrome
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
