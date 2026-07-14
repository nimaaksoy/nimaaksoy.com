import React, { useState } from "react";
import { LifeCalculations } from "@/lib/life-in-dots/calculations";
import { UserProfile } from "@/lib/life-in-dots/types";

interface MonthsDotsProps {
  profile: UserProfile;
  calcs: LifeCalculations;
  birthDate: Date;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function MonthsDots({ profile, calcs, birthDate }: MonthsDotsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const targetAge = profile.targetAge;
  const monthsLived = calcs.monthsLived;
  const totalMonths = targetAge * 12;

  // Render rows. Each row represents 1 year of life (12 dots).
  const rows = Array.from({ length: targetAge }, (_, i) => i);
  const cols = Array.from({ length: 12 }, (_, i) => i);

  // Lazy tooltip text generator
  const getTooltipText = (monthOffset: number) => {
    const totalMonthsFromBirth = birthDate.getMonth() + monthOffset;
    const calendarMonth = totalMonthsFromBirth % 12;
    const calendarYear = birthDate.getFullYear() + Math.floor(totalMonthsFromBirth / 12);
    const age = Math.floor(monthOffset / 12);
    
    const isCurrent = monthOffset === monthsLived;
    const isLived = monthOffset < monthsLived;
    const status = isCurrent ? "Current month" : isLived ? "Completed" : "Possible future";

    return `${MONTH_NAMES[calendarMonth]} ${calendarYear} — age ${age} (${status})`;
  };

  return (
    <div className="py-6 space-y-6" id="panel-months" role="tabpanel" aria-labelledby="tab-months">
      {/* 12-column Grid */}
      <div className="max-w-[340px] mx-auto overflow-x-auto">
        <div className="grid grid-cols-12 gap-1.5 min-w-[280px]">
          {rows.map((yearIndex) =>
            cols.map((monthCol) => {
              const monthOffset = yearIndex * 12 + monthCol;
              const isLived = monthOffset < monthsLived;
              const isCurrent = monthOffset === monthsLived;
              
              let dotClass = "";
              let ariaLabel = "";

              if (isLived) {
                dotClass = "bg-[#EAEAEA]";
                ariaLabel = `Year ${yearIndex} Month ${monthCol + 1} - Completed`;
              } else if (isCurrent) {
                dotClass = "bg-[#2CFF05] animate-pulse";
                ariaLabel = `Year ${yearIndex} Month ${monthCol + 1} - Current Month`;
              } else {
                dotClass = "border border-[#7F7F7F]/40 bg-transparent hover:border-[#2CFF05]/60";
                ariaLabel = `Year ${yearIndex} Month ${monthCol + 1} - Future Month`;
              }

              return (
                <div
                  key={monthOffset}
                  className="relative flex items-center justify-center aspect-square"
                  onMouseEnter={() => setHoveredIndex(monthOffset)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <button
                    type="button"
                    aria-label={ariaLabel}
                    className={`w-2 h-2 rounded-full transition-transform duration-150 hover:scale-150 focus:scale-150 focus:outline-none focus:ring-1 focus:ring-[#2CFF05] ${dotClass}`}
                  />

                  {/* On-demand Tooltip */}
                  {hoveredIndex === monthOffset && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-[#111111] border border-[#1F1F1F] text-[#EAEAEA] text-[10px] font-jetbrains rounded whitespace-nowrap z-30 pointer-events-none shadow-xl">
                      {getTooltipText(monthOffset)}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Stats summary below */}
      <div className="space-y-2 pt-4 border-t border-[#1F1F1F] font-monroe text-[14px] text-[#9A9A9A] leading-relaxed">
        <p>
          You have lived <span className="text-[#EAEAEA] font-semibold">{monthsLived.toLocaleString()}</span> months.
        </p>
        <p>
          Current month of life: <span className="text-[#2CFF05] font-semibold">Month {(monthsLived + 1).toLocaleString()}</span>.
        </p>
        <p>
          Your next birthday countdown:{" "}
          <span className="text-[#2CFF05] font-semibold">{calcs.daysToNextBirthday} days</span> (
          {calcs.nextBirthdayDate.toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          ).
        </p>
        <p>
          Possible months ahead on this timeline:{" "}
          <span className="text-[#EAEAEA] font-semibold">{(totalMonths - monthsLived).toLocaleString()}</span> months.
        </p>
      </div>
    </div>
  );
}
