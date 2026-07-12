export type Locale = "en" | "fa";

export type LocalizedText = {
  en: string;
  fa: string;
};

export type RadarItemShare = {
  x: LocalizedText;
  linkedin: LocalizedText;
};

export type RadarItem = {
  slug: string;
  name: string;
  url: string;
  /** Optional cover / product image URL */
  image?: string;
  tags?: string[];
  starsGained?: number;
  /** Short hook shown in the list */
  take: LocalizedText;
  /** Why it matters / what changed — pure value, no fluff */
  why: LocalizedText;
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

export function dayPath(date: string, locale: Locale = "en"): string {
  return locale === "fa" ? `/fa/radar/${date}` : `/radar/${date}`;
}

export function itemPath(
  date: string,
  slug: string,
  locale: Locale = "en"
): string {
  return locale === "fa"
    ? `/fa/radar/${date}/${slug}`
    : `/radar/${date}/${slug}`;
}

export function indexPath(locale: Locale = "en"): string {
  return locale === "fa" ? "/fa/radar" : "/radar";
}

export function absoluteDayUrl(date: string, locale: Locale = "en"): string {
  return `https://nimaaksoy.com${dayPath(date, locale)}`;
}

export function absoluteItemUrl(
  date: string,
  slug: string,
  locale: Locale = "en"
): string {
  return `https://nimaaksoy.com${itemPath(date, slug, locale)}`;
}

export function formatRadarDate(date: string, locale: Locale): string {
  const [year, month, day] = date.split("-").map(Number);
  const value = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(value);
}

export function copyForLocale(
  value: LocalizedText,
  locale: Locale
): string {
  return locale === "fa" ? value.fa : value.en;
}

/** Ensure caption ends with the item URL (for share intents). */
export function withShareUrl(caption: string, url: string): string {
  const trimmed = caption.trim();
  if (trimmed.includes(url)) return trimmed;
  return `${trimmed}\n\n${url}`;
}
