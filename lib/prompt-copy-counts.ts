import fs from "node:fs/promises";
import path from "node:path";

import { getPromptSlugs } from "@/lib/prompts";

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

export async function getCopyCounts(slugs: string[]) {
  const allowed = new Set(getPromptSlugs());
  const store = await readStore();

  return Object.fromEntries(
    slugs
      .filter((slug) => allowed.has(slug))
      .map((slug) => [slug, Math.max(0, Number(store[slug]) || 0)])
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
