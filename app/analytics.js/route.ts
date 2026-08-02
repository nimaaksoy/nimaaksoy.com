export const dynamic = "force-dynamic";

export function GET() {
  const key = process.env.POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY || "";
  const uiHost = process.env.POSTHOG_UI_HOST || "https://us.posthog.com";

  const body = key
    ? `(function () {
  var s = document.createElement('script');
  s.src = location.origin + '/ph/static/array.js';
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.onload = function () {
    if (!window.posthog) return;
    window.posthog.init(${JSON.stringify(key)}, {
      api_host: location.origin + '/ph',
      ui_host: ${JSON.stringify(uiHost)},
      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: false,
      disable_session_recording: true
    });
  };
  document.head.appendChild(s);
})();`
    : "/* analytics disabled: POSTHOG_KEY is not set */";

  return new Response(body, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300, must-revalidate",
    },
  });
}

