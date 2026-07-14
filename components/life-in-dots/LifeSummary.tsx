import React from "react";
import { LifeCalculations } from "@/lib/life-in-dots/calculations";
import { UserProfile } from "@/lib/life-in-dots/types";

interface LifeSummaryProps {
  profile: UserProfile;
  calcs: LifeCalculations;
}

export default function LifeSummary({ profile, calcs }: LifeSummaryProps) {
  const targetAge = profile.targetAge;

  return (
    <div className="w-full py-8 border-b border-[#1F1F1F] grid gap-8 md:grid-cols-3">
      {/* Lived Section */}
      <div className="flex flex-col">
        <span className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">
          You have lived
        </span>
        <span className="mt-2 font-monroe text-[36px] md:text-[48px] font-light text-[#EAEAEA] leading-none">
          {calcs.daysLived.toLocaleString()}{" "}
          <span className="text-[16px] md:text-[20px] font-normal text-[#7F7F7F]">
            days
          </span>
        </span>
      </div>

      {/* Today Section */}
      <div className="flex flex-col border-y border-[#1F1F1F] py-6 md:border-y-0 md:py-0 md:border-x md:px-8">
        <span className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">
          Current Day
        </span>
        <span className="mt-2 font-monroe text-[36px] md:text-[48px] font-light text-[#2CFF05] leading-none">
          Day {calcs.todayLivedIndex.toLocaleString()}
        </span>
      </div>

      {/* Ahead Section */}
      <div className="flex flex-col">
        <span className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">
          Your possible {targetAge}-year timeline
        </span>
        <span className="mt-2 font-monroe text-[36px] md:text-[48px] font-light text-[#EAEAEA] leading-none">
          ~{calcs.daysAheadInTimeline.toLocaleString()}{" "}
          <span className="text-[16px] md:text-[20px] font-normal text-[#7F7F7F]">
            days ahead
          </span>
        </span>
        <span className="mt-2 font-jetbrains text-[11px] text-[#7F7F7F] leading-normal">
          This timeline is chosen by you. It is not a prediction.
        </span>
      </div>
    </div>
  );
}
