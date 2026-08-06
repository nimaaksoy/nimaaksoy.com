import fs from "node:fs/promises";
import path from "node:path";

import { getPromptSlugs } from "@/lib/prompts";
import { getPromptCopyTotals } from "@/lib/site-analytics";

type CopyCountStore = Record<string, number>;

const defaultStorePath = path.join("/tmp", "nimaaksoy-prompt-copy-counts.json");

function getStorePath() {
  return process.env.PROMPT_COPY_COUNTS_FILE || defaultStorePath;
}

async function readStore(): Promise<CopyCountStore> {
  try {
    const raw = await fs.readFile(getStorePath(), "utf8");
    const parsed = JSON.parse(raw) as CopyCountStore;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

async function writeStore(store: CopyCountStore) {
  const storePath = getStorePath();
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
}

export function isKnownPromptSlug(slug: string) {
  return getPromptSlugs().includes(slug);
}

/**
 * Copy counts for the given prompt slugs.
 *
 * PostHog `copy_prompt` events are the source of truth: the local JSON store
 * lives on ephemeral disk in production, so on its own it reports zero for
 * every prompt. Both sources count the same click, so the two are merged with
 * `max` (never summed) — that keeps counts correct when only one is available
 * and avoids double counting when both are.
 */
export async function getCopyCounts(slugs: string[]) {
  const allowed = new Set(getPromptSlugs());
  const wanted = slugs.filter((slug) => allowed.has(slug));

  const [store, analyticsTotals] = await Promise.all([
    readStore(),
    getPromptCopyTotals().catch(() => null),
  ]);

  return Object.fromEntries(
    wanted.map((slug) => {
      const stored = Math.max(0, Number(store[slug]) || 0);
      const tracked = Math.max(0, Number(analyticsTotals?.[slug]) || 0);
      return [slug, Math.max(stored, tracked)];
    })
  );
}

export async function incrementCopyCount(slug: string) {
  if (!isKnownPromptSlug(slug)) {
    return null;
  }

  const store = await readStore();
  const nextCount = Math.max(0, Number(store[slug]) || 0) + 1;
  store[slug] = nextCount;
  await writeStore(store);
  return nextCount;
}
