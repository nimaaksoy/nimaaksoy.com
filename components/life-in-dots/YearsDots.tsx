import React, { useState } from "react";
import { LifeCalculations } from "@/lib/life-in-dots/calculations";
import { UserProfile } from "@/lib/life-in-dots/types";

interface YearsDotsProps {
  profile: UserProfile;
  calcs: LifeCalculations;
}

export default function YearsDots({ profile, calcs }: YearsDotsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const targetAge = profile.targetAge;
  const currentAge = calcs.ageYears;
  
  // Total years is the target age
  const years = Array.from({ length: targetAge }, (_, i) => i);

  return (
    <div className="py-6 space-y-6" id="panel-years" role="tabpanel" aria-labelledby="tab-years">
      {/* 10-column Grid */}
      <div className="relative">
        <div className="grid grid-cols-10 gap-3 max-w-[280px] mx-auto md:mx-0">
          {years.map((yearIndex) => {
            const isLived = yearIndex < currentAge;
            const isCurrent = yearIndex === currentAge;
            
            let dotClass = "";
            let ariaLabel = "";

            if (isLived) {
              dotClass = "bg-[#EAEAEA] border border-transparent";
              ariaLabel = `Age ${yearIndex} - Completed year`;
            } else if (isCurrent) {
              dotClass = "bg-[#2CFF05] border border-transparent animate-pulse";
              ariaLabel = `Age ${yearIndex} - Your current year`;
            } else {
              dotClass = "border border-[#7F7F7F]/50 bg-transparent hover:border-[#2CFF05]/60";
              ariaLabel = `Age ${yearIndex} - Possible future year`;
            }

            return (
              <div
                key={yearIndex}
                className="relative flex items-center justify-center aspect-square"
                onMouseEnter={() => setHoveredIndex(yearIndex)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <button
                  type="button"
                  aria-label={ariaLabel}
                  className={`w-3.5 h-3.5 rounded-full transition-transform duration-200 hover:scale-125 focus:scale-125 focus:outline-none focus:ring-2 focus:ring-[#2CFF05] ${dotClass}`}
                />
                
                {/* Floating Tooltip */}
                {hoveredIndex === yearIndex && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#111111] border border-[#1F1F1F] text-[#EAEAEA] text-[10px] font-jetbrains rounded whitespace-nowrap z-30 pointer-events-none shadow-lg">
                    {isCurrent
                      ? `Age ${yearIndex} — Current year`
                      : isLived
                      ? `Age ${yearIndex} — Completed`
                      : `Age ${yearIndex} — Possible future`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Narrative stats below grid */}
      <div className="space-y-2 pt-4 border-t border-[#1F1F1F] font-monroe text-[14px] text-[#9A9A9A] leading-relaxed">
        <p>
          You are <span className="text-[#EAEAEA] font-semibold">{currentAge}</span> years old.
        </p>
        <p>
          You have celebrated <span className="text-[#EAEAEA] font-semibold">{calcs.birthdaysCelebrated}</span> birthdays.
        </p>
        <p>
          Your selected timeline to age <span className="text-[#EAEAEA] font-semibold">{targetAge}</span> leaves approximately{" "}
          <span className="text-[#2CFF05] font-semibold">{calcs.possibleBirthdaysAhead}</span> birthdays ahead.
        </p>
        <p>
          You are <span className="text-[#2CFF05] font-semibold">{Math.round(calcs.percentageLivedOfTimeline)}%</span> through the {targetAge}-year timeline you selected.
        </p>
      </div>
    </div>
  );
}
