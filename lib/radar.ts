import { promises as fs } from "fs";
import path from "path";
import type {
  LocalizedText,
  RadarDay,
  RadarItem,
  RadarProject,
  RadarSimilarTool,
} from "@/lib/radar-shared";
import { VERDICT_ORDER } from "@/lib/radar-shared";

export type {
  Locale,
  LocalizedText,
  RadarDay,
  RadarItem,
  RadarProject,
  RadarSimilarTool,
  RadarVerdict,
} from "@/lib/radar-shared";
export {
  absoluteItemUrl,
  copyEn,
  FALLBACK_IMAGE,
  formatRadarDate,
  formatRadarDateLong,
  indexPath,
  itemPath,
  projectImage,
  RADAR_PAGE_SIZE,
  VERDICT_LABELS,
  VERDICT_ORDER,
  withShareUrl,
} from "@/lib/radar-shared";

const RADAR_DIR = path.join(process.cwd(), "content", "radar");
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const VERDICT_SET = new Set<string>(VERDICT_ORDER);

function isLocalized(value: unknown): value is LocalizedText {
  if (!value || typeof value !== "object") return false;
  const text = value as { en?: unknown; fa?: unknown };
  return (
    typeof text.en === "string" &&
    text.en.trim().length > 0 &&
    typeof text.fa === "string" &&
    text.fa.trim().length > 0
  );
}

function isOptionalLocalized(value: unknown): value is LocalizedText | undefined {
  if (value === undefined) return true;
  return isLocalized(value);
}

function isSimilar(value: unknown): value is RadarSimilarTool {
  if (!value || typeof value !== "object") return false;
  const tool = value as RadarSimilarTool;
  return (
    typeof tool.name === "string" &&
    tool.name.trim().length > 0 &&
    (tool.url === undefined || typeof tool.url === "string") &&
    (tool.slug === undefined || typeof tool.slug === "string")
  );
}

function isRadarItem(value: unknown): value is RadarItem {
  if (!value || typeof value !== "object") return false;
  const item = value as RadarItem;
  if (
    typeof item.slug !== "string" ||
    item.slug.length === 0 ||
    typeof item.name !== "string" ||
    typeof item.url !== "string" ||
    !isLocalized(item.take) ||
    !isLocalized(item.why) ||
    !item.share ||
    !isLocalized(item.share.x) ||
    !isLocalized(item.share.linkedin)
  ) {
    return false;
  }

  if (item.image !== undefined && typeof item.image !== "string") return false;
  if (item.tags !== undefined) {
    if (!Array.isArray(item.tags) || !item.tags.every((t) => typeof t === "string")) {
      return false;
    }
  }
  if (item.stars !== undefined && typeof item.stars !== "number") return false;
  if (
    item.starsGained !== undefined &&
    item.starsGained !== null &&
    typeof item.starsGained !== "number"
  ) {
    return false;
  }
  if (!isOptionalLocalized(item.explanation)) return false;
  if (!isOptionalLocalized(item.howItWorks)) return false;
  if (!isOptionalLocalized(item.different)) return false;
  if (item.verdict !== undefined && !VERDICT_SET.has(item.verdict)) return false;
  if (item.hasDemo !== undefined && typeof item.hasDemo !== "boolean") return false;
  if (item.hasApi !== undefined && typeof item.hasApi !== "boolean") return false;
  if (item.hasMcp !== undefined && typeof item.hasMcp !== "boolean") return false;
  if (item.similar !== undefined) {
    if (!Array.isArray(item.similar) || !item.similar.every(isSimilar)) return false;
  }
  if (item.trending !== undefined) {
    if (
      !Array.isArray(item.trending) ||
      !item.trending.every((t) => typeof t === "string")
    ) {
      return false;
    }
  }
  if (item.source !== undefined && typeof item.source !== "string") return false;

  return true;
}

function isRadarDay(value: unknown): value is RadarDay {
  if (!value || typeof value !== "object") return false;
  const day = value as RadarDay;
  return (
    typeof day.date === "string" &&
    Array.isArray(day.items) &&
    day.items.length > 0 &&
    day.items.length <= 10 &&
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

export async function getAllRadarDays(): Promise<RadarDay[]> {
  const dates = await getAllRadarDates();
  const days = await Promise.all(dates.map((date) => getRadarDay(date)));
  return days.filter((day): day is RadarDay => day !== null);
}

/** All projects, newest published date first (stable within a day by file order). */
export async function getAllRadarProjects(): Promise<RadarProject[]> {
  const days = await getAllRadarDays();
  const projects: RadarProject[] = [];
  for (const day of days) {
    for (const item of day.items) {
      projects.push({ ...item, date: day.date });
    }
  }
  return projects;
}

export async function getRadarProject(
  slug: string
): Promise<RadarProject | null> {
  const projects = await getAllRadarProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function getAllRadarSlugs(): Promise<string[]> {
  const projects = await getAllRadarProjects();
  return projects.map((p) => p.slug);
}

/** @deprecated Prefer getRadarProject(slug) — kept for gradual cleanup */
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
