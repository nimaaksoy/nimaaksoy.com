import { promises as fs } from "fs";
import path from "path";
import type { RadarDay } from "@/lib/radar-shared";

export type { Locale, RadarDay, RadarItem } from "@/lib/radar-shared";
export {
  absoluteDayUrl,
  copyForLocale,
  dayPath,
  formatRadarDate,
  indexPath,
} from "@/lib/radar-shared";

const RADAR_DIR = path.join(process.cwd(), "content", "radar");
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isRadarDay(value: unknown): value is RadarDay {
  if (!value || typeof value !== "object") return false;
  const day = value as RadarDay;
  return (
    typeof day.date === "string" &&
    Array.isArray(day.items) &&
    day.items.length > 0 &&
    day.items.length <= 5 &&
    !!day.social?.x?.en &&
    !!day.social?.x?.fa &&
    !!day.social?.linkedin?.en &&
    !!day.social?.linkedin?.fa
  );
}

export async function getAllRadarDates(): Promise<string[]> {
  try {
    const files = await fs.readdir(RADAR_DIR);
    return files
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.replace(/\.json$/, ""))
      .filter((date) => DATE_RE.test(date))
      .sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
  } catch {
    return [];
  }
}

export async function getRadarDay(date: string): Promise<RadarDay | null> {
  if (!DATE_RE.test(date)) return null;

  const filePath = path.join(RADAR_DIR, `${date}.json`);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (!isRadarDay(parsed)) return null;
    if (parsed.date !== date) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function getAllRadarDays(): Promise<RadarDay[]> {
  const dates = await getAllRadarDates();
  const days = await Promise.all(dates.map((date) => getRadarDay(date)));
  return days.filter((day): day is RadarDay => day !== null);
}
