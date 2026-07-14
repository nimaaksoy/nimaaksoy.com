import React from "react";
import InlineEditable from "./InlineEditable";
import { LifeCalculations } from "@/lib/life-in-dots/calculations";
import { UserProfile } from "@/lib/life-in-dots/types";

interface SleepEstimateProps {
  profile: UserProfile;
  calcs: LifeCalculations;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export default function SleepEstimate({
  profile,
  calcs,
  onUpdateProfile,
}: SleepEstimateProps) {
  const sleepHours = profile.sleepHours || 8;
  
  // Sleep Calculations:
  // Sleep fraction of day = sleepHours / 24
  const sleepDays = calcs.daysLived * (sleepHours / 24);
  const sleepYears = (sleepDays / 365.25).toFixed(1);
  const sleepHoursTotal = Math.round(calcs.daysLived * sleepHours);
  const sleepNights = calcs.daysLived;

  // Waking calculations
  const wakeHours = 24 - sleepHours;
  const wakeDays = calcs.daysLived * (wakeHours / 24);
  const wakeYears = (wakeDays / 365.25).toFixed(1);
  const wakeHoursTotal = Math.round(calcs.daysLived * wakeHours);

  const handleSaveSleepHours = (val: string) => {
    const hours = Number(val);
    if (isNaN(hours) || hours < 4 || hours > 12) {
      return false;
    }
    onUpdateProfile({ sleepHours: hours });
    return true;
  };

  return (
    <div className="w-full py-8 border-b border-[#1F1F1F] space-y-6">
      <div className="flex flex-col">
        <span className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">
          Time Distribution
        </span>
        <h3 className="mt-2 font-monroe text-[18px] text-[#EAEAEA] font-normal">
          Some of your time, differently
        </h3>
      </div>

      <div className="space-y-4 max-w-xl">
        <p className="font-monroe text-[16px] text-[#EAEAEA] leading-relaxed">
          You may have spent around <span className="text-[#2CFF05] font-semibold">{sleepYears} years</span> sleeping.
        </p>

        {/* Breakdown grid */}
        <div className="grid gap-4 grid-cols-2 text-[13px] font-monroe text-[#9A9A9A]">
          <div className="space-y-1">
            <p className="font-jetbrains text-[10px] uppercase text-[#7F7F7F]">Sleep Estimate</p>
            <p>Approx. hours asleep: <span className="text-[#EAEAEA] font-semibold">{sleepHoursTotal.toLocaleString()}</span></p>
            <p>Approx. nights slept: <span className="text-[#EAEAEA] font-semibold">{sleepNights.toLocaleString()}</span></p>
          </div>
          <div className="space-y-1">
            <p className="font-jetbrains text-[10px] uppercase text-[#7F7F7F]">Waking Estimate</p>
            <p>Approx. waking years: <span className="text-[#EAEAEA] font-semibold">{wakeYears} years</span></p>
            <p>Approx. waking hours: <span className="text-[#EAEAEA] font-semibold">{wakeHoursTotal.toLocaleString()}</span></p>
          </div>
        </div>

        {/* Inline sleep hours configuration */}
        <div className="pt-2 flex flex-wrap items-baseline gap-2 font-monroe text-[14px] text-[#9A9A9A]">
          <span>Based on about</span>
          <InlineEditable
            value={String(sleepHours)}
            type="number"
            label="Sleep hours per day"
            min={4}
            max={12}
            onSave={handleSaveSleepHours}
            validate={(v) => {
              const val = Number(v);
              if (isNaN(val)) return "Must be a number";
              if (val < 4 || val > 12) return "Must be between 4 and 12";
              return null;
            }}
          />
          <span>hours of sleep each day.</span>
        </div>

        <p className="text-[11px] font-jetbrains text-[#7F7F7F] leading-normal italic">
          This is only a simple estimate. It is not intended as health or medical advice.
        </p>
      </div>
    </div>
  );
}
