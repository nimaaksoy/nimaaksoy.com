"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { sponsorSlots as defaultSponsorSlots, type SponsorSlot } from "@/lib/sponsor-slots";

type SponsorSlotsResponse = {
  slots?: SponsorSlot[];
};

function SponsorBanner({ slot }: { slot: SponsorSlot }) {
  return (
    <a
      href={slot.href}
      className="group grid h-[86px] grid-cols-[48px_1fr] gap-3 overflow-hidden rounded-[8px] border border-[#202020] bg-[#111111] p-3 transition hover:border-[#2CFF05]/60 hover:bg-[#151515]"
    >
      <Image
        src={slot.logo}
        alt={`${slot.name} logo`}
        width={48}
        height={48}
        className="aspect-square rounded-[8px] border border-[#242424] object-cover"
      />
      <div className="min-w-0">
        <h3 className="truncate font-monroe text-[16px] font-light text-[#EAEAEA]">
          {slot.name}
        </h3>
        <p className="mt-1 line-clamp-2 font-jetbrains text-[10px] leading-[1.45] text-[#9A9A9A]">
          {slot.line}
        </p>
      </div>
    </a>
  );
}

function SponsorAvailabilityBanner({ openCount }: { openCount: number }) {
  return (
    <a
      href="/sponsor"
      className="flex h-[86px] flex-col items-center justify-center overflow-hidden rounded-[8px] border border-[#202020] bg-[#111111] p-3 text-center transition hover:border-[#2CFF05]/60 hover:bg-[#151515]"
    >
      <span className="font-jetbrains text-[10px] uppercase text-[#2CFF05]">
        Sponsor
      </span>
      <span className="mt-1 font-monroe text-[16px] font-light text-[#EAEAEA]">
        {openCount}/8 left
      </span>
    </a>
  );
}

function MobileBannerCard({ slot }: { slot: SponsorSlot }) {
  return (
    <a
      href={slot.href}
      className="grid h-9 w-[132px] shrink-0 grid-cols-[24px_1fr] items-center gap-2 overflow-hidden rounded-[6px] border border-[#202020] bg-[#111111] px-2"
    >
      <Image
        src={slot.logo}
        alt={`${slot.name} logo`}
        width={24}
        height={24}
        className="aspect-square rounded-[6px] border border-[#242424] object-cover"
      />
      <span className="truncate font-monroe text-[13px] font-light text-[#EAEAEA]">
        {slot.name}
      </span>
    </a>
  );
}

function MobileSponsorBanner({ openCount }: { openCount: number }) {
  return (
    <a
      href="/sponsor"
      className="flex h-9 w-[132px] shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-[6px] border border-[#202020] bg-[#111111] px-2 text-center"
    >
      <span className="font-jetbrains text-[9px] uppercase text-[#2CFF05]">
        Sponsor
      </span>
      <span className="font-monroe text-[13px] font-light text-[#EAEAEA]">
        {openCount}/8 left
      </span>
    </a>
  );
}

function MobileSponsorMarquee({
  rail,
  slots,
  openCount,
  reverse = false,
  className = "",
}: {
  rail: SponsorSlot["rail"];
  slots: SponsorSlot[];
  openCount: number;
  reverse?: boolean;
  className?: string;
}) {
  const mobileSlots = slots.filter(
    (slot) => slot.rail === rail && slot.status === "taken",
  );
  const showAvailability = rail === "right";

  if (!mobileSlots.length && !showAvailability) {
    return null;
  }

  return (
    <div className={`sponsor-mobile-marquee lg:hidden ${className}`}>
      <div
        className={`sponsor-mobile-marquee-track ${
          reverse ? "sponsor-mobile-marquee-reverse" : ""
        }`}
      >
        {Array.from({ length: 3 }).flatMap((_, set) => [
          ...mobileSlots.map((slot) => (
            <MobileBannerCard key={`${set}-${slot.id}`} slot={slot} />
          )),
          ...(showAvailability ? [<MobileSponsorBanner key={`${set}-sponsor`} openCount={openCount} />] : []),
        ])}
      </div>
    </div>
  );
}

function SponsorRail({
  side,
  slots,
  openCount,
}: {
  side: SponsorSlot["rail"];
  slots: SponsorSlot[];
  openCount: number;
}) {
  const railSlots = slots.filter(
    (slot) => slot.rail === side && slot.status === "taken",
  );
  const showAvailability = side === "right";

  if (!railSlots.length && !showAvailability) {
    return null;
  }

  return (
    <aside
      className="hidden flex-col gap-3 lg:flex lg:sticky lg:top-24 lg:self-start"
      aria-label={`${side} sponsor rail`}
    >
      {railSlots.map((slot) => (
        <SponsorBanner key={slot.id} slot={slot} />
      ))}
      {showAvailability ? <SponsorAvailabilityBanner openCount={openCount} /> : null}
    </aside>
  );
}

export function SponsorAdFrame({ children }: { children: ReactNode }) {
  const [slots, setSlots] = useState(defaultSponsorSlots);
  const openCount = slots.filter((slot) => slot.status === "open").length;
  const hasLeftRail = slots.some(
    (slot) => slot.rail === "left" && slot.status === "taken",
  );
  const gridTemplate = hasLeftRail
    ? "lg:grid-cols-[220px_minmax(0,1fr)_220px]"
    : "lg:grid-cols-[minmax(0,1fr)_220px]";

  useEffect(() => {
    let ignore = false;

    async function loadSponsorSlots() {
      try {
        const response = await fetch("/api/sponsor-slots", { cache: "no-store" });
        const payload = (await response.json()) as SponsorSlotsResponse;

        if (!ignore && response.ok && payload.slots?.length) {
          setSlots(payload.slots);
        }
      } catch {
        // Keep the default open slots if the live sponsor feed is unavailable.
      }
    }

    loadSponsorSlots();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <MobileSponsorMarquee
        rail="right"
        slots={slots}
        openCount={openCount}
        className="fixed left-0 top-14 z-[45] bg-[#0A0A0A]/95 py-1 backdrop-blur-sm md:top-16"
      />
      <div
        className={`mx-auto grid max-w-[1580px] gap-8 pb-12 ${gridTemplate} lg:items-start lg:pb-0 xl:gap-10`}
      >
        {hasLeftRail ? <SponsorRail side="left" slots={slots} openCount={openCount} /> : null}
        <div className="min-w-0">{children}</div>
        <SponsorRail side="right" slots={slots} openCount={openCount} />
      </div>
      <MobileSponsorMarquee
        rail="left"
        slots={slots}
        openCount={openCount}
        reverse
        className="fixed bottom-0 left-0 z-[45] bg-[#0A0A0A]/95 py-1 backdrop-blur-sm"
      />
    </>
  );
}
