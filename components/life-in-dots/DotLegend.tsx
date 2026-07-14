import React from "react";

interface DotLegendProps {
  unit: string;
}

export default function DotLegend({ unit }: DotLegendProps) {
  // Singular version of unit
  const singularUnit = unit.endsWith("s") ? unit.slice(0, -1).toLowerCase() : unit.toLowerCase();

  return (
    <div className="flex flex-wrap items-center gap-6 py-4 text-[11px] font-jetbrains text-[#7F7F7F] border-b border-[#1F1F1F]">
      {/* Lived Legend */}
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#EAEAEA]" />
        <span>Completed {singularUnit}</span>
      </div>

      {/* Current Legend */}
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#2CFF05] animate-pulse" />
        <span>Current {singularUnit}</span>
      </div>

      {/* Future Legend */}
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full border border-[#7F7F7F]/50 bg-transparent" />
        <span>Possible future {singularUnit}</span>
      </div>
    </div>
  );
}
