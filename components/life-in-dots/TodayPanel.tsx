import React, { useMemo } from "react";
import { LifeCalculations, isLeapYear } from "@/lib/life-in-dots/calculations";

interface TodayPanelProps {
  calcs: LifeCalculations;
}

export default function TodayPanel({ calcs }: TodayPanelProps) {
  const today = useMemo(() => new Date(), []);

  // Format today's date
  const formattedDate = useMemo(() => {
    return today.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [today]);

  const yearStats = useMemo(() => {
    const currentYear = today.getFullYear();
    const start = new Date(currentYear, 0, 0);
    const diff = today.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const janFirst = new Date(currentYear, 0, 1);
    const days = Math.floor((today.getTime() - janFirst.getTime()) / oneDay);
    const weekNumber = Math.ceil((days + janFirst.getDay() + 1) / 7);
    
    const totalDays = isLeapYear(currentYear) ? 366 : 365;
    const percentPassed = ((dayOfYear / totalDays) * 100).toFixed(1);

    return {
      dayOfYear,
      weekNumber,
      percentPassed,
      year: currentYear,
    };
  }, [today]);

  // Today's hours list for standard today block (24 dots)
  const currentHour = today.getHours();
  const hourDots = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="w-full py-8 border-b border-[#1F1F1F] space-y-6">
      <div className="flex flex-col">
        <span className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">
          Today
        </span>
        <h2 className="mt-2 font-monroe text-[24px] md:text-[32px] font-light text-[#EAEAEA] leading-tight">
          {formattedDate}
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3 font-monroe text-[14px] text-[#9A9A9A]">
        {/* Calendar Stats */}
        <div className="space-y-1">
          <p>
            Day number in year {yearStats.year}:{" "}
            <span className="text-[#EAEAEA] font-semibold">{yearStats.dayOfYear}</span>
          </p>
          <p>
            Week number:{" "}
            <span className="text-[#EAEAEA] font-semibold">{yearStats.weekNumber}</span>
          </p>
          <p>
            Percentage of year passed:{" "}
            <span className="text-[#2CFF05] font-semibold">{yearStats.percentPassed}%</span>
          </p>
        </div>

        {/* Birthday Countdown */}
        <div className="space-y-1">
          <p>
            Days until your next birthday:{" "}
            <span className="text-[#2CFF05] font-semibold">{calcs.daysToNextBirthday}</span>
          </p>
          <p className="text-[12px] text-[#7F7F7F] leading-normal">
            Observed on {calcs.nextBirthdayDate.toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Quick Hour visualization */}
        <div className="space-y-2">
          <p className="text-[12px] font-jetbrains text-[#7F7F7F]">
            Today&apos;s hour progress:
          </p>
          <div className="flex flex-wrap gap-1.5 max-w-[200px]">
            {hourDots.map((hour) => {
              const isLived = hour < currentHour;
              const isCurrent = hour === currentHour;
              
              let dotClass = "";

              if (isCurrent) {
                dotClass = "bg-[#2CFF05] animate-pulse";
              } else if (isLived) {
                dotClass = "bg-[#EAEAEA]";
              } else {
                dotClass = "border border-[#7F7F7F]/40 bg-transparent";
              }

              return (
                <span
                  key={hour}
                  title={hour + ":00"}
                  className={`w-2.5 h-2.5 rounded-full block ${dotClass}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
