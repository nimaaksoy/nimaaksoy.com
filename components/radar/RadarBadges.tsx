import type { RadarProject, RadarVerdict } from "@/lib/radar-shared";
import { VERDICT_LABELS } from "@/lib/radar-shared";

const verdictClass: Record<RadarVerdict, string> = {
  "must-watch":
    "border-[#2CFF05]/60 bg-[#2CFF05]/10 text-[#2CFF05]",
  "worth-testing":
    "border-sky-400/50 bg-sky-400/10 text-sky-300",
  "worth-sharing":
    "border-violet-400/50 bg-violet-400/10 text-violet-300",
  interesting:
    "border-[#7F7F7F]/60 bg-[#1A1A1A] text-[#9A9A9A]",
  skip: "border-red-400/40 bg-red-400/10 text-red-300",
};

const chipBase =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 font-jetbrains text-[10px] uppercase tracking-[0.12em]";

export function VerdictBadge({ verdict }: { verdict: RadarVerdict }) {
  return (
    <span className={`${chipBase} ${verdictClass[verdict]}`}>
      {VERDICT_LABELS[verdict]}
    </span>
  );
}

export function CapabilityBadges({
  project,
}: {
  project: Pick<RadarProject, "hasDemo" | "hasApi" | "hasMcp">;
}) {
  const chips: { key: string; label: string }[] = [];
  if (project.hasDemo) chips.push({ key: "demo", label: "Demo" });
  if (project.hasApi) chips.push({ key: "api", label: "API" });
  if (project.hasMcp) chips.push({ key: "mcp", label: "MCP" });
  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className={`${chipBase} border-[#2CFF05]/35 bg-[#0A0A0A] text-[#2CFF05]`}
        >
          {chip.label}
        </span>
      ))}
    </div>
  );
}

export function TagList({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`${chipBase} border-[#1F1F1F] text-[#7F7F7F]`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
