"use client";

import { useRef, useState } from "react";

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
};

export default function PromptCopyButton({
  slug,
  body,
  count,
  className = "",
  size = "small",
  onCountChange,
}: PromptCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const lastCopyAtRef = useRef(0);

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

      try {
        const response = await fetch(`/api/prompts/${slug}/copy`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = (await response.json()) as { count?: number };
          if (typeof data.count === "number") {
            onCountChange?.(slug, data.count);
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
      aria-label={`Copy prompt. Current copy count: ${count}`}
    >
      <span>{copied ? "Copied" : "Copy Prompt"}</span>
      <span aria-hidden className="text-current/70">
        {count}
      </span>
    </button>
  );
}
