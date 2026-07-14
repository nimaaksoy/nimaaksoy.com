export type TimelineMode = "default" | "expectancy" | "custom";
export type StorageMode = "persistent" | "session";

export interface UserProfile {
  name?: string;
  birthday: string; // YYYY-MM-DD
  targetAge: number; // e.g. 90
  timelineMode: TimelineMode;
  sleepHours: number; // default 8, range 4-12
  storageMode: StorageMode; // default "persistent"
}

export type ViewUnit = "Years" | "Months" | "Days" | "Hours";

export interface UserPreferences {
  selectedUnit: ViewUnit;
}

export interface DailyIntention {
  date: string; // YYYY-MM-DD
  text: string;
}

export interface LifeExpectancyInfo {
  value: number;
  year: number;
  label: string;
  sourceName: string;
  sourceUrl: string;
  lastReviewed: string;
}
