import React from "react";
import { ViewUnit } from "@/lib/life-in-dots/types";

interface UnitTabsProps {
  selected: ViewUnit;
  onChange: (unit: ViewUnit) => void;
}

const UNITS: ViewUnit[] = ["Years", "Months", "Days", "Hours"];

export default function UnitTabs({ selected, onChange }: UnitTabsProps) {
  return (
    <div className="w-full flex items-center justify-between border-b border-[#1F1F1F] py-4">
      {/* Unit Tab Buttons */}
      <div 
        className="flex bg-[#111111] p-1 rounded-lg border border-[#1F1F1F]"
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

      <div className="hidden sm:block text-[11px] font-jetbrains text-[#7F7F7F]">
        Select unit to change the detail grid
      </div>
    </div>
  );
}
