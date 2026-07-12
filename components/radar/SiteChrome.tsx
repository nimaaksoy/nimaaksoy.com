import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/radar-shared";
import { indexPath } from "@/lib/radar-shared";

const socials = [
  { label: "X", href: "https://x.com/Nima1980" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nima1980/" },
  { label: "Medium", href: "https://medium.com/@nima.aksoy" },
  { label: "YouTube", href: "https://www.youtube.com/@nimaaksoy" },
  { label: "Telegram", href: "https://t.me/nimaaksoychannel" },
] as const;

type SiteChromeProps = {
  locale: Locale;
  children: ReactNode;
};

const copy = {
  en: {
    brand: "NIMA AKSOY",
    home: "Home",
    radar: "Radar",
    tools: "Tools",
    connect: "Connect",
    nav: "NAVIGATION",
    social: "SOCIAL",
    tagline: "Projects, ideas, and a few things in motion.",
    altLocale: "فارسی",
    altHref: "/fa/radar",
  },
  fa: {
    brand: "نیما آکسوی",
    home: "خانه",
    radar: "رادار",
    tools: "ابزارها",
    connect: "ارتباط",
    nav: "ناوبری",
    social: "شبکه‌ها",
    tagline: "پروژه‌ها، ایده‌ها، و چند چیز در جریان.",
    altLocale: "English",
    altHref: "/radar",
  },
} as const;

export function SiteChrome({ locale, children }: SiteChromeProps) {
  const t = copy[locale];
  const radarHref = indexPath(locale);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EAEAEA]">
      <nav className="fixed left-0 top-0 z-50 w-full border-b border-[#1A1A1A] bg-black/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-5 md:h-16 md:px-10">
          <Link
            href="/"
            className="font-jetbrains text-[11px] font-medium uppercase tracking-[0.2em] text-[#EAEAEA] transition-colors hover:text-[#2CFF05] md:text-sm md:tracking-[0.24em]"
          >
            {t.brand}
          </Link>
          <div className="flex items-center gap-5 font-jetbrains text-[11px] uppercase tracking-[0.14em] text-[#EAEAEA] md:gap-8 md:text-[12px]">
            <Link href="/" className="transition-colors hover:text-[#2CFF05]">
              {t.home}
            </Link>
            <Link
              href={radarHref}
              className="text-[#2CFF05] transition-colors hover:opacity-80"
            >
              {t.radar}
            </Link>
            <Link
              href="/tools"
              className="hidden transition-colors hover:text-[#2CFF05] sm:inline"
            >
              {t.tools}
            </Link>
            <Link
              href={t.altHref}
              className="rounded-full border border-[#1F1F1F] px-3 py-1 text-[10px] tracking-[0.12em] text-[#9A9A9A] transition-colors hover:border-[#2CFF05] hover:text-[#2CFF05]"
            >
              {t.altLocale}
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-14 md:pt-16">{children}</main>

      <footer className="border-t-[0.5px] border-[#1F1F1F] bg-[#0A0A0A] px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <h3 className="font-monroe text-[18px] font-normal text-[#EAEAEA]">
                Nima Aksoy
              </h3>
              <p className="mt-2 max-w-sm font-monroe text-[14px] text-[#7F7F7F]">
                {t.tagline}
              </p>
            </div>

            <div>
              <p className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">
                {t.nav}
              </p>
              <div className="mt-3 flex flex-col gap-2 font-jetbrains text-[12px] text-[#9A9A9A]">
                <Link href={radarHref} className="transition hover:text-[#2CFF05]">
                  {t.radar}
                </Link>
                <Link href="/tools" className="transition hover:text-[#2CFF05]">
                  {t.tools}
                </Link>
                <Link href="/#connect" className="transition hover:text-[#2CFF05]">
                  {t.connect}
                </Link>
              </div>
            </div>

            <div>
              <p className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">
                {t.social}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 font-jetbrains text-[12px] text-[#7F7F7F]">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition hover:text-[#2CFF05]"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 border-t-[0.5px] border-[#1F1F1F] pt-6">
            <p className="font-jetbrains text-[11px] text-[#7F7F7F]">
              © 2026 Nima Aksoy
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
