import React from "react";
import InlineEditable from "./InlineEditable";
import { UserProfile, TimelineMode } from "@/lib/life-in-dots/types";
import { LIFE_EXPECTANCY_REFERENCE } from "@/lib/life-in-dots/life-expectancy";
import { calculateAge, parseDateOnly } from "@/lib/life-in-dots/calculations";

interface ProfileIntroProps {
  profile: UserProfile | null;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onConfirm: () => void;
}

export default function ProfileIntro({
  profile,
  onUpdateProfile,
  onConfirm,
}: ProfileIntroProps) {
  // Temporary local values for onboarding if profile is null
  const name = profile?.name || "";
  const birthday = profile?.birthday || "";
  const targetAge = profile?.targetAge || 90;
  const timelineMode = profile?.timelineMode || "default";

  const today = new Date();
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  // Calculate current age if birthday exists
  let currentAge = 0;
  let birthdayInPast = false;
    if (birthday) {
    try {
      const birthDate = parseDateOnly(birthday);
      currentAge = calculateAge(birthDate, today);
      birthdayInPast = birthDate <= todayDateOnly;
    } catch {
      // Ignore invalid date formats
    }
  }

  const handleSaveBirthday = (val: string) => {
    try {
      const birthDate = parseDateOnly(val);
      if (birthDate > todayDateOnly) {
        return false;
      }
      onUpdateProfile({ birthday: val });
      return true;
    } catch {
      return false;
    }
  };

  const handleSaveName = (val: string) => {
    onUpdateProfile({ name: val || undefined });
    return true;
  };

  const handleSaveTargetAge = (val: string) => {
    const age = Number(val);
    if (isNaN(age) || age < currentAge || age > 120) {
      return false;
    }
    onUpdateProfile({ 
      targetAge: age,
      timelineMode: age === 90 ? "default" : "custom"
    });
    return true;
  };

  const handleSelectMode = (mode: TimelineMode) => {
    if (mode === "default") {
      onUpdateProfile({ timelineMode: "default", targetAge: 90 });
    } else if (mode === "expectancy") {
      onUpdateProfile({ 
        timelineMode: "expectancy", 
        targetAge: Math.ceil(LIFE_EXPECTANCY_REFERENCE.value) 
      });
    } else {
      onUpdateProfile({ timelineMode: "custom" });
    }
  };

  // Check if birthday exceeds target age
  const isTargetAgeTooLow = birthday && currentAge >= targetAge;

  const validateBirthday = (val: string): string | null => {
    if (!val) return "Birthday is required";
    const d = parseDateOnly(val);
    if (isNaN(d.getTime())) return "Invalid date format";
    if (d > todayDateOnly) return "Birthday cannot be in the future";
    return null;
  };

  return (
    <div className="max-w-[720px] mx-auto px-4 py-12 md:py-24 text-center flex flex-col items-center">
      <h1 className="font-monroe text-[36px] md:text-[54px] font-light leading-[1.15] text-[#EAEAEA]">
        See your life in dots
      </h1>
      
      <p className="mt-4 md:mt-6 font-monroe text-[15px] md:text-[18px] text-[#9A9A9A] leading-[1.6] max-w-[560px]">
        A gentle look at the time you have lived, the time that may be ahead, and the day you have right now.
      </p>

      <div className="mt-12 md:mt-16 text-left space-y-6 md:space-y-8 font-monroe text-[18px] md:text-[24px] text-[#9A9A9A] leading-[1.8] max-w-xl">
        {/* Name Question */}
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span>You can call me</span>
          <InlineEditable
            value={name || "Add your name"}
            type="text"
            label="Name"
            onSave={handleSaveName}
            validate={(v) => v.length > 20 ? "Name must be under 20 chars" : null}
          />
        </p>

        {/* Birthday Question */}
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span>I was born on</span>
          <InlineEditable
            value={birthday || "Select your birthday"}
            type="date"
            label="Birthday"
            onSave={handleSaveBirthday}
            validate={validateBirthday}
          />
        </p>

        {/* Target Age Question */}
        {birthday && birthdayInPast && (
          <div className="space-y-4">
            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span>Show my possible timeline to age</span>
              <InlineEditable
                value={String(targetAge)}
                type="number"
                label="Target Age"
                min={currentAge + 1}
                max={120}
                onSave={handleSaveTargetAge}
                validate={(v) => {
                  const val = Number(v);
                  if (isNaN(val)) return "Invalid age";
                  if (val <= currentAge) return `Must be greater than current age (${currentAge})`;
                  if (val > 120) return "Max age is 120";
                  return null;
                }}
              />
            </p>

            {/* Timeline Presets */}
            <div className="flex flex-wrap gap-2 text-[12px] font-jetbrains pt-2">
              <button
                type="button"
                onClick={() => handleSelectMode("default")}
                className={`px-3 py-1.5 rounded-full border transition-all ${
                  timelineMode === "default"
                    ? "border-[#2CFF05] text-[#2CFF05] bg-[#2CFF05]/5"
                    : "border-[#1F1F1F] text-[#9A9A9A] hover:border-[#EAEAEA] hover:text-[#EAEAEA]"
                }`}
              >
                90 Years (Default)
              </button>
              <button
                type="button"
                onClick={() => handleSelectMode("expectancy")}
                className={`px-3 py-1.5 rounded-full border transition-all ${
                  timelineMode === "expectancy"
                    ? "border-[#2CFF05] text-[#2CFF05] bg-[#2CFF05]/5"
                    : "border-[#1F1F1F] text-[#9A9A9A] hover:border-[#EAEAEA] hover:text-[#EAEAEA]"
                }`}
              >
                Global average ({LIFE_EXPECTANCY_REFERENCE.value} years)
              </button>
              {timelineMode === "expectancy" && (
                <div className="w-full text-[11px] text-[#7F7F7F] mt-1 leading-normal">
                  {LIFE_EXPECTANCY_REFERENCE.label} ({LIFE_EXPECTANCY_REFERENCE.year}). This is a population average at birth, not a prediction about you.{" "}
                  <a
                    href={LIFE_EXPECTANCY_REFERENCE.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-[#2CFF05]"
                  >
                    Source: {LIFE_EXPECTANCY_REFERENCE.sourceName}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Target Age Warning */}
      {isTargetAgeTooLow && (
        <div className="mt-8 p-4 rounded-xl border border-[#2CFF05]/30 bg-[#2CFF05]/5 text-left max-w-xl">
          <p className="font-monroe text-[14px] text-[#EAEAEA]">
            You have already lived beyond this population average. Choose a longer personal timeline to explore the days ahead.
          </p>
          <button
            type="button"
            onClick={() => onUpdateProfile({ targetAge: 90, timelineMode: "default" })}
            className="mt-3 font-jetbrains text-[12px] text-[#2CFF05] hover:underline"
          >
            Use 90 years
          </button>
        </div>
      )}

      {/* Explore Button */}
      {birthday && birthdayInPast && !isTargetAgeTooLow && (
        <button
          type="button"
          onClick={onConfirm}
          className="signal-button mt-16 px-8 py-3.5 rounded-full font-jetbrains text-[13px] uppercase tracking-[0.16em] transition-all hover:scale-105"
        >
          Explore My Timeline →
        </button>
      )}
    </div>
  );
}
