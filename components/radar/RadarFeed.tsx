"use client";

import { useMemo, useState, useTransition } from "react";
import type { RadarProject, RadarVerdict } from "@/lib/radar-shared";
import { RADAR_PAGE_SIZE, VERDICT_LABELS } from "@/lib/radar-shared";
import { RadarProjectCard } from "@/components/radar/RadarProjectCard";

type SortMode = "latest" | "growing";

type FilterMode =
  | "all"
  | RadarVerdict
  | "has-demo"
  | "has-api"
  | "has-mcp";

type ToolbarChip = {
  id: string;
  label: string;
  kind: "sort" | "filter";
  sort?: SortMode;
  filter?: FilterMode;
};

type RadarFeedProps = {
  projects: RadarProject[];
};

function matchesSearch(project: RadarProject, q: string): boolean {
  if (!q) return true;
  const hay = [
    project.name,
    project.take.en,
    project.why.en,
    project.explanation?.en ?? "",
    project.howItWorks?.en ?? "",
    project.different?.en ?? "",
    ...(project.tags ?? []),
    ...(project.trending ?? []),
    project.source ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

export function RadarFeed({ projects }: RadarFeedProps) {
  const [sort, setSort] = useState<SortMode>("latest");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const available = useMemo(() => {
    const hasGrowing = projects.some(
      (p) => typeof p.starsGained === "number" && p.starsGained > 0
    );
    const verdicts = new Set(
      projects.map((p) => p.verdict).filter(Boolean) as RadarVerdict[]
    );
    return {
      hasGrowing,
      hasDemo: projects.some((p) => p.hasDemo),
      hasApi: projects.some((p) => p.hasApi),
      hasMcp: projects.some((p) => p.hasMcp),
      verdicts,
    };
  }, [projects]);

  const chips: ToolbarChip[] = useMemo(() => {
    const list: ToolbarChip[] = [
      { id: "latest", label: "Latest", kind: "sort", sort: "latest" },
    ];
    if (available.hasGrowing) {
      list.push({
        id: "growing",
        label: "Fastest growing",
        kind: "sort",
        sort: "growing",
      });
    }
    for (const v of [
      "must-watch",
      "worth-testing",
      "worth-sharing",
    ] as RadarVerdict[]) {
      if (available.verdicts.has(v)) {
        list.push({
          id: v,
          label: VERDICT_LABELS[v],
          kind: "filter",
          filter: v,
        });
      }
    }
    if (available.hasDemo) {
      list.push({
        id: "has-demo",
        label: "Has demo",
        kind: "filter",
        filter: "has-demo",
      });
    }
    if (available.hasApi) {
      list.push({
        id: "has-api",
        label: "Has API",
        kind: "filter",
        filter: "has-api",
      });
    }
    if (available.hasMcp) {
      list.push({
        id: "has-mcp",
        label: "Has MCP",
        kind: "filter",
        filter: "has-mcp",
      });
    }
    return list;
  }, [available]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = projects.filter((p) => matchesSearch(p, q));

    if (filter === "has-demo") list = list.filter((p) => p.hasDemo);
    else if (filter === "has-api") list = list.filter((p) => p.hasApi);
    else if (filter === "has-mcp") list = list.filter((p) => p.hasMcp);
    else if (filter !== "all") {
      list = list.filter((p) => p.verdict === filter);
    }

    if (sort === "growing") {
      list = [...list].sort((a, b) => {
        const ag = typeof a.starsGained === "number" ? a.starsGained : -1;
        const bg = typeof b.starsGained === "number" ? b.starsGained : -1;
        if (bg !== ag) return bg - ag;
        return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
      });
    } else {
      // newest first — projects already arrive newest-first; re-sort for safety
      list = [...list].sort((a, b) =>
        a.date < b.date ? 1 : a.date > b.date ? -1 : 0
      );
    }

    return list;
  }, [projects, query, filter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / RADAR_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * RADAR_PAGE_SIZE,
    safePage * RADAR_PAGE_SIZE
  );

  const applySort = (mode: SortMode) => {
    startTransition(() => {
      setSort(mode);
      setFilter("all");
      setPage(1);
    });
  };

  const applyFilter = (mode: FilterMode) => {
    startTransition(() => {
      setFilter(mode);
      setPage(1);
    });
  };

  const onSearch = (value: string) => {
    startTransition(() => {
      setQuery(value);
      setPage(1);
    });
  };

  const isChipActive = (chip: ToolbarChip) => {
    if (chip.kind === "sort") {
      return sort === chip.sort && filter === "all";
    }
    return filter === chip.filter;
  };

  return (
    <div className="px-4 py-12 sm:px-6 md:px-10 md:py-16">
      <div className="mx-auto max-w-[1100px]">
        <header className="mb-8">
          <p className="font-jetbrains text-[11px] uppercase tracking-[0.2em] text-[#2CFF05]">
            Radar
          </p>
          <h1 className="mt-3 font-monroe text-[clamp(34px,6vw,56px)] font-light leading-[1.05] text-[#EAEAEA]">
            What I&apos;m watching
          </h1>
          <p className="mt-3 max-w-2xl font-monroe text-[16px] text-[#7F7F7F]">
            Curated open source and AI projects worth a founder&apos;s time —
            scannable, opinionated, no noise.
          </p>
        </header>

        {/* Sticky toolbar */}
        <div className="sticky top-14 z-40 -mx-4 border-y border-[#1F1F1F] bg-[#0A0A0A]/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 md:top-16 md:-mx-0 md:rounded-2xl md:border md:px-4">
          <div className="flex flex-col gap-3">
            <label className="block">
              <span className="sr-only">Search projects</span>
              <input
                type="search"
                value={query}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search name, tags, tech…"
                className="w-full rounded-xl border border-[#1F1F1F] bg-[#111111] px-4 py-2.5 font-monroe text-[15px] text-[#EAEAEA] outline-none ring-0 placeholder:text-[#7F7F7F] focus:border-[#2CFF05]/50"
              />
            </label>

            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {chips.map((chip) => {
                const active = isChipActive(chip);
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => {
                      if (chip.kind === "sort" && chip.sort) applySort(chip.sort);
                      else if (chip.filter) {
                        if (filter === chip.filter) applyFilter("all");
                        else applyFilter(chip.filter);
                      }
                    }}
                    className={
                      active
                        ? "shrink-0 rounded-full border border-[#2CFF05] bg-[#2CFF05]/10 px-3 py-1.5 font-jetbrains text-[10px] uppercase tracking-[0.12em] text-[#2CFF05]"
                        : "shrink-0 rounded-full border border-[#1F1F1F] px-3 py-1.5 font-jetbrains text-[10px] uppercase tracking-[0.12em] text-[#9A9A9A] transition hover:border-[#2CFF05]/40 hover:text-[#EAEAEA]"
                    }
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#7F7F7F]">
              <span>
                {filtered.length} project{filtered.length === 1 ? "" : "s"}
                {isPending ? " · updating…" : ""}
              </span>
              {totalPages > 1 ? (
                <span>
                  Page {safePage} / {totalPages}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <section
          className={`mt-6 space-y-4 transition-opacity ${isPending ? "opacity-60" : "opacity-100"}`}
          aria-live="polite"
        >
          {projects.length === 0 ? (
            <EmptyState
              title="Nothing published yet"
              body="Radar projects will show up here once the first day file lands."
            />
          ) : pageItems.length === 0 ? (
            <EmptyState
              title="No matches"
              body="Try another search or clear filters."
              action={
                query || filter !== "all"
                  ? {
                      label: "Clear filters",
                      onClick: () => {
                        setQuery("");
                        setFilter("all");
                        setSort("latest");
                        setPage(1);
                      },
                    }
                  : undefined
              }
            />
          ) : (
            pageItems.map((project) => (
              <RadarProjectCard key={project.slug} project={project} />
            ))
          )}
        </section>

        {totalPages > 1 && pageItems.length > 0 ? (
          <nav
            className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#1F1F1F] pt-6 font-jetbrains text-[12px] uppercase tracking-[0.14em]"
            aria-label="Pagination"
          >
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="text-[#9A9A9A] transition hover:text-[#2CFF05] disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>
            <span className="text-[#7F7F7F]">
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="text-[#9A9A9A] transition hover:text-[#2CFF05] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </nav>
        ) : null}
      </div>
    </div>
  );
}

function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#1F1F1F] bg-[#111111] px-6 py-14 text-center">
      <p className="font-monroe text-[20px] text-[#EAEAEA]">{title}</p>
      <p className="mt-2 font-monroe text-[15px] text-[#7F7F7F]">{body}</p>
      {action ? (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-5 font-jetbrains text-[12px] uppercase tracking-[0.14em] text-[#2CFF05]"
        >
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
