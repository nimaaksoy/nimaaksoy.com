import fs from "node:fs";
import path from "node:path";

export { formatTag, normalizeTag, slugify } from "@/lib/prompt-shared";
export type { Prompt, PromptMedia, PromptSort } from "@/lib/prompt-shared";
import {
  formatTag,
  normalizeTag,
  type Prompt,
  type PromptMedia,
  type PromptSort,
} from "@/lib/prompt-shared";

export const PROMPTS_PER_PAGE = 50;
export const SITE_URL = "https://nimaaksoy.com";
export const PROMPTS_REPO_URL = "https://github.com/nimaaksoy/nimaaksoy.com";
export const PROMPTS_CONTRIBUTING_URL =
  "https://github.com/nimaaksoy/nimaaksoy.com/blob/main/content/prompts/CONTRIBUTING.md";

export type PromptQuery = {
  q?: string;
  tag?: string;
  sort?: PromptSort;
  page?: number;
  copyCounts?: Record<string, number>;
};

const promptsDirectory = path.join(/* turbopackIgnore: true */ process.cwd(), "content", "prompts");

function stripQuotes(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseScalar(value: string): string | boolean {
  const normalized = stripQuotes(value);
  if (normalized === "true") {
    return true;
  }
  if (normalized === "false") {
    return false;
  }
  return normalized;
}

function parseInlineArray(value: string) {
  const trimmed = value.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) {
    return null;
  }
  return trimmed
    .slice(1, -1)
    .split(",")
    .map((item) => stripQuotes(item))
    .filter(Boolean);
}

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("Missing frontmatter block");
  }

  const fields: Record<string, unknown> = {};
  const lines = match[1].split(/\r?\n/);
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z][A-Za-z0-9]*):(?:\s*(.*))?$/);
    if (!keyMatch) {
      index += 1;
      continue;
    }

    const [, key, rawValue = ""] = keyMatch;
    if (rawValue.trim()) {
      const inlineArray = parseInlineArray(rawValue);
      fields[key] = inlineArray ?? parseScalar(rawValue);
      index += 1;
      continue;
    }

    const children: string[] = [];
    index += 1;
    while (index < lines.length && /^\s+/.test(lines[index])) {
      children.push(lines[index]);
      index += 1;
    }

    const listItems: unknown[] = [];
    let currentObject: Record<string, string> | null = null;

    for (const child of children) {
      const listMatch = child.match(/^\s*-\s*(.*)$/);
      if (listMatch) {
        const item = listMatch[1];
        const objectMatch = item.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
        if (objectMatch) {
          currentObject = { [objectMatch[1]]: stripQuotes(objectMatch[2]) };
          listItems.push(currentObject);
        } else {
          currentObject = null;
          listItems.push(stripQuotes(item));
        }
        continue;
      }

      const nestedMatch = child.match(/^\s+([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
      if (nestedMatch && currentObject) {
        currentObject[nestedMatch[1]] = stripQuotes(nestedMatch[2]);
      }
    }

    fields[key] = listItems;
  }

  return { fields, body: match[2].trim() };
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function asMedia(value: unknown): PromptMedia[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item): PromptMedia | null => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const type = record.type === "video" ? "video" : record.type === "image" ? "image" : null;
      const url = asOptionalString(record.url);
      if (!type || !url) {
        return null;
      }

      const mediaItem: PromptMedia = {
        type,
        url,
        poster: asOptionalString(record.poster),
        alt: asOptionalString(record.alt),
      };
      return mediaItem;
    })
    .filter((item): item is PromptMedia => Boolean(item));
}

