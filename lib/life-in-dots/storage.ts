import { UserProfile, UserPreferences } from "./types";

const PREFIX = "life-in-dots:";
const KEYS = {
  PROFILE: `${PREFIX}profile`,
  PREFERENCES: `${PREFIX}preferences`,
  INTENTIONS: `${PREFIX}intentions`,
};

function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Checks if browser storage is available.
 */
function isStorageAvailable(type: "localStorage" | "sessionStorage"): boolean {
  if (!isClient()) return false;
  try {
    const storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads the user profile. Check sessionStorage first, then localStorage.
 */
export function loadProfile(): UserProfile | null {
  if (!isClient()) return null;

  try {
    if (isStorageAvailable("sessionStorage")) {
      const sessVal = sessionStorage.getItem(KEYS.PROFILE);
      if (sessVal) {
        return JSON.parse(sessVal);
      }
    }

    if (isStorageAvailable("localStorage")) {
      const localVal = localStorage.getItem(KEYS.PROFILE);
      if (localVal) {
        return JSON.parse(localVal);
      }
    }
  } catch (e) {
    console.error("Error reading life-in-dots profile from storage:", e);
  }

  return null;
}

/**
 * Saves the user profile. Based on storageMode, saves in localStorage or sessionStorage.
 * If storageMode is "session", deletes from localStorage.
 * If storageMode is "persistent", deletes from sessionStorage.
 */
export function saveProfile(profile: UserProfile): void {
  if (!isClient()) return;

  try {
    const valStr = JSON.stringify(profile);

    if (profile.storageMode === "session") {
      if (isStorageAvailable("sessionStorage")) {
        sessionStorage.setItem(KEYS.PROFILE, valStr);
      }
      if (isStorageAvailable("localStorage")) {
        localStorage.removeItem(KEYS.PROFILE);
      }
    } else {
      if (isStorageAvailable("localStorage")) {
        localStorage.setItem(KEYS.PROFILE, valStr);
      }
      if (isStorageAvailable("sessionStorage")) {
        sessionStorage.removeItem(KEYS.PROFILE);
      }
    }
  } catch (e) {
    console.error("Error writing life-in-dots profile to storage:", e);
  }
}

/**
 * Loads preferences from localStorage.
 */
export function loadPreferences(): UserPreferences {
  const defaultPrefs: UserPreferences = { selectedUnit: "Days" };
  if (!isClient() || !isStorageAvailable("localStorage")) return defaultPrefs;

  try {
    const val = localStorage.getItem(KEYS.PREFERENCES);
    if (val) {
      return JSON.parse(val);
    }
  } catch (e) {
    console.error("Error reading preferences:", e);
  }

  return defaultPrefs;
}

/**
 * Saves preferences in localStorage.
 */
export function savePreferences(prefs: UserPreferences): void {
  if (!isClient() || !isStorageAvailable("localStorage")) return;

  try {
    localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (e) {
    console.error("Error writing preferences:", e);
  }
}

/**
 * Loads daily intentions from localStorage (or returns empty record).
 * Maps YYYY-MM-DD -> intention text.
 */
export function loadIntentions(): Record<string, string> {
  if (!isClient() || !isStorageAvailable("localStorage")) return {};

  try {
    const val = localStorage.getItem(KEYS.INTENTIONS);
    if (val) {
      return JSON.parse(val);
    }
  } catch (e) {
    console.error("Error reading intentions:", e);
  }

  return {};
}

/**
 * Saves daily intentions in localStorage.
 */
export function saveIntentions(intentions: Record<string, string>): void {
  if (!isClient() || !isStorageAvailable("localStorage")) return;

  try {
    localStorage.setItem(KEYS.INTENTIONS, JSON.stringify(intentions));
  } catch (e) {
    console.error("Error writing intentions:", e);
  }
}

/**
 * Clears only Life in Dots keys from both storage locations.
 */
export function clearAllLifeInDotsData(): void {
  if (!isClient()) return;

  try {
    if (isStorageAvailable("localStorage")) {
      localStorage.removeItem(KEYS.PROFILE);
      localStorage.removeItem(KEYS.PREFERENCES);
      localStorage.removeItem(KEYS.INTENTIONS);
    }
    if (isStorageAvailable("sessionStorage")) {
      sessionStorage.removeItem(KEYS.PROFILE);
    }
  } catch (e) {
    console.error("Error clearing life-in-dots data:", e);
  }
}
