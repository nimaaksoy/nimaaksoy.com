import React, { useState, useEffect, useRef, useMemo } from "react";
import { LifeCalculations, getBirthdayInYear, getDaysBetween } from "@/lib/life-in-dots/calculations";
import { UserProfile } from "@/lib/life-in-dots/types";

interface DaysDotsProps {
  profile: UserProfile;
  calcs: LifeCalculations;
  birthDate: Date;
}

interface YearLifeInfo {
  yearIndex: number;
  startDate: Date;
  endDate: Date;
  daysCount: number;
  livedDaysCount: number;
  isCurrent: boolean;
}

export default function DaysDots({ profile, calcs, birthDate }: DaysDotsProps) {
  const [viewMode, setViewMode] = useState<"current-year" | "overview">("current-year");
  const [canvasWidth, setCanvasWidth] = useState(300);
  const [hoveredDot, setHoveredDot] = useState<{
    date: Date;
    dayOfLife: number;
    age: number;
    isToday: boolean;
    isLived: boolean;
    x: number;
    y: number;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const targetAge = profile.targetAge;
  const today = useMemo(() => new Date(), []);

  // Precompute years information
  const yearsList = useMemo(() => {
    const list: YearLifeInfo[] = [];
    for (let y = 0; y < targetAge; y++) {
      const startDate = getBirthdayInYear(birthDate, birthDate.getFullYear() + y);
      const endDate = getBirthdayInYear(birthDate, birthDate.getFullYear() + y + 1);
      const daysCount = getDaysBetween(startDate, endDate);
      
      let livedDaysCount = 0;
      let isCurrent = false;

      if (today < startDate) {
        livedDaysCount = 0;
      } else if (today >= endDate) {
        livedDaysCount = daysCount;
      } else {
        livedDaysCount = getDaysBetween(startDate, today) + 1;
        isCurrent = true;
      }

      list.push({
        yearIndex: y,
        startDate,
        endDate,
        daysCount,
        livedDaysCount,
        isCurrent,
      });
    }
    return list;
  }, [birthDate, targetAge, today]);

  // Current year detail days
  const currentYearInfo = useMemo(() => {
    return yearsList.find((y) => y.isCurrent) || yearsList[0];
  }, [yearsList]);

  // Draw full timeline canvas
  useEffect(() => {
    if (viewMode !== "overview" || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get parent width for responsiveness
    const rect = containerRef.current.getBoundingClientRect();
    const width = Math.max(300, rect.width);
    setCanvasWidth(width);
    
    // Grid settings
    const columns = 366; // max days in a year
    const rows = targetAge;
    
    // Gaps and dot size
    const dotSize = Math.max(1, (width - columns * 0.8) / columns);
    const gapX = 0.8;
    const gapY = 2;
    
    // Calculate total height needed
    const rowHeight = dotSize + gapY;
    const height = rows * rowHeight;

    // Set canvas sizes with high-DPI scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    yearsList.forEach((yearInfo) => {
      const y = yearInfo.yearIndex * rowHeight;
      
      for (let dayIndex = 0; dayIndex < yearInfo.daysCount; dayIndex++) {
        const x = dayIndex * (dotSize + gapX);
        const isLived = dayIndex < yearInfo.livedDaysCount;
        const isCurrentDay = yearInfo.isCurrent && dayIndex === yearInfo.livedDaysCount - 1;

        if (isCurrentDay) {
          ctx.fillStyle = "#2CFF05"; // accent pulsing color
          ctx.fillRect(x, y, dotSize, dotSize);
        } else if (isLived) {
          ctx.fillStyle = "#EAEAEA"; // completed days
          ctx.fillRect(x, y, dotSize, dotSize);
        } else {
          ctx.strokeStyle = "rgba(127, 127, 127, 0.25)"; // future outlines
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y, dotSize, dotSize);
        }
      }
    });

  }, [viewMode, yearsList, targetAge]);

  // Handle canvas mouse move to trigger tooltips
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const columns = 366;
    const rows = targetAge;

    const width = rect.width;
    const dotSize = Math.max(1, (width - columns * 0.8) / columns);
    const gapX = 0.8;
    const gapY = 2;
    const rowHeight = dotSize + gapY;

    const yearIndex = Math.floor(mouseY / rowHeight);
    const dayIndex = Math.floor(mouseX / (dotSize + gapX));

    if (yearIndex >= 0 && yearIndex < rows && dayIndex >= 0) {
      const yearInfo = yearsList[yearIndex];
      if (dayIndex < yearInfo.daysCount) {
        // Calculate day date
        const dotDate = new Date(yearInfo.startDate);
        dotDate.setDate(yearInfo.startDate.getDate() + dayIndex);

        const isLived = dayIndex < yearInfo.livedDaysCount;
        const isToday = yearInfo.isCurrent && dayIndex === yearInfo.livedDaysCount - 1;

        // Find overall day of life index
        let totalDayOffset = 0;
        for (let i = 0; i < yearIndex; i++) {
          totalDayOffset += yearsList[i].daysCount;
        }
        const dayOfLife = totalDayOffset + dayIndex + 1;

        const parentRect = e.currentTarget.parentElement?.getBoundingClientRect();
        setHoveredDot({
          date: dotDate,
          dayOfLife,
          age: yearIndex,
          isToday,
          isLived,
          x: mouseX,
          y: mouseY + rect.top - (parentRect?.top ?? rect.top),
        });
        return;
      }
    }
    setHoveredDot(null);
  };

  const handleCanvasMouseLeave = () => {
    setHoveredDot(null);
  };

  // Render current year DOM list (7 columns)
  const renderCurrentYearDOM = () => {
    const totalDays = currentYearInfo.daysCount;
    const days = Array.from({ length: totalDays }, (_, i) => i);
    const completedDays = currentYearInfo.livedDaysCount;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-monroe text-[16px] text-[#EAEAEA] font-normal">
            Your Current Year (Age {currentYearInfo.yearIndex})
          </h3>
          <span className="text-[11px] font-jetbrains text-[#7F7F7F]">
            {completedDays} / {totalDays} days completed
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 max-w-[280px]">
          {days.map((dayIndex) => {
            const isLived = dayIndex < completedDays;
            const isToday = currentYearInfo.isCurrent && dayIndex === completedDays - 1;
            
            let dotClass = "";
            let label = "";

            if (isToday) {
              dotClass = "bg-[#2CFF05] animate-pulse";
              label = "Today";
            } else if (isLived) {
              dotClass = "bg-[#EAEAEA]";
              label = `Day ${dayIndex + 1} completed`;
            } else {
              dotClass = "border border-[#7F7F7F]/40 bg-transparent hover:border-[#2CFF05]/60";
              label = `Day ${dayIndex + 1} future`;
            }

            return (
              <div key={dayIndex} className="relative group flex items-center justify-center aspect-square">
                <button
                  type="button"
                  aria-label={label}
                  className={`w-3.5 h-3.5 rounded-full transition-all focus:scale-125 focus:ring-1 focus:ring-[#2CFF05] ${dotClass}`}
                />
                
                {/* DOM Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block group-focus-within:block px-2 py-1 bg-[#111111] border border-[#1F1F1F] text-[#EAEAEA] text-[10px] font-jetbrains rounded whitespace-nowrap z-30 pointer-events-none shadow-lg">
                  Day {dayIndex + 1}
                  {isToday ? " — Today" : isLived ? " — Completed" : " — Future"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Calendar stats */}
        <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-[#1F1F1F] font-monroe text-[13px] text-[#9A9A9A]">
          <div>
            <p>Days lived this year: <span className="text-[#EAEAEA] font-semibold">{currentYearInfo.livedDaysCount}</span></p>
            <p>Days remaining this year: <span className="text-[#EAEAEA] font-semibold">{totalDays - currentYearInfo.livedDaysCount}</span></p>
          </div>
          <div>
            <p>Approx. weekends this year ahead: <span className="text-[#2CFF05] font-semibold">{Math.floor(((totalDays - currentYearInfo.livedDaysCount) / 7) * 2)}</span></p>
            <p>Days until next birthday: <span className="text-[#2CFF05] font-semibold">{calcs.daysToNextBirthday}</span></p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-6 space-y-6" id="panel-days" role="tabpanel" aria-labelledby="tab-days">
      {/* Toggles */}
      <div className="flex items-center gap-4 border-b border-[#1F1F1F] pb-4">
        <button
          type="button"
          onClick={() => setViewMode("current-year")}
          className={`font-jetbrains text-[11px] uppercase tracking-[0.1em] transition-colors ${
            viewMode === "current-year" ? "text-[#2CFF05] font-semibold" : "text-[#7F7F7F] hover:text-[#EAEAEA]"
          }`}
        >
          Current Year Detail
        </button>
        <button
          type="button"
          onClick={() => setViewMode("overview")}
          className={`font-jetbrains text-[11px] uppercase tracking-[0.1em] transition-colors ${
            viewMode === "overview" ? "text-[#2CFF05] font-semibold" : "text-[#7F7F7F] hover:text-[#EAEAEA]"
          }`}
        >
          Full Timeline (Canvas)
        </button>
      </div>

      {viewMode === "current-year" ? (
        renderCurrentYearDOM()
      ) : (
        <div ref={containerRef} className="relative w-full overflow-hidden bg-[#0A0A0A] border border-[#1F1F1F]/40 p-4 rounded-xl">
          <span className="sr-only">
            Visual canvas grid displaying {targetAge} rows of years. Each row has 365 or 366 dots representing calendar days.
          </span>
          <canvas
            ref={canvasRef}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={handleCanvasMouseLeave}
            className="cursor-crosshair block"
          />

          {/* Floating Canvas Tooltip */}
          {hoveredDot && (
            <div
              className="absolute bg-[#111111] border border-[#2CFF05]/40 text-[#EAEAEA] text-[11px] font-jetbrains px-3 py-1.5 rounded-lg shadow-2xl pointer-events-none z-30"
              style={{
                left: `${Math.min(canvasWidth - 160, hoveredDot.x + 12)}px`,
                top: `${hoveredDot.y - 45}px`,
              }}
            >
              <div className="font-semibold">
                {hoveredDot.date.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="text-[10px] text-[#7F7F7F] mt-0.5">
                Day {hoveredDot.dayOfLife.toLocaleString()} of life
              </div>
              <div className="text-[10px] text-[#2CFF05] mt-0.5">
                Age {hoveredDot.age} • {hoveredDot.isToday ? "Today" : hoveredDot.isLived ? "Completed" : "Possible future"}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Narrative facts below */}
      <div className="space-y-2 pt-4 border-t border-[#1F1F1F] font-monroe text-[14px] text-[#9A9A9A] leading-relaxed">
        <p>
          You have lived <span className="text-[#EAEAEA] font-semibold">{calcs.daysLived.toLocaleString()}</span> full days.
        </p>
        <p>
          Your next birthday will be on a{" "}
          <span className="text-[#EAEAEA] font-semibold">
            {calcs.nextBirthdayDate.toLocaleDateString(undefined, { weekday: "long" })}
          </span>
          .
        </p>
        <p>
          You have around <span className="text-[#2CFF05] font-semibold">~{calcs.daysAheadInTimeline.toLocaleString()}</span> days ahead in your timeline.
        </p>
      </div>
    </div>
  );
}
