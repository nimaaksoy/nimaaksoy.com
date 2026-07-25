#!/usr/bin/env node
/**
 * Weekly (or on-demand) GitHub star refresh for Radar.
 *
 * Reads content/radar/YYYY-MM-DD.json items with github.com URLs,
 * fetches stargazers_count from the GitHub API, writes content/radar/github-stats.json.
 *
 * Usage:
 *   node scripts/update-radar-github-stats.mjs
 *   GITHUB_TOKEN=ghp_… node scripts/update-radar-github-stats.mjs
 *
 * No AI — plain HTTP only. Optional GITHUB_TOKEN raises rate limits.
 */

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RADAR_DIR = path.join(ROOT, "content", "radar");
const OUT_FILE = path.join(RADAR_DIR, "github-stats.json");
const DATE_RE = /^\d{4}-\d{2}-\d{2}\.json$/;
const GITHUB_RE =
  /^https?:\/\/(?:www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?(?:\/|$)/i;

function parseGithubRepo(url) {
  if (!url || typeof url !== "string") return null;
  const m = url.trim().match(GITHUB_RE);
  if (!m) return null;
  const owner = m[1];
  const repo = m[2];
  if (!owner || !repo) return null;
  if (owner.toLowerCase() === "orgs" || owner.toLowerCase() === "users") return null;
  return { owner, repo, fullName: `${owner}/${repo}` };
}

async function loadItems() {
  const files = await fs.readdir(RADAR_DIR);
  const dayFiles = files.filter((f) => DATE_RE.test(f)).sort();
  /** @type {{ slug: string; name: string; url: string; date: string }[]} */
  const items = [];
  for (const file of dayFiles) {
    const raw = await fs.readFile(path.join(RADAR_DIR, file), "utf8");
    let day;
    try {
      day = JSON.parse(raw);
    } catch {
      console.warn(`skip invalid JSON: ${file}`);
      continue;
    }
    const date = typeof day.date === "string" ? day.date : file.replace(/\.json$/, "");
    for (const item of day.items || []) {
      if (!item?.slug || !item?.url) continue;
      items.push({
        slug: item.slug,
        name: item.name || item.slug,
        url: item.url,
        date,
      });
    }
  }
  return items;
}

async function fetchStars(fullName, token) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "nimaaksoy-radar-stats",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com/repos/${fullName}`, { headers });
  if (res.status === 404) {
    return { ok: false, error: "not_found" };
  }
  if (res.status === 403 || res.status === 429) {
    const reset = res.headers.get("x-ratelimit-reset");
    return {
      ok: false,
      error: `rate_limited_or_forbidden (${res.status})`,
      reset,
    };
  }
  if (!res.ok) {
    return { ok: false, error: `http_${res.status}` };
  }
  const data = await res.json();
  const stars = data.stargazers_count;
  if (typeof stars !== "number") {
    return { ok: false, error: "missing_stargazers_count" };
  }
  return { ok: true, stars, fullName: data.full_name || fullName };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
  const items = await loadItems();

  /** @type {Map<string, { fullName: string; slugs: string[] }>} */
  const repos = new Map();
  for (const item of items) {
    const parsed = parseGithubRepo(item.url);
    if (!parsed) continue;
    const key = parsed.fullName.toLowerCase();
    const entry = repos.get(key) || { fullName: parsed.fullName, slugs: [] };
    if (!entry.slugs.includes(item.slug)) entry.slugs.push(item.slug);
    repos.set(key, entry);
  }

  console.log(
    `Radar items: ${items.length}; GitHub repos: ${repos.size}` +
      (token ? " (auth)" : " (unauthenticated — set GITHUB_TOKEN if rate-limited)")
  );

  /** @type {Record<string, { stars: number; repo: string; fetchedAt: string }>} */
  const bySlug = {};
  /** @type {Record<string, { stars: number; fullName: string; slugs: string[]; fetchedAt: string }>} */
  const byRepo = {};
  const errors = [];

  let i = 0;
  for (const { fullName, slugs } of repos.values()) {
    i += 1;
    process.stdout.write(`[${i}/${repos.size}] ${fullName} … `);
    const result = await fetchStars(fullName, token);
    if (!result.ok) {
      console.log(`fail (${result.error})`);
      errors.push({ repo: fullName, ...result });
      // Back off briefly on rate limit
      if (String(result.error).includes("rate")) await sleep(2000);
      continue;
    }
    const fetchedAt = new Date().toISOString();
    byRepo[result.fullName] = {
      stars: result.stars,
      fullName: result.fullName,
      slugs,
      fetchedAt,
    };
    for (const slug of slugs) {
      bySlug[slug] = {
        stars: result.stars,
        repo: result.fullName,
        fetchedAt,
      };
    }
    console.log(`${result.stars.toLocaleString("en-US")} ★`);
    // Be polite to the API
    await sleep(token ? 100 : 350);
  }

  // Preserve previous stars when a fetch fails
  let previous = null;
  try {
    previous = JSON.parse(await fs.readFile(OUT_FILE, "utf8"));
  } catch {
    previous = null;
  }
  if (previous?.bySlug) {
    for (const [slug, row] of Object.entries(previous.bySlug)) {
      if (!bySlug[slug] && typeof row?.stars === "number") {
        bySlug[slug] = {
          stars: row.stars,
          repo: row.repo || "",
          fetchedAt: row.fetchedAt || previous.updatedAt || "",
          stale: true,
        };
      }
    }
  }

  const payload = {
    updatedAt: new Date().toISOString(),
    source: "github-api",
    repoCount: Object.keys(byRepo).length,
    itemCount: Object.keys(bySlug).length,
    bySlug,
    byRepo,
    errors: errors.length ? errors : undefined,
  };

  await fs.writeFile(OUT_FILE, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(`Wrote ${OUT_FILE} (${payload.itemCount} slugs)`);
  if (errors.length) {
    console.warn(`Warnings: ${errors.length} repo(s) failed — kept prior stars when available`);
    process.exitCode = errors.length === repos.size ? 1 : 0;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
