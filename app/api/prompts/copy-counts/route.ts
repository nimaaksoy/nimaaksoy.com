import { NextRequest, NextResponse } from "next/server";

import { getCopyCounts } from "@/lib/prompt-copy-counts";

export async function GET(request: NextRequest) {
  const rawSlugs = request.nextUrl.searchParams.get("slugs") ?? "";
  const slugs = rawSlugs
    .split(",")
    .map((slug) => slug.trim())
    .filter((slug) => /^[a-z0-9-]+$/.test(slug))
    .slice(0, 50);

  try {
    const counts = await getCopyCounts(slugs);
    return NextResponse.json({ counts });
  } catch {
    return NextResponse.json({ counts: {} }, { status: 200 });
  }
}
