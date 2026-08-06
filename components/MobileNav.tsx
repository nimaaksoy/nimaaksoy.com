"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IconArrowUpRight, IconBrandGithub, IconMenu2, IconX } from "@tabler/icons-react";

export type MobileNavItem = {
  label: string;
  href: string;
  isActive: boolean;
};

type MobileNavProps = {
  items: MobileNavItem[];
  githubUrl: string;
};

export default function MobileNav({ items, githubUrl }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    // The panel is mobile-only, so close it if the viewport grows past the
    // breakpoint — otherwise the scroll lock below would outlive it.
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpointChange = () => {
      if (desktop.matches) {
        setOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpointChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpointChange);
    };
  }, [open]);

  // Rendered into <body>: the fixed navbar sets `backdrop-blur`, which makes it
  // the containing block for fixed-position descendants and would collapse the
  // full-screen overlay to nothing.
  const panel = (
    <>
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-x-0 bottom-0 top-14 z-30 bg-black/60 transition-opacity duration-200 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        id="mobile-nav-panel"
        aria-hidden={!open}
        className={`fixed left-0 top-14 z-40 w-full origin-top border-b border-[#1A1A1A] bg-[#0A0A0A] transition duration-200 ease-out md:hidden ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-2 opacity-0"
        }`}
      >
        <nav
          aria-label="Mobile"
          className="mx-auto flex w-full max-w-[1280px] flex-col px-5 pb-5 pt-2"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              tabIndex={open ? undefined : -1}
              aria-current={item.isActive ? "page" : undefined}
              onClick={() => setOpen(false)}
              className={`border-b border-[#1A1A1A] py-4 font-jetbrains text-[12px] uppercase tracking-[0.16em] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2CFF05] ${
                item.isActive ? "text-[#2CFF05]" : "text-[#EAEAEA] hover:text-[#2CFF05]"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            tabIndex={open ? undefined : -1}
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2 py-4 font-jetbrains text-[12px] uppercase tracking-[0.16em] text-[#EAEAEA] transition-colors hover:text-[#2CFF05] focus:outline-none focus:ring-2 focus:ring-[#2CFF05]"
          >
            <IconBrandGithub size={16} stroke={1.8} />
            <span>GitHub</span>
            <IconArrowUpRight size={14} stroke={1.8} />
          </a>
        </nav>
      </div>
    </>
  );

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        className="-mr-1 inline-flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#1F1F1F] text-[#EAEAEA] transition-colors hover:border-[#2CFF05]/50 hover:text-[#2CFF05] focus:outline-none focus:ring-2 focus:ring-[#2CFF05]"
      >
        {open ? <IconX size={18} stroke={1.8} /> : <IconMenu2 size={18} stroke={1.8} />}
      </button>

      {mounted ? createPortal(panel, document.body) : null}
    </div>
  );
}