export function getPromptFiles() {
  if (!fs.existsSync(promptsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(promptsDirectory)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .filter((file) => !file.startsWith("_"))
    .filter((file) => file !== "CONTRIBUTING.md")
    .sort();
}

function readPromptFile(file: string): Prompt {
  const fullPath = path.join(promptsDirectory, file);
  const { fields, body } = parseFrontmatter(fs.readFileSync(fullPath, "utf8"));
  const tags = Array.isArray(fields.tags)
    ? fields.tags.map((tag) => normalizeTag(String(tag))).filter(Boolean)
    : [];

  return {
    title: asString(fields.title),
    slug: asString(fields.slug),
    description: asString(fields.description),
    tags: Array.from(new Set(tags)),
    media: asMedia(fields.media),
    sourceUrl: asOptionalString(fields.sourceUrl),
    authorName: asOptionalString(fields.authorName),
    authorUrl: asOptionalString(fields.authorUrl),
    date: asOptionalString(fields.date),
    featured: fields.featured === true,
    body,
    excerpt: body.replace(/\s+/g, " ").slice(0, 180),
  };
}

export function getAllPrompts() {
  return getPromptFiles()
    .map(readPromptFile)
    .sort((a, b) => {
      const dateA = a.date ? Date.parse(a.date) : 0;
      const dateB = b.date ? Date.parse(b.date) : 0;
      return dateB - dateA || a.title.localeCompare(b.title);
    });
}

export function getPromptBySlug(slug: string) {
  return getAllPrompts().find((prompt) => prompt.slug === slug) ?? null;
}

export function getPromptSlugs() {
  return getAllPrompts().map((prompt) => prompt.slug);
}

export function getAllTags() {
  const counts = new Map<string, number>();
  for (const prompt of getAllPrompts()) {
    for (const tag of prompt.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([slug, count]) => ({ slug, label: formatTag(slug), count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function normalizeSort(value: unknown): PromptSort {
  if (value === "most-copied" || value === "alphabetical") {
    return value;
  }
  return "newest";
}

export function normalizePage(value: unknown) {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }
  return Math.floor(parsed);
}

export function getPromptPage(query: PromptQuery = {}) {
  const q = query.q?.trim().toLowerCase() ?? "";
  const tag = query.tag ? normalizeTag(query.tag) : "";
  const sort = normalizeSort(query.sort);
  const page = Math.max(1, query.page ?? 1);

  let prompts = getAllPrompts();

  if (tag) {
    prompts = prompts.filter((prompt) => prompt.tags.includes(tag));
  }

  if (q) {
    prompts = prompts.filter((prompt) => {
      const haystack = [
        prompt.title,
        prompt.description,
        prompt.tags.join(" "),
        prompt.body,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  prompts = [...prompts].sort((a, b) => {
    if (sort === "most-copied") {
      return (
        (query.copyCounts?.[b.slug] ?? 0) - (query.copyCounts?.[a.slug] ?? 0) ||
        a.title.localeCompare(b.title)
      );
    }

    if (sort === "alphabetical") {
      return a.title.localeCompare(b.title);
    }

    const dateA = a.date ? Date.parse(a.date) : 0;
    const dateB = b.date ? Date.parse(b.date) : 0;
    return dateB - dateA || a.title.localeCompare(b.title);
  });

  const totalPrompts = prompts.length;
  const totalPages = Math.max(1, Math.ceil(totalPrompts / PROMPTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PROMPTS_PER_PAGE;

  return {
    prompts: prompts.slice(start, start + PROMPTS_PER_PAGE),
    totalPrompts,
    totalPages,
    currentPage,
    q,
    tag,
    sort,
  };
}

export function getPromptNeighbors(slug: string) {
  const prompts = getAllPrompts();
  const index = prompts.findIndex((prompt) => prompt.slug === slug);
  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: prompts[index - 1] ?? null,
    next: prompts[index + 1] ?? null,
  };
}

export function resolveMediaUrl(url?: string) {
  if (!url) {
    return undefined;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/")) {
    return `${SITE_URL}${url}`;
  }

  return url;
}

export function getPromptOgImage(prompt: Prompt) {
  const media = prompt.media[0];
  if (!media) {
    return undefined;
  }

  if (media.type === "image") {
    return resolveMediaUrl(media.url);
  }

  return resolveMediaUrl(media.poster);
}

export function getPaginationPages(totalPrompts = getAllPrompts().length) {
  const totalPages = Math.max(1, Math.ceil(totalPrompts / PROMPTS_PER_PAGE));
  return Array.from({ length: totalPages }, (_, index) => index + 1);
}
