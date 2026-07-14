import React from "react";
import { LifeCalculations } from "@/lib/life-in-dots/calculations";
import { UserProfile } from "@/lib/life-in-dots/types";

interface LifeSummaryProps {
  profile: UserProfile;
  calcs: LifeCalculations;
  settingsControl?: React.ReactNode;
  shareControl?: React.ReactNode;
}

export default function LifeSummary({
  profile,
  calcs,
  settingsControl,
  shareControl,
}: LifeSummaryProps) {
  const targetAge = profile.targetAge;

  return (
    <div className="grid w-full gap-5 md:grid-cols-[minmax(170px,0.8fr)_minmax(230px,1fr)_auto] md:items-end">
      {/* Lived Section */}
      <div className="flex flex-col">
        <span className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">
          You have lived · today is day
        </span>
        <span className="mt-2 font-monroe text-[34px] md:text-[44px] font-light text-[#EAEAEA] leading-none">
          {calcs.daysLived.toLocaleString()}{" "}
          <span className="text-[16px] md:text-[20px] font-normal text-[#7F7F7F]">
            days
          </span>
        </span>
      </div>

      {/* Ahead Section */}
      <div className="flex flex-col border-t border-[#1F1F1F] pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
        <div className="flex items-center gap-2">
          {settingsControl}
          <span className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">
            Your possible {targetAge}-year timeline
          </span>
        </div>
        <span className="mt-2 font-monroe text-[34px] md:text-[44px] font-light text-[#EAEAEA] leading-none">
          ~{calcs.daysAheadInTimeline.toLocaleString()}{" "}
          <span className="text-[16px] md:text-[20px] font-normal text-[#7F7F7F]">
            days ahead
          </span>
        </span>
      </div>

      <div className="flex md:justify-end">
        {shareControl}
      </div>
    </div>
  );
}
