import Link from "next/link";
import type { ReactNode } from "react";
import { IconArrowUpRight, IconBrandGithub } from "@tabler/icons-react";

import SiteFooter from "@/components/SiteFooter";
import { indexPath } from "@/lib/radar-shared";

type SiteChromeProps = {
  children: ReactNode;
  active?: "home" | "radar" | "tools" | "prompts" | "stats";
};

function navClass(isActive: boolean) {
  return isActive
    ? "text-[#2CFF05] transition-colors hover:opacity-80"
    : "text-[#EAEAEA] transition-colors hover:text-[#2CFF05]";
}

export function SiteChrome({ children, active }: SiteChromeProps) {
  const radarHref = indexPath();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EAEAEA]">
      <nav className="fixed left-0 top-0 z-50 w-full border-b border-[#1A1A1A] bg-black/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-5 md:h-16 md:px-10">
          <Link
            href="/"
            className="font-jetbrains text-[11px] font-medium uppercase tracking-[0.2em] text-[#EAEAEA] transition-colors hover:text-[#2CFF05] md:text-sm md:tracking-[0.24em]"
          >
            NIMA AKSOY
          </Link>
          <div className="flex items-center gap-3 font-jetbrains text-[10px] uppercase tracking-[0.12em] sm:gap-5 sm:text-[11px] md:gap-8 md:text-[12px] md:tracking-[0.14em]">
            <Link href="/" className={navClass(active === "home")}>
              Home
            </Link>
            <Link href={radarHref} className={navClass(active === "radar")}>
              Radar
            </Link>
            <Link href="/prompts" className={navClass(active === "prompts")}>
              Prompts
            </Link>
            <Link
              href="/tools"
              className={`${navClass(active === "tools")} hidden sm:inline`}
            >
              Tools
            </Link>
            <Link
              href="/stats"
              className={`${navClass(active === "stats")} hidden lg:inline`}
            >
              Stats
            </Link>
            <a
              href="https://github.com/nimaaksoy/nimaaksoy.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[#EAEAEA] transition-colors hover:text-[#2CFF05]"
              aria-label="Open nimaaksoy/nimaaksoy.com on GitHub"
            >
              <IconBrandGithub size={16} stroke={1.8} />
              <span className="hidden md:inline">GitHub</span>
              <IconArrowUpRight size={14} stroke={1.8} />
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-14 md:pt-16">{children}</main>

      <SiteFooter />
    </div>
  );
}
