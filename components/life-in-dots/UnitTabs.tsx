import React from "react";
import { ViewUnit } from "@/lib/life-in-dots/types";

interface UnitTabsProps {
  selected: ViewUnit;
  onChange: (unit: ViewUnit) => void;
  trailingControl?: React.ReactNode;
}

const UNITS: ViewUnit[] = ["Years", "Months", "Days", "Hours"];

export default function UnitTabs({
  selected,
  onChange,
  trailingControl,
}: UnitTabsProps) {
  return (
    <div className="relative w-full border-b border-[#1F1F1F] py-3">
      {/* Unit Tab Buttons */}
      <div 
        className="mx-auto flex w-max bg-[#111111] p-1 rounded-lg border border-[#1F1F1F]"
        role="tablist"
        aria-label="Life visualization time units"
      >
        {UNITS.map((unit) => {
          const isActive = selected === unit;
          return (
            <button
              key={unit}
              id={`tab-${unit.toLowerCase()}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${unit.toLowerCase()}`}
              type="button"
              onClick={() => onChange(unit)}
              className={`px-4 py-2 rounded-md font-jetbrains text-[12px] uppercase tracking-[0.1em] transition-all focus:outline-none focus:ring-1 focus:ring-[#2CFF05]/50 ${
                isActive
                  ? "bg-[#0A0A0A] text-[#2CFF05] border border-[#1F1F1F]"
                  : "text-[#7F7F7F] hover:text-[#EAEAEA]"
              }`}
            >
              {unit}
            </button>
          );
        })}
      </div>
      {trailingControl ? (
        <div className="mt-3 flex justify-center lg:absolute lg:right-0 lg:top-1/2 lg:mt-0 lg:-translate-y-1/2">
          {trailingControl}
        </div>
      ) : null}
    </div>
  );
}
