import React, { useState } from "react";
import InlineEditable from "./InlineEditable";
import { UserProfile, TimelineMode, StorageMode } from "@/lib/life-in-dots/types";
import { LIFE_EXPECTANCY_REFERENCE } from "@/lib/life-in-dots/life-expectancy";
import { calculateAge, parseDateOnly } from "@/lib/life-in-dots/calculations";
import { IconSettings, IconX } from "@tabler/icons-react";

interface SettingsPanelProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  compact?: boolean;
}

export default function SettingsPanel({
  profile,
  onUpdateProfile,
  compact = false,
}: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const today = new Date();
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let currentAge = 0;
  try {
    const birthDate = parseDateOnly(profile.birthday);
    currentAge = calculateAge(birthDate, today);
  } catch {
    // Ignore
  }

  const handleSaveBirthday = (val: string) => {
    try {
      const birthDate = parseDateOnly(val);
      if (birthDate > todayDateOnly) return false;
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
    if (isNaN(age) || age < currentAge || age > 120) return false;
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

  const handleStorageModeChange = (mode: StorageMode) => {
    onUpdateProfile({ storageMode: mode });
  };

  const validateBirthday = (val: string): string | null => {
    if (!val) return "Birthday is required";
    const d = parseDateOnly(val);
    if (isNaN(d.getTime())) return "Invalid date";
    if (d > todayDateOnly) return "Birthday cannot be in the future";
    return null;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={
          compact
            ? "inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#1F1F1F] bg-[#111111]/50 text-[#7F7F7F] transition-all hover:border-[#2CFF05]/50 hover:text-[#2CFF05] focus:outline-none focus:ring-1 focus:ring-[#2CFF05]/60"
            : "flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1F1F1F] bg-[#111111]/30 hover:border-[#2CFF05]/40 text-[#9A9A9A] hover:text-[#EAEAEA] font-jetbrains text-[11px] uppercase tracking-[0.08em] transition-all"
        }
        aria-label="Edit timeline settings"
      >
        <IconSettings size={14} />
        {!compact && <span>Settings</span>}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[min(320px,calc(100vw-2rem))] bg-[#111111] border border-[#1F1F1F] rounded-xl p-5 shadow-2xl z-40 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex justify-between items-center pb-2 border-b border-[#1F1F1F]">
            <h4 className="font-monroe text-[14px] text-[#EAEAEA] font-medium">Settings</h4>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#7F7F7F] hover:text-[#EAEAEA] transition-colors p-1"
            >
              <IconX size={14} />
            </button>
          </div>

          {/* Profile Name Edit */}
          <div className="space-y-1 font-monroe text-[13px] text-[#9A9A9A]">
            <span className="block font-jetbrains text-[10px] uppercase text-[#7F7F7F]">Your Name</span>
            <div className="pt-1">
              <InlineEditable
                value={profile.name || "Add your name"}
                type="text"
                label="Name"
                onSave={handleSaveName}
                validate={(v) => v.length > 20 ? "Under 20 chars" : null}
              />
            </div>
          </div>

          {/* Birthday Edit */}
          <div className="space-y-1 font-monroe text-[13px] text-[#9A9A9A]">
            <span className="block font-jetbrains text-[10px] uppercase text-[#7F7F7F]">Birthday</span>
            <div className="pt-1">
              <InlineEditable
                value={profile.birthday}
                type="date"
                label="Birthday"
                onSave={handleSaveBirthday}
                validate={validateBirthday}
              />
            </div>
          </div>

          {/* Target Age Preset Selector */}
          <div className="space-y-1 font-monroe text-[13px] text-[#9A9A9A]">
            <span className="block font-jetbrains text-[10px] uppercase text-[#7F7F7F]">Timeline age limit</span>
            <div className="pt-1 flex flex-wrap gap-1.5 text-[10px] font-jetbrains">
              <button
                type="button"
                onClick={() => handleSelectMode("default")}
                className={`px-2 py-1 rounded border transition-colors ${
                  profile.timelineMode === "default"
                    ? "border-[#2CFF05] text-[#2CFF05]"
                    : "border-[#1F1F1F] text-[#7F7F7F] hover:border-[#9A9A9A]"
                }`}
              >
                90
              </button>
              <button
                type="button"
                onClick={() => handleSelectMode("expectancy")}
                className={`px-2 py-1 rounded border transition-colors ${
                  profile.timelineMode === "expectancy"
                    ? "border-[#2CFF05] text-[#2CFF05]"
                    : "border-[#1F1F1F] text-[#7F7F7F] hover:border-[#9A9A9A]"
                }`}
              >
                Global average
              </button>
              <button
                type="button"
                onClick={() => handleSelectMode("custom")}
                className={`px-2 py-1 rounded border transition-colors ${
                  profile.timelineMode === "custom"
                    ? "border-[#2CFF05] text-[#2CFF05]"
                    : "border-[#1F1F1F] text-[#7F7F7F] hover:border-[#9A9A9A]"
                }`}
              >
                Custom
              </button>
            </div>
            
            {profile.timelineMode === "custom" && (
              <div className="pt-2 flex items-baseline gap-1">
                <span>Age limit:</span>
                <InlineEditable
                  value={String(profile.targetAge)}
                  type="number"
                  label="Target Age"
                  min={currentAge + 1}
                  max={120}
                  onSave={handleSaveTargetAge}
                  validate={(v) => {
                    const val = Number(v);
                    if (isNaN(val)) return "Number required";
                    if (val <= currentAge) return `Must be > ${currentAge}`;
                    if (val > 120) return "Max 120";
                    return null;
                  }}
                />
              </div>
            )}
          </div>

          {/* Privacy/Session Mode Selector */}
          <div className="space-y-1.5 font-monroe text-[13px] text-[#9A9A9A] pt-2 border-t border-[#1F1F1F]">
            <span className="block font-jetbrains text-[10px] uppercase text-[#7F7F7F]">Device Storage</span>
            <div className="space-y-1">
              <label className="flex items-center gap-2 cursor-pointer font-jetbrains text-[11px]">
                <input
                  type="radio"
                  name="storageMode"
                  checked={profile.storageMode === "persistent"}
                  onChange={() => handleStorageModeChange("persistent")}
                  className="accent-[#2CFF05]"
                />
                <span>Remember on this device</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-jetbrains text-[11px]">
                <input
                  type="radio"
                  name="storageMode"
                  checked={profile.storageMode === "session"}
                  onChange={() => handleStorageModeChange("session")}
                  className="accent-[#2CFF05]"
                />
                <span>Forget when this tab closes</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
