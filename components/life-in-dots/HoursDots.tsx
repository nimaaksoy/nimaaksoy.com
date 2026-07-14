import React from "react";
import { LifeCalculations } from "@/lib/life-in-dots/calculations";
import { UserProfile } from "@/lib/life-in-dots/types";

interface HoursDotsProps {
  profile: UserProfile;
  calcs: LifeCalculations;
}

export default function HoursDots({ profile, calcs }: HoursDotsProps) {
  const currentHour = new Date().getHours();
  
  // Calculate today's hour dots
  const todayHours = Array.from({ length: 24 }, (_, i) => i);
  
  // Grouped lifetime hours calculation: 1 dot = 1,000 hours.
  // How many dots in target lifetime?
  // Target age * 365.2425 * 24 = total hours.
  const totalHours = profile.targetAge * 365.25 * 24;
  const totalDotsCount = Math.ceil(totalHours / 1000);
  const livedDotsCount = Math.floor(calcs.hoursLived / 1000);
  const currentDotIndex = livedDotsCount;

  // Let's create an array of dots
  const dots = Array.from({ length: totalDotsCount }, (_, i) => i);

  // Sleeping and waking estimates:
  // Sleep hours from user profile
  const sleepHours = profile.sleepHours || 8;
  const wakeHours = 24 - sleepHours;

  const totalSleepLived = Math.round(calcs.hoursLived * (sleepHours / 24));
  const totalWakeLived = Math.round(calcs.hoursLived * (wakeHours / 24));
  
  return (
    <div className="py-6 space-y-8" id="panel-hours" role="tabpanel" aria-labelledby="tab-hours">
      {/* Today's 24 hours */}
      <div className="space-y-3">
        <h3 className="font-monroe text-[15px] text-[#EAEAEA] font-normal">
          Today&apos;s Hours (24 Hours)
        </h3>
        <div className="flex flex-wrap gap-2 max-w-[280px]">
          {todayHours.map((hour) => {
            const isLived = hour < currentHour;
            const isCurrent = hour === currentHour;
            
            let dotClass = "";
            let label = "";

            if (isCurrent) {
              dotClass = "bg-[#2CFF05] animate-pulse";
              label = `Current hour (${hour}:00)`;
            } else if (isLived) {
              dotClass = "bg-[#EAEAEA]";
              label = `Hour ${hour}:00 completed`;
            } else {
              dotClass = "border border-[#7F7F7F]/40 bg-transparent hover:border-[#2CFF05]/60";
              label = `Hour ${hour}:00 future`;
            }

            return (
              <div key={hour} className="relative group flex items-center justify-center">
                <button
                  type="button"
                  aria-label={label}
                  className={`w-3.5 h-3.5 rounded-full transition-all focus:scale-125 focus:ring-1 focus:ring-[#2CFF05] ${dotClass}`}
                />
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block group-focus-within:block px-2 py-1 bg-[#111111] border border-[#1F1F1F] text-[#EAEAEA] text-[10px] font-jetbrains rounded whitespace-nowrap z-30 pointer-events-none shadow-lg">
                  {hour === 0 ? "12 AM" : hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                  {isCurrent ? " — Current Hour" : isLived ? " — Passed" : " — Ahead"}
                </div>
              </div>
            );
          })}
        </div>
        <p className="font-monroe text-[13px] text-[#9A9A9A]">
          Hours passed today: <span className="text-[#EAEAEA] font-semibold">{currentHour}</span> • Remaining today:{" "}
          <span className="text-[#2CFF05] font-semibold">{24 - currentHour}</span>
        </p>
      </div>

      {/* Lifetime Hours */}
      <div className="space-y-4 pt-6 border-t border-[#1F1F1F]">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-monroe text-[15px] text-[#EAEAEA] font-normal">
            Lifetime Hours (1 dot = 1,000 hours)
          </h3>
          <span className="font-jetbrains text-[10px] text-[#7F7F7F]">
            Lived: ~{calcs.hoursLived.toLocaleString()} hrs
          </span>
        </div>

        {/* Small high-density dot grid */}
        <div className="flex flex-wrap gap-1 max-w-full">
          {dots.map((dotIndex) => {
            const isLived = dotIndex < livedDotsCount;
            const isCurrent = dotIndex === currentDotIndex;
            
            let dotClass = "";
            let label = "";

            if (isCurrent) {
              dotClass = "bg-[#2CFF05]";
              label = `Current 1,000-hour block (Block #${dotIndex + 1})`;
            } else if (isLived) {
              dotClass = "bg-[#EAEAEA]/80";
              label = `Block #${dotIndex + 1} completed`;
            } else {
              dotClass = "w-1 h-1 rounded-full bg-white/[0.04] border-[0.2px] border-[#7F7F7F]/10";
              label = `Block #${dotIndex + 1} future`;
            }

            return (
              <div key={dotIndex} className="group relative flex items-center justify-center shrink-0">
                <span
                  role="img"
                  aria-label={label}
                  className={`w-1.5 h-1.5 rounded-full block transition-colors ${dotClass}`}
                />
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block px-2 py-1 bg-[#111111] border border-[#1F1F1F] text-[#EAEAEA] text-[9px] font-jetbrains rounded whitespace-nowrap z-30 pointer-events-none shadow-lg">
                  Hours {(dotIndex * 1000).toLocaleString()} - {((dotIndex + 1) * 1000).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats and waking/sleeping estimates */}
        <div className="grid gap-6 sm:grid-cols-2 pt-2 text-[13px] font-monroe text-[#9A9A9A]">
          <div className="space-y-1">
            <p>
              Approximately <span className="text-[#EAEAEA] font-semibold">{calcs.hoursLived.toLocaleString()}</span> hours lived.
            </p>
            <p>
              Possible hours ahead:{" "}
              <span className="text-[#2CFF05] font-semibold">
                ~{Math.max(0, Math.round(totalHours) - calcs.hoursLived).toLocaleString()}
              </span>
            </p>
          </div>
          <div className="space-y-1">
            <p>
              Waking hours experienced: <span className="text-[#EAEAEA] font-semibold">~{totalWakeLived.toLocaleString()}</span>
            </p>
            <p>
              Sleeping hours experienced: <span className="text-[#EAEAEA] font-semibold">~{totalSleepLived.toLocaleString()}</span>
            </p>
            <p className="text-[11px] font-jetbrains text-[#7F7F7F]">
              Based on {sleepHours} hours of sleep daily.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
