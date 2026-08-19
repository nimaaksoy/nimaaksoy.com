import Link from "next/link";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandMedium,
  IconBrandTelegram,
  IconBrandX,
  IconBrandYoutube,
  IconMail,
} from "@tabler/icons-react";

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/nimaaksoy/nimaaksoy.com",
    icon: IconBrandGithub,
  },
  { label: "X", href: "https://x.com/Nima1980", icon: IconBrandX },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/nima1980/",
    icon: IconBrandLinkedin,
  },
  {
    label: "Medium",
    href: "https://medium.com/@nima.aksoy",
    icon: IconBrandMedium,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@nimaaksoy",
    icon: IconBrandYoutube,
  },
  {
    label: "Substack",
    href: "https://substack.com/@nimaaksoy",
    icon: IconMail,
  },
  {
    label: "Telegram",
    href: "https://t.me/nimaaksoychannel",
    icon: IconBrandTelegram,
  },
] as const;

export default function SiteFooter() {
  return (
    <footer className="border-t-[0.5px] border-[#1F1F1F] bg-[#0A0A0A] px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="font-monroe text-[18px] font-normal text-[#EAEAEA]">
              Nima Aksoy
            </h3>
            <p className="mt-2 max-w-sm font-monroe text-[14px] text-[#7F7F7F]">
              Projects, ideas, and a few things in motion.
            </p>
          </div>

          <div>
            <p className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">
              NAVIGATION
            </p>
            <div className="mt-3 flex flex-col gap-2 font-jetbrains text-[12px] text-[#9A9A9A]">
              <Link href="/radar" className="transition hover:text-[#2CFF05]">
                Radar
              </Link>
              <Link href="/today" className="transition hover:text-[#2CFF05]">
                Today
              </Link>
              <Link href="/tools" className="transition hover:text-[#2CFF05]">
                Tools
              </Link>
              <Link href="/prompts" className="transition hover:text-[#2CFF05]">
                Prompts
              </Link>
              <Link href="/stats" className="transition hover:text-[#2CFF05]">
                Stats
              </Link>
              <Link href="/#connect" className="transition hover:text-[#2CFF05]">
                Connect
              </Link>
            </div>
          </div>

          <div>
            <p className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">
              SOCIAL
            </p>
            <div className="mt-3 flex items-center gap-4 text-[#7F7F7F]">
              {socials.map((social) => {
                const SocialIcon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition hover:text-[#2CFF05]"
                    aria-label={social.label}
                  >
                    <SocialIcon size={22} stroke={1.8} />
                  </a>
                );
              })}
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
  );
}
