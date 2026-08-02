import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const uiHost = process.env.POSTHOG_UI_HOST || "https://us.posthog.com";
const isEuPostHog = uiHost.includes("eu.posthog.com");
const ingestHost =
  process.env.POSTHOG_INGEST_HOST ||
  (isEuPostHog ? "https://eu.i.posthog.com" : "https://us.i.posthog.com");
const assetHost =
  process.env.POSTHOG_ASSET_HOST ||
  (isEuPostHog ? "https://eu-assets.i.posthog.com" : "https://us-assets.i.posthog.com");

type PostHogProxyContext = {
  params: Promise<{
    path?: string[];
  }>;
};

async function proxyPostHog(request: NextRequest, context: PostHogProxyContext) {
  const { path = [] } = await context.params;
  const pathname = `/${path.join("/")}`;
  const upstreamBase = pathname.startsWith("/static/") ? assetHost : ingestHost;
  const upstreamUrl = new URL(`${upstreamBase}${pathname}`);
  upstreamUrl.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  headers.set("host", upstreamUrl.host);
  headers.delete("cookie");
  headers.delete("content-length");
  headers.delete("x-forwarded-host");
  headers.delete("x-forwarded-proto");
  headers.delete("x-real-ip");
  headers.delete("cdn-loop");

  for (const name of [...headers.keys()]) {
    if (name.startsWith("cf-") || name.startsWith("x-vercel-")) {
      headers.delete(name);
    }
  }

  const init: RequestInit & { duplex?: "half" } = {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
    redirect: "manual",
    duplex: "half",
  };

  const response = await fetch(upstreamUrl, init);
  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("transfer-encoding");

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export const GET = proxyPostHog;
export const POST = proxyPostHog;
export const OPTIONS = proxyPostHog;
export const HEAD = proxyPostHog;
