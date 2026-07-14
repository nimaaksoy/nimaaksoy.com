import React, { useState, useMemo } from "react";
import { LifeCalculations } from "@/lib/life-in-dots/calculations";

interface LifeFactsProps {
  calcs: LifeCalculations;
}

interface FactItem {
  label: string;
  value: string | number;
  isApprox: boolean;
  category: "past" | "future";
}

export default function LifeFacts({ calcs }: LifeFactsProps) {
  const [showAll, setShowAll] = useState(false);

  const facts: FactItem[] = useMemo(() => {
    return [
      {
        label: "Days lived",
        value: calcs.daysLived.toLocaleString(),
        isApprox: false,
        category: "past",
      },
      {
        label: "Birthdays celebrated",
        value: calcs.birthdaysCelebrated,
        isApprox: false,
        category: "past",
      },
      {
        label: "Sunrises witnessed",
        value: calcs.sunrisesHappened.toLocaleString(),
        isApprox: false,
        category: "past",
      },
      {
        label: "New Year days experienced",
        value: calcs.newYearsExperienced,
        isApprox: false,
        category: "past",
      },
      {
        label: "Possible birthdays ahead",
        value: calcs.possibleBirthdaysAhead,
        isApprox: false,
        category: "future",
      },
      {
        label: "Months lived",
        value: calcs.monthsLived.toLocaleString(),
        isApprox: false,
        category: "past",
      },
      // Approximate ones
      {
        label: "Seasons experienced",
        value: calcs.seasonsExperienced.toLocaleString(),
        isApprox: true,
        category: "past",
      },
      {
        label: "Weekends experienced",
        value: calcs.weekendsExperienced.toLocaleString(),
        isApprox: true,
        category: "past",
      },
      {
        label: "Possible weekends ahead",
        value: calcs.possibleWeekendsAhead.toLocaleString(),
        isApprox: true,
        category: "future",
      },
      {
        label: "Possible seasons ahead",
        value: calcs.possibleSeasonsAhead.toLocaleString(),
        isApprox: true,
        category: "future",
      },
      {
        label: "Weeks lived",
        value: Math.floor(calcs.daysLived / 7).toLocaleString(),
        isApprox: true,
        category: "past",
      },
    ];
  }, [calcs]);

  const visibleFacts = showAll ? facts : facts.slice(0, 6);

  return (
    <div className="w-full py-8 border-b border-[#1F1F1F] space-y-6">
      <div className="flex flex-col">
        <span className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">
          Life Metrics
        </span>
        <h3 className="mt-2 font-monroe text-[18px] text-[#EAEAEA] font-normal">
          Time, in context
        </h3>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        {visibleFacts.map((fact, index) => (
          <div
            key={index}
            className="p-4 rounded-xl border border-[#1F1F1F] bg-[#111111]/30 flex flex-col justify-between"
          >
            <span className="font-jetbrains text-[10px] uppercase tracking-[0.1em] text-[#7F7F7F]">
              {fact.label} {fact.isApprox ? "(approx.)" : ""}
            </span>
            <span className="mt-3 font-monroe text-[20px] md:text-[24px] font-light text-[#EAEAEA]">
              {fact.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-start">
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#2CFF05] hover:underline"
        >
          {showAll ? "Show Less" : "Show More Metrics"}
        </button>
      </div>
    </div>
  );
}
