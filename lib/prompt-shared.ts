export type PromptMedia = {
  type: "image" | "video";
  url: string;
  poster?: string;
  alt?: string;
};

export type Prompt = {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  media: PromptMedia[];
  sourceUrl?: string;
  authorName?: string;
  authorUrl?: string;
  date?: string;
  featured: boolean;
  body: string;
  excerpt: string;
};

export type PromptSort = "newest" | "most-copied" | "alphabetical";

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeTag(tag: string) {
  return slugify(tag);
}

export function formatTag(tag: string) {
  return tag
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
