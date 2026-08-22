import Link from "next/link";
import type { ReactNode } from "react";
import { IconArrowUpRight, IconBrandGithub } from "@tabler/icons-react";

import MobileNav from "@/components/MobileNav";
import SiteFooter from "@/components/SiteFooter";
import { indexPath } from "@/lib/radar-shared";

const GITHUB_URL = "https://github.com/nimaaksoy/nimaaksoy.com";

type SiteChromeProps = {
  children: ReactNode;
  active?: "home" | "radar" | "today" | "tools" | "prompts" | "stats" | "sponsor";
};

function navClass(isActive: boolean) {
  return isActive
    ? "text-[#2CFF05] transition-colors hover:opacity-80"
    : "text-[#EAEAEA] transition-colors hover:text-[#2CFF05]";
}

export function SiteChrome({ children, active }: SiteChromeProps) {
  const radarHref = indexPath();
  const hasSponsorMobileBanner = active === "sponsor";

  const navItems = [
    { label: "Home", href: "/", isActive: active === "home" },
    { label: "Radar", href: radarHref, isActive: active === "radar" },
    { label: "Today", href: "/today", isActive: active === "today" },
    { label: "Prompts", href: "/prompts", isActive: active === "prompts" },
    { label: "Tools", href: "/tools", isActive: active === "tools" },
    { label: "Stats", href: "/stats", isActive: active === "stats" },
    { label: "Sponsor", href: "/sponsor", isActive: active === "sponsor" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EAEAEA]">
      <nav
        className={`fixed left-0 z-50 w-full border-b border-[#1A1A1A] bg-black/80 backdrop-blur-sm ${
          hasSponsorMobileBanner ? "top-11 lg:top-0" : "top-0"
        }`}
      >
        <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-5 md:h-16 md:px-10">
          <Link
            href="/"
            className="font-jetbrains text-[11px] font-medium uppercase tracking-[0.2em] text-[#EAEAEA] transition-colors hover:text-[#2CFF05] md:text-sm md:tracking-[0.24em]"
          >
            NIMA AKSOY
          </Link>
          <div className="hidden items-center gap-8 font-jetbrains text-[12px] uppercase tracking-[0.14em] md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={navClass(item.isActive)}>
                {item.label}
              </Link>
            ))}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[#EAEAEA] transition-colors hover:text-[#2CFF05]"
              aria-label="Open nimaaksoy/nimaaksoy.com on GitHub"
            >
              <IconBrandGithub size={16} stroke={1.8} />
              <span>GitHub</span>
              <IconArrowUpRight size={14} stroke={1.8} />
            </a>
          </div>

          <MobileNav items={navItems} githubUrl={GITHUB_URL} />
        </div>
      </nav>

      <main
        className={
          hasSponsorMobileBanner ? "pt-[100px] md:pt-[108px] lg:pt-16" : "pt-14 md:pt-16"
        }
      >
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
