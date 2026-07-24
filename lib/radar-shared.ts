export type Locale = "en" | "fa";

export type LocalizedText = {
  en: string;
  fa: string;
};

export type RadarItemShare = {
  x: LocalizedText;
  linkedin: LocalizedText;
};

/** Curator verdict — small badge on cards and detail. */
export type RadarVerdict =
  | "must-watch"
  | "worth-testing"
  | "worth-sharing"
  | "interesting"
  | "skip";

export type RadarSimilarTool = {
  name: string;
  /** External product / repo URL */
  url?: string;
  /** Internal Radar slug when the tool is already saved */
  slug?: string;
};

export type RadarItem = {
  slug: string;
  name: string;
  url: string;
  /** Optional cover / product image URL */
  image?: string;
  tags?: string[];
  /** Total star count when known */
  stars?: number;
  /** Recent star growth when known */
  starsGained?: number | null;
  /**
   * Short scannable explanation (list + detail lead).
   * Not a raw GitHub description.
   */
  take: LocalizedText;
  /**
   * Why this pick matters — pure value, no fluff.
   * Shown as its own section; not repeated as the main explanation.
   */
  why: LocalizedText;
  /**
   * Optional longer explanation (what it is, problem, attention).
   * Prefer this on the detail page when present.
   */
  explanation?: LocalizedText;
  /** Optional: how the project works */
  howItWorks?: LocalizedText;
  /** Optional: what makes it different */
  different?: LocalizedText;
  verdict?: RadarVerdict;
  hasDemo?: boolean;
  hasApi?: boolean;
  hasMcp?: boolean;
  similar?: RadarSimilarTool[];
  /** Short trending signal labels, e.g. "fast star growth" */
  trending?: string[];
  /**
   * Social captions used only by share buttons (X/LinkedIn intent).
   * Never render this text on the public page.
   */
  share: RadarItemShare;
  source?: string;
};

export type RadarDay = {
  date: string;
  items: RadarItem[];
};

/** Flattened project used by the feed and detail pages. */
export type RadarProject = RadarItem & {
  date: string;
};

export const RADAR_PAGE_SIZE = 50;

export const VERDICT_LABELS: Record<RadarVerdict, string> = {
  "must-watch": "Must watch",
  "worth-testing": "Worth testing",
  "worth-sharing": "Worth sharing",
  interesting: "Interesting",
  skip: "Skip",
};

export const VERDICT_ORDER: RadarVerdict[] = [
  "must-watch",
  "worth-testing",
  "worth-sharing",
  "interesting",
  "skip",
];

export function indexPath(): string {
  return "/radar";
}

export function itemPath(slug: string): string {
  return `/radar/${slug}`;
}

export function absoluteItemUrl(slug: string): string {
  return `https://nimaaksoy.com${itemPath(slug)}`;
}

export function formatRadarDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const value = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(value);
}

export function formatRadarDateLong(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const value = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(value);
}

/** Prefer English; keep FA in JSON for historical files. */
export function copyEn(value: LocalizedText): string {
  return value.en;
}

/** Ensure caption ends with the item URL (for share intents). */
export function withShareUrl(caption: string, url: string): string {
  const trimmed = caption.trim();
  if (trimmed.includes(url)) return trimmed;
  return `${trimmed}\n\n${url}`;
}

export const FALLBACK_IMAGE = "/radar-fallback.svg";

export function projectImage(project: Pick<RadarItem, "image">): string {
  return project.image?.trim() ? project.image : FALLBACK_IMAGE;
}
