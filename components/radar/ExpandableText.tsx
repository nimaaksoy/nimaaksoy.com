"use client";

import { useMemo, useState } from "react";

type ExpandableTextProps = {
  text: string;
  /** Soft character budget before collapse (default ~one minute scan). */
  collapsedChars?: number;
  className?: string;
};

export function ExpandableText({
  text,
  collapsedChars = 420,
  className = "",
}: ExpandableTextProps) {
  const needsToggle = text.length > collapsedChars;
  const [open, setOpen] = useState(false);

  const body = useMemo(() => {
    if (!needsToggle || open) return text;
    const slice = text.slice(0, collapsedChars);
    const cut = slice.lastIndexOf(" ");
    const safe = cut > collapsedChars * 0.6 ? slice.slice(0, cut) : slice;
    return `${safe.trimEnd()}…`;
  }, [text, needsToggle, open, collapsedChars]);

  return (
    <div className={className}>
      <p className="font-monroe text-[15px] leading-[1.55] text-[#9A9A9A] md:text-[16px]">
        {body}
      </p>
      {needsToggle ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-2 font-jetbrains text-[11px] uppercase tracking-[0.14em] text-[#2CFF05] transition hover:opacity-80"
        >
          {open ? "Show less" : "Read more"}
        </button>
      ) : null}
    </div>
  );
}
