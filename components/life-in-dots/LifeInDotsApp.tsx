"use client";

import React, { useState, useEffect } from "react";
import { UserProfile, UserPreferences, ViewUnit } from "@/lib/life-in-dots/types";
import { loadProfile, saveProfile, loadPreferences, savePreferences } from "@/lib/life-in-dots/storage";
import { performLifeCalculations, parseDateOnly } from "@/lib/life-in-dots/calculations";
import ProfileIntro from "./ProfileIntro";
import LifeSummary from "./LifeSummary";
import UnitTabs from "./UnitTabs";
import DotLegend from "./DotLegend";
import YearsDots from "./YearsDots";
import MonthsDots from "./MonthsDots";
import DaysDots from "./DaysDots";
import HoursDots from "./HoursDots";
import TodayPanel from "./TodayPanel";
import DailyIntention from "./DailyIntention";
import LifeFacts from "./LifeFacts";
import SleepEstimate from "./SleepEstimate";
import PrivacyPanel from "./PrivacyPanel";
import SettingsPanel from "./SettingsPanel";
import ShareCardButton from "./ShareCardButton";
import { LIFE_EXPECTANCY_REFERENCE } from "@/lib/life-in-dots/life-expectancy";

export default function LifeInDotsApp() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({ selectedUnit: "Days" });
  const [time, setTime] = useState<Date | null>(null);

  // Sync mount state and load storage
  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const loadedProfile = loadProfile();
    if (loadedProfile) {
      setProfile(loadedProfile);
    }
    const loadedPrefs = loadPreferences();
    setPreferences(loadedPrefs);

    // Keep clock updated for minute-level accuracy
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    let currentProfile = profile;
    if (!currentProfile) {
      // Initialize a default profile if onboarding is starting
      currentProfile = {
        birthday: "",
        targetAge: 90,
        timelineMode: "default",
        sleepHours: 8,
        storageMode: "persistent",
      };
    }
    const newProfile = { ...currentProfile, ...updated } as UserProfile;
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  const handleUnitChange = (unit: ViewUnit) => {
    const newPrefs = { ...preferences, selectedUnit: unit };
    setPreferences(newPrefs);
    savePreferences(newPrefs);
  };

  const handleResetData = () => {
    setProfile(null);
  };

  let birthDate: Date | null = null;
  if (profile?.birthday) {
    try {
      birthDate = parseDateOnly(profile.birthday);
    } catch {
      birthDate = null;
    }
  }

  // Greeting selector based on time of day
  let greetingText = "This is one of your days";
  if (time && profile?.name) {
    const hour = time.getHours();
    if (hour < 12) greetingText = `Good morning, ${profile.name}`;
    else if (hour < 17) greetingText = `Good afternoon, ${profile.name}`;
    else greetingText = `Good evening, ${profile.name}`;
  }

  // Perform life calculations
  const calcs =
    birthDate && time && profile
      ? performLifeCalculations(birthDate, time, profile.targetAge)
      : null;

  if (!mounted || !time) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-jetbrains text-[12px] text-[#7F7F7F] uppercase tracking-[0.16em]">
        Loading your timeline...
      </div>
    );
  }

  // If birthday is missing, show onboarding
  if (!profile?.birthday || !birthDate) {
    return (
      <ProfileIntro
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onConfirm={() => {
          if (profile?.birthday) {
            // Mark complete by refreshing profile state or checking birthday
          }
        }}
      />
    );
  }

  // Calculate milestone presentation text
  const milestoneText = calcs ? (
    calcs.daysToNextMilestone === 0 ? (
      <>
        Today is your{" "}
        <span className="text-[#2CFF05] font-semibold">
          {calcs.nextMilestone.toLocaleString()}th
        </span>{" "}
        day alive!
      </>
    ) : (
      <>
        Your next major milestone—your{" "}
        <span className="text-[#2CFF05] font-semibold">
          {calcs.nextMilestone.toLocaleString()}th day
        </span>
        —is in <span className="text-[#2CFF05] font-semibold">{calcs.daysToNextMilestone} days</span> (
        {calcs.nextMilestoneDate.toLocaleDateString(undefined, {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
        ).
      </>
    )
  ) : null;

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-8 space-y-8">
      
      {/* Top Greeting & Controls */}
      <div className="border-b border-[#1F1F1F] pb-5">
        <div className="space-y-1">
          <span className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]" suppressHydrationWarning>
            {time.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <h1 className="font-monroe text-[28px] md:text-[38px] font-light text-[#EAEAEA]">
            {greetingText}
          </h1>
        </div>
      </div>

      {/* Main life stats summary */}
      {calcs && (
        <LifeSummary
          profile={profile}
          calcs={calcs}
          settingsControl={
            <SettingsPanel
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              compact
            />
          }
          shareControl={
            <ShareCardButton profile={profile} calcs={calcs} date={time} />
          }
        />
      )}

      {/* Visualizations Segment */}
      <div className="space-y-3">
        <UnitTabs selected={preferences.selectedUnit} onChange={handleUnitChange} />
        <DotLegend unit={preferences.selectedUnit} />
        
        {/* Render correct grid based on selection */}
        <div>
          {preferences.selectedUnit === "Years" && calcs && (
            <YearsDots profile={profile} calcs={calcs} />
          )}
          {preferences.selectedUnit === "Months" && calcs && (
            <MonthsDots profile={profile} calcs={calcs} birthDate={birthDate} />
          )}
          {preferences.selectedUnit === "Days" && calcs && (
            <DaysDots profile={profile} calcs={calcs} birthDate={birthDate} />
          )}
          {preferences.selectedUnit === "Hours" && calcs && (
            <HoursDots profile={profile} calcs={calcs} />
          )}
        </div>
      </div>

      {/* Today Panel details */}
      {calcs && <TodayPanel calcs={calcs} />}

      {/* Daily Intention editor */}
      <DailyIntention />

      {/* Sleep stats estimate */}
      {calcs && (
        <SleepEstimate
          profile={profile}
          calcs={calcs}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {/* Facts grid */}
      {calcs && <LifeFacts calcs={calcs} />}

      {/* Major Milestone alert */}
      {milestoneText && (
        <div className="w-full py-8 border-b border-[#1F1F1F] space-y-3">
          <span className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">
            Milestones
          </span>
          <p className="font-monroe text-[15px] md:text-[18px] text-[#EAEAEA] leading-relaxed">
            {milestoneText}
          </p>
        </div>
      )}

      {/* About Section */}
      <div className="w-full py-8 border-b border-[#1F1F1F] space-y-4" id="about-section">
        <h3 className="font-monroe text-[18px] text-[#EAEAEA] font-normal">
          This is not a death clock
        </h3>
        <p className="font-monroe text-[14px] text-[#9A9A9A] leading-relaxed max-w-2xl">
          Life in Dots does not know how long anyone will live. The future timeline is only a reference chosen by you. The purpose is not to watch time disappear. It is to notice the time you already had, appreciate the time that may be ahead, and use today a little more intentionally.
        </p>
        <p className="font-monroe text-[13px] text-[#7F7F7F] italic max-w-2xl">
          Life expectancy is a statistical population measure. It cannot tell anyone how long they will live.
        </p>
      </div>

      {/* Methodology Section */}
      <div className="w-full py-8 border-b border-[#1F1F1F] space-y-4" id="methodology-section">
        <h3 className="font-monroe text-[18px] text-[#EAEAEA] font-normal">
          Source and methodology
        </h3>
        <p className="font-monroe text-[14px] text-[#9A9A9A] leading-relaxed max-w-2xl">
          The population expectancy metric references the{" "}
          <a
            href={LIFE_EXPECTANCY_REFERENCE.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[#2CFF05] underline hover:opacity-85"
          >
            {LIFE_EXPECTANCY_REFERENCE.sourceName} ({LIFE_EXPECTANCY_REFERENCE.year})
          </a>{" "}
          data of {LIFE_EXPECTANCY_REFERENCE.value} years as a general demographic benchmark. All calculations are executed completely inside the client-side environment utilizing standard Gregorian calendar formulas.
        </p>
      </div>

      {/* Chrome Extension Promo */}
      <div className="w-full py-8 border-b border-[#1F1F1F] space-y-4" id="chrome-extension">
        <h3 className="font-monroe text-[18px] text-[#EAEAEA] font-normal">
          Add to Chrome
        </h3>
        <p className="font-monroe text-[14px] text-[#9A9A9A] leading-relaxed max-w-2xl">
          You can replace your browser&apos;s New Tab page with Life in Dots. The extension works fully offline and preserves your privacy, storing data locally inside Chrome secure storage.
        </p>
        <p className="font-jetbrains text-[12px] text-[#7F7F7F]">
          Installation instructions are available in the project repository under{" "}
          <code className="text-[#EAEAEA] bg-[#111111] px-1.5 py-0.5 rounded border border-[#1F1F1F]">
            chrome-extension/life-in-dots/
          </code>
        </p>
      </div>

      {/* Privacy Controls Panel */}
      <PrivacyPanel onReset={handleResetData} />
      
    </div>
  );
}
