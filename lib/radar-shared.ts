export type Locale = "en" | "fa";

export type RadarItem = {
  slug: string;
  name: string;
  url: string;
  tags?: string[];
  starsGained?: number;
  take: {
    en: string;
    fa: string;
  };
  source?: string;
};

export type RadarDay = {
  date: string;
  items: RadarItem[];
  social: {
    x: { en: string; fa: string };
    linkedin: { en: string; fa: string };
  };
};

export function dayPath(date: string, locale: Locale = "en"): string {
  return locale === "fa" ? `/fa/radar/${date}` : `/radar/${date}`;
}

export function indexPath(locale: Locale = "en"): string {
  return locale === "fa" ? "/fa/radar" : "/radar";
}

export function absoluteDayUrl(date: string, locale: Locale = "en"): string {
  return `https://nimaaksoy.com${dayPath(date, locale)}`;
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

export function copyForLocale<T extends { en: string; fa: string }>(
  value: T,
  locale: Locale
): string {
  return locale === "fa" ? value.fa : value.en;
}
