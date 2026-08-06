type HogqlRow = unknown[];

type StatsTileData = {
  viewsToday: number;
  views7d: number;
  visitors7d: number;
  promptCopies7d: number;
  bestDay: number;
};

export type SiteAnalyticsData = {
  tiles: StatsTileData;
  byDay: Array<{
    date: string;
    views: number;
    visitors: number;
  }>;
  pages: Array<{
    path: string;
    views: number;
  }>;
  promptCopies: Array<{
    prompt: string;
    copies: number;
  }>;
};

export type PromptCopyTotals = Record<string, number>;

const host = process.env.POSTHOG_UI_HOST || "https://us.posthog.com";
const projectId = process.env.POSTHOG_PROJECT_ID;
const personalKey = process.env.POSTHOG_PERSONAL_KEY;
const siteHost = process.env.POSTHOG_SITE_HOST || "nimaaksoy.com";

// PostHog can be slow on cold aggregates. Never let a page render wait longer
// than this: a stale (or empty) result renders instead.
const queryTimeoutMs = 6_000;
const freshMs = 120_000;
// After a failure, retry sooner than a normal refresh instead of serving the
// error state for a full cache window.
const errorRetryMs = 20_000;

/**
 * Read-through cache that never blocks on a refresh once it holds data:
 * stale entries are returned immediately while a single shared request
 * repopulates them in the background. Concurrent callers share one request,
 * so a cold cache cannot fan out into duplicate PostHog queries.
 */
type CacheEntry<T> = {
  at: number;
  data: T | null;
  inflight: Promise<T | null> | null;
};

function createEntry<T>(): CacheEntry<T> {
  return { at: 0, data: null, inflight: null };
}

function refresh<T>(entry: CacheEntry<T>, loader: () => Promise<T>) {
  if (entry.inflight) {
    return entry.inflight;
  }

  const request = loader()
    .then((data) => {
      entry.at = Date.now();
      entry.data = data;
      return data;
    })
    .catch(() => {
      // Keep the last good payload and retry sooner than a normal refresh.
      entry.at = Date.now() - freshMs + errorRetryMs;
      return entry.data;
    })
    .finally(() => {
      entry.inflight = null;
    });

  entry.inflight = request;
  return request;
}

async function readThrough<T>(entry: CacheEntry<T>, loader: () => Promise<T>) {
  const isFresh = Date.now() - entry.at < freshMs;

  if (entry.data !== null && isFresh) {
    return entry.data;
  }

  if (entry.data !== null) {
    // Stale but usable: refresh in the background and answer immediately.
    void refresh(entry, loader);
    return entry.data;
  }

  return refresh(entry, loader);
}

const analyticsCache = createEntry<SiteAnalyticsData>();
const promptCopyCache = createEntry<PromptCopyTotals>();

function toNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

async function hogql(query: string): Promise<HogqlRow[]> {
  if (!projectId || !personalKey) {
    return [];
  }

  const response = await fetch(`${host}/api/projects/${projectId}/query/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${personalKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {
        kind: "HogQLQuery",
        query,
      },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(queryTimeoutMs),
  });

  if (!response.ok) {
    throw new Error(`PostHog query failed with ${response.status}`);
  }

  const body = (await response.json()) as { results?: HogqlRow[] };
  return body.results || [];
}

function getSiteFilter() {
  return `properties.$host = '${siteHost.replaceAll("'", "\\'")}'`;
}

export function hasAnalyticsCredentials() {
  return Boolean(projectId && personalKey);
}

async function loadSiteAnalytics(): Promise<SiteAnalyticsData> {
  const siteFilter = getSiteFilter();

  const [tiles, byDay, pages, promptCopies] = await Promise.all([
    hogql(`
      SELECT
        countIf(event = '$pageview' AND timestamp >= toStartOfDay(now())) AS views_today,
        countIf(event = '$pageview') AS views_7d,
        countDistinctIf(person_id, event = '$pageview') AS visitors_7d,
        countIf(event = 'copy_prompt') AS prompt_copies_7d
      FROM events
      WHERE ${siteFilter}
        AND timestamp > now() - INTERVAL 7 DAY
    `),
    hogql(`
      SELECT
        toDate(timestamp) AS d,
        countIf(event = '$pageview') AS views,
        countDistinctIf(person_id, event = '$pageview') AS visitors
      FROM events
      WHERE ${siteFilter}
        AND timestamp > now() - INTERVAL 14 DAY
      GROUP BY d
      ORDER BY d
    `),
    hogql(`
      SELECT
        coalesce(properties.$pathname, '/') AS p,
        count() AS views
      FROM events
      WHERE ${siteFilter}
        AND event = '$pageview'
        AND timestamp > now() - INTERVAL 7 DAY
      GROUP BY p
      ORDER BY views DESC
      LIMIT 10
    `),
    hogql(`
      SELECT
        coalesce(properties.prompt_slug, 'unknown') AS prompt,
        count() AS copies
      FROM events
      WHERE ${siteFilter}
        AND event = 'copy_prompt'
        AND timestamp > now() - INTERVAL 7 DAY
      GROUP BY prompt
      ORDER BY copies DESC
      LIMIT 10
    `),
  ]);

  const tileRow = tiles[0] || [];
  const days = byDay.map(([date, views, visitors]) => ({
    date: String(date),
    views: toNumber(views),
    visitors: toNumber(visitors),
  }));

  return {
    tiles: {
      viewsToday: toNumber(tileRow[0]),
      views7d: toNumber(tileRow[1]),
      visitors7d: toNumber(tileRow[2]),
      promptCopies7d: toNumber(tileRow[3]),
      // Derived from the 14-day series the chart already loads, so the tiles
      // query stays a single bounded scan instead of an unbounded subquery.
      bestDay: Math.max(0, ...days.map((day) => day.views)),
    },
    byDay: days,
    pages: pages.map(([path, views]) => ({
      path: String(path),
      views: toNumber(views),
    })),
    promptCopies: promptCopies.map(([prompt, copies]) => ({
      prompt: String(prompt),
      copies: toNumber(copies),
    })),
  };
}

export async function getSiteAnalytics(): Promise<SiteAnalyticsData | null> {
  if (!hasAnalyticsCredentials()) {
    return null;
  }

  return readThrough(analyticsCache, loadSiteAnalytics);
}

async function loadPromptCopyTotals(): Promise<PromptCopyTotals> {
  // Same shape as the stats page query, which is known to work against this
  // project's event schema — only the window and grouping differ.
  const rows = await hogql(`
    SELECT
      coalesce(properties.prompt_slug, 'unknown') AS prompt,
      count() AS copies
    FROM events
    WHERE ${getSiteFilter()}
      AND event = 'copy_prompt'
      AND timestamp > now() - INTERVAL 365 DAY
    GROUP BY prompt
    ORDER BY copies DESC
    LIMIT 1000
  `);

  const totals: PromptCopyTotals = {};
  for (const [prompt, copies] of rows) {
    const slug = String(prompt);
    if (slug && slug !== "unknown") {
      totals[slug] = toNumber(copies);
    }
  }

  return totals;
}

/**
 * Per-prompt lifetime copy totals from PostHog `copy_prompt` events. Returns
 * null when analytics is not configured so callers can fall back to the local
 * file store.
 */
export async function getPromptCopyTotals(): Promise<PromptCopyTotals | null> {
  if (!hasAnalyticsCredentials()) {
    return null;
  }

  return readThrough(promptCopyCache, loadPromptCopyTotals);
}
