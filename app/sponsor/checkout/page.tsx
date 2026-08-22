import Link from "next/link";
import type { Metadata } from "next";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";

import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Sponsor Checkout",
  description: "Complete your sponsor placement.",
  robots: {
    index: false,
    follow: false,
  },
};

type SponsorCheckoutPageProps = {
  searchParams: Promise<{
    slot?: string;
    months?: string;
    company?: string;
    session?: string;
  }>;
};

export default async function SponsorCheckoutPage({ searchParams }: SponsorCheckoutPageProps) {
  const params = await searchParams;
  const months = params.months === "3" ? "3" : "1";
  const amount = months === "3" ? "$900" : "$300";
  const successParams = new URLSearchParams({
    checkout: "success",
    slot: params.slot || "",
    months,
    company: params.company || "",
    session: params.session || "",
  });

  return (
    <SiteChrome active="sponsor">
      <div className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-[620px] rounded-[8px] border border-[#1F1F1F] bg-[#111111] p-6">
          <Link
            href="/sponsor"
            className="inline-flex items-center gap-2 font-jetbrains text-[11px] uppercase text-[#7F7F7F] transition hover:text-[#2CFF05]"
          >
            <IconArrowLeft size={16} />
            Back to sponsor
          </Link>
          <p className="mt-8 font-jetbrains text-[10px] uppercase text-[#7F7F7F]">
            Payment
          </p>
          <h1 className="mt-3 font-monroe text-[42px] font-light leading-tight text-[#EAEAEA]">
            Complete sponsor payment
          </h1>
          <div className="mt-6 grid gap-3 font-jetbrains text-[12px] text-[#9A9A9A]">
            <p>Slot: {params.slot || "Selected slot"}</p>
            <p>Term: {months} {months === "3" ? "months" : "month"}</p>
            <p>Amount: {amount}</p>
          </div>
          <Link
            href={`/sponsor?${successParams.toString()}`}
            className="mt-8 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[8px] border border-[#2CFF05] px-4 font-jetbrains text-[11px] uppercase text-[#2CFF05] transition hover:bg-[#2CFF05] hover:text-[#0A0A0A]"
          >
            <IconCheck size={16} />
            Success
          </Link>
        </div>
      </div>
    </SiteChrome>
  );
}
