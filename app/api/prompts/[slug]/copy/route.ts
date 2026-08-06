import { NextRequest, NextResponse } from "next/server";

import {
  getCopyCounts,
  incrementCopyCount,
  isKnownPromptSlug,
} from "@/lib/prompt-copy-counts";

const rateLimitWindowMs = 60_000;
const rateLimitMax = 20;
const hits = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: NextRequest, slug: string) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return `${forwardedFor || realIp || "unknown"}:${slug}`;
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = hits.get(key);

  if (!current || current.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    return false;
  }

  current.count += 1;
  return current.count > rateLimitMax;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  if (!/^[a-z0-9-]+$/.test(slug) || !isKnownPromptSlug(slug)) {
    return NextResponse.json({ error: "Unknown prompt slug" }, { status: 404 });
  }

  if (isRateLimited(getClientKey(request, slug))) {
    return NextResponse.json({ error: "Too many copy events" }, { status: 429 });
  }

  // The local store is best-effort — production runs on an ephemeral disk where
  // the write can fail. PostHog still records the copy from the client, so a
  // failed write must not blank out the count.
  let stored = true;
  try {
    await incrementCopyCount(slug);
  } catch {
    stored = false;
  }

  try {
    const counts = await getCopyCounts([slug]);
    return NextResponse.json({ count: counts[slug] ?? 0, stored });
  } catch {
    return NextResponse.json({ stored, unavailable: true });
  }
}
