export type Locale = "en" | "fa";

export type LocalizedText = {
  en: string;
  /** Legacy / unused — Radar is EN-only. Empty string or omit. */
  fa?: string;
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
  /**
   * Optional YouTube watch/share/embed URL or 11-char id.
   * When set, the project page embeds the video.
   */
  youtube?: string;
  tags?: string[];
  /**
   * Optional legacy star count in day JSON (prefer github-stats.json on the site).
   * Kept for content/video pipelines; UI prefers live stats when present.
   */
  stars?: number;
  /** @deprecated Not shown on site — no "recent growth" UI */
  starsGained?: number | null;
  /**
   * Short scannable explanation (list + detail lead).
   * Not a raw GitHub description.
   */
  take: LocalizedText;
  /**
   * Why this pick matters — pure value, no fluff.
   * Detail page: folded into the "Why it matters" section with explanation.
   */
  why: LocalizedText;
  /**
   * Optional longer explanation (what it is).
   * Detail page: first paragraph under "Why it matters" when present.
   */
  explanation?: LocalizedText;
  /**
   * Optional: how the project works.
   * Detail page: first paragraph under "How it works".
   */
  howItWorks?: LocalizedText;
  /**
   * Optional: what makes it different.
   * Detail page: second paragraph under "How it works".
   */
  different?: LocalizedText;
  verdict?: RadarVerdict;
  hasDemo?: boolean;
  hasApi?: boolean;
  hasMcp?: boolean;
  similar?: RadarSimilarTool[];
  /** Optional short product labels (not star growth). */
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

/** Live GitHub star snapshot from scripts/update-radar-github-stats.mjs */
export type RadarGithubStatsFile = {
  updatedAt: string;
  bySlug?: Record<
    string,
    { stars: number; repo?: string; fetchedAt?: string; stale?: boolean }
  >;
};

/** Flattened project used by the feed and detail pages. */
export type RadarProject = RadarItem & {
  date: string;
  /** Stars from content/radar/github-stats.json when available */
  liveStars?: number;
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

/** Extract a YouTube video id from watch/share/embed URLs or a bare id. */
export function youtubeVideoId(input?: string | null): string | null {
  if (!input) return null;
  const raw = input.trim();
  if (!raw) return null;
  if (/^[\w-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      const v = url.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return v;
      const parts = url.pathname.split("/").filter(Boolean);
      const marker = parts.findIndex((p) => p === "embed" || p === "shorts" || p === "live");
      if (marker >= 0 && parts[marker + 1] && /^[\w-]{11}$/.test(parts[marker + 1])) {
        return parts[marker + 1];
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function youtubeEmbedUrl(input?: string | null): string | null {
  const id = youtubeVideoId(input);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
