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

const host = process.env.POSTHOG_UI_HOST || "https://us.posthog.com";
const projectId = process.env.POSTHOG_PROJECT_ID;
const personalKey = process.env.POSTHOG_PERSONAL_KEY;
const siteHost = process.env.POSTHOG_SITE_HOST || "nimaaksoy.com";

let cache: { at: number; data: SiteAnalyticsData | null } = {
  at: 0,
  data: null,
};

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
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`PostHog query failed with ${response.status}`);
  }

  const body = (await response.json()) as { results?: HogqlRow[] };
  return body.results || [];
}

export function hasAnalyticsCredentials() {
  return Boolean(projectId && personalKey);
}

export async function getSiteAnalytics(): Promise<SiteAnalyticsData | null> {
  if (!hasAnalyticsCredentials()) {
    return null;
  }

  const now = Date.now();
  if (now - cache.at < 120_000) {
    return cache.data;
  }

  const siteFilter = `properties.$host = '${siteHost.replaceAll("'", "\\'")}'`;

  try {
    const [tiles, byDay, pages, promptCopies] = await Promise.all([
      hogql(`
        SELECT
          countIf(event = '$pageview' AND timestamp >= toStartOfDay(now())) AS views_today,
          countIf(event = '$pageview') AS views_7d,
          countDistinctIf(person_id, event = '$pageview') AS visitors_7d,
          countIf(event = 'copy_prompt') AS prompt_copies_7d,
          (SELECT max(pv) FROM (
            SELECT toDate(timestamp) AS d, countIf(event = '$pageview') AS pv
            FROM events
            WHERE ${siteFilter}
            GROUP BY d
          )) AS best_day
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
    cache = {
      at: now,
      data: {
        tiles: {
          viewsToday: toNumber(tileRow[0]),
          views7d: toNumber(tileRow[1]),
          visitors7d: toNumber(tileRow[2]),
          promptCopies7d: toNumber(tileRow[3]),
          bestDay: toNumber(tileRow[4]),
        },
        byDay: byDay.map(([date, views, visitors]) => ({
          date: String(date),
          views: toNumber(views),
          visitors: toNumber(visitors),
        })),
        pages: pages.map(([path, views]) => ({
          path: String(path),
          views: toNumber(views),
        })),
        promptCopies: promptCopies.map(([prompt, copies]) => ({
          prompt: String(prompt),
          copies: toNumber(copies),
        })),
      },
    };
  } catch {
    cache.at = now;
  }

  return cache.data;
}

