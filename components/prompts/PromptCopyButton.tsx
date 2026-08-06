"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

type PromptCopyButtonProps = {
  slug: string;
  body: string;
  count: number;
  className?: string;
  size?: "small" | "large";
  onCountChange?: (slug: string, count: number) => void;
  /**
   * Fetch a live count on mount. Needed on statically generated pages, where
   * the server-rendered count is frozen at build time.
   */
  autoRefresh?: boolean;
};

export default function PromptCopyButton({
  slug,
  body,
  count,
  className = "",
  size = "small",
  onCountChange,
  autoRefresh = false,
}: PromptCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  // Counts only ever grow, so the displayed value never steps backwards —
  // a stale refetch cannot undo the optimistic bump from a fresh copy.
  const [displayCount, setDisplayCount] = useState(count);
  const displayCountRef = useRef(count);
  const lastCopyAtRef = useRef(0);

  const setHighestCount = (next: number) => {
    const value = Math.max(displayCountRef.current, next);
    displayCountRef.current = value;
    setDisplayCount(value);
    return value;
  };

  useEffect(() => {
    setHighestCount(count);
  }, [count]);

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    const controller = new AbortController();

    fetch(`/api/prompts/copy-counts?slugs=${encodeURIComponent(slug)}`, {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { counts?: Record<string, number> } | null) => {
        const live = data?.counts?.[slug];
        if (typeof live === "number") {
          setHighestCount(live);
        }
      })
      .catch(() => {
        // The count is secondary; the button stays usable without it.
      });

    return () => controller.abort();
  }, [autoRefresh, slug]);

  const applyCount = (next: number) => {
    // Update first: `onCountChange?.(…)` would short-circuit and skip the
    // argument entirely when no handler is passed.
    const value = setHighestCount(next);
    onCountChange?.(slug, value);
  };

  const copyPrompt = async () => {
    const now = Date.now();
    if (isCopying || now - lastCopyAtRef.current < 900) {
      return;
    }

    lastCopyAtRef.current = now;
    setIsCopying(true);

    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      window.posthog?.capture("copy_prompt", {
        prompt_slug: slug,
      });

      // PostHog needs a moment before the new event shows up in queries, so
      // credit the copy immediately.
      applyCount(displayCountRef.current + 1);

      try {
        const response = await fetch(`/api/prompts/${slug}/copy`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = (await response.json()) as { count?: number };
          if (typeof data.count === "number") {
            applyCount(data.count);
          }
        }
      } catch {
        // Copying should still succeed if the counter endpoint is unavailable.
      }

      window.setTimeout(() => setCopied(false), 1600);
    } finally {
      setIsCopying(false);
    }
  };

  const sizeClass =
    size === "large"
      ? "px-6 py-3 text-[12px]"
      : "px-4 py-2 text-[11px]";

  return (
    <button
      type="button"
      onClick={copyPrompt}
      disabled={isCopying}
      className={`signal-button inline-flex items-center gap-2 rounded-full font-jetbrains uppercase tracking-[0.12em] disabled:cursor-wait disabled:opacity-70 ${sizeClass} ${className}`}
      aria-label={`Copy prompt. Current copy count: ${displayCount}`}
    >
      <span>{copied ? "Copied" : "Copy Prompt"}</span>
      <span aria-hidden className="text-current/70">
        {displayCount}
      </span>
    </button>
  );
}
