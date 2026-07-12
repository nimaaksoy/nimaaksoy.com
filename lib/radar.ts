import { promises as fs } from "fs";
import path from "path";
import type { RadarDay, RadarItem } from "@/lib/radar-shared";

export type { Locale, RadarDay, RadarItem } from "@/lib/radar-shared";
export {
  absoluteDayUrl,
  absoluteItemUrl,
  copyForLocale,
  dayPath,
  formatRadarDate,
  indexPath,
  itemPath,
} from "@/lib/radar-shared";

const RADAR_DIR = path.join(process.cwd(), "content", "radar");
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isLocalized(value: unknown): value is { en: string; fa: string } {
  if (!value || typeof value !== "object") return false;
  const text = value as { en?: unknown; fa?: unknown };
  return (
    typeof text.en === "string" &&
    text.en.trim().length > 0 &&
    typeof text.fa === "string" &&
    text.fa.trim().length > 0
  );
}

function isRadarItem(value: unknown): value is RadarItem {
  if (!value || typeof value !== "object") return false;
  const item = value as RadarItem;
  return (
    typeof item.slug === "string" &&
    item.slug.length > 0 &&
    typeof item.name === "string" &&
    typeof item.url === "string" &&
    isLocalized(item.take) &&
    isLocalized(item.why)
  );
}

function isRadarDay(value: unknown): value is RadarDay {
  if (!value || typeof value !== "object") return false;
  const day = value as RadarDay;
  return (
    typeof day.date === "string" &&
    Array.isArray(day.items) &&
    day.items.length > 0 &&
    day.items.length <= 5 &&
    day.items.every(isRadarItem)
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

export async function getRadarItem(
  date: string,
  slug: string
): Promise<{ day: RadarDay; item: RadarItem } | null> {
  const day = await getRadarDay(date);
  if (!day) return null;
  const item = day.items.find((entry) => entry.slug === slug);
  if (!item) return null;
  return { day, item };
}

export async function getAllRadarDays(): Promise<RadarDay[]> {
  const dates = await getAllRadarDates();
  const days = await Promise.all(dates.map((date) => getRadarDay(date)));
  return days.filter((day): day is RadarDay => day !== null);
}

export async function getAllRadarItemParams(): Promise<
  { date: string; slug: string }[]
> {
  const days = await getAllRadarDays();
  return days.flatMap((day) =>
    day.items.map((item) => ({ date: day.date, slug: item.slug }))
  );
}
