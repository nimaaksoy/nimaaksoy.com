# nimaaksoy.com

Source code for my personal website and a growing collection of experiments, tools, and ideas.

**Website:** [https://nimaaksoy.com](https://nimaaksoy.com)

This repository is where I build in public. Some projects become standalone products, some stay as experiments, and others are simply things I wanted to learn.

---

## Projects

- **Radar** — Curated AI & open-source discoveries -> [nimaaksoy.com/radar](https://nimaaksoy.com/radar)
- **Prompts** — Public prompt library -> [nimaaksoy.com/prompts](https://nimaaksoy.com/prompts)
- **Skills** — Reusable AI skills -> [nimaaksoy.com/skills](https://nimaaksoy.com/skills)
- **Chrome extensions** — Small tools for everyday use -> [`chrome-extension/`](./chrome-extension/)
- **Life in Dots** — Life timeline as a web app + new-tab extension -> [nimaaksoy.com/life-in-dots](https://nimaaksoy.com/life-in-dots)
- **Experiments** — UI, UX, AI, and web ideas that may grow into products
- **More tools** coming soon

---

## What's inside

### Radar

A curated collection of AI products, open-source projects, and developer tools that are actually worth your time.

Instead of reposting trends, Radar explains what a project does, why it matters, and when it's worth trying.

**Live:** [https://nimaaksoy.com/radar](https://nimaaksoy.com/radar)

**Documentation:**

- [docs/RADAR.md](./docs/RADAR.md) — how Radar works and how content is stored
- [docs/RADAR-VIDEO-WORKFLOW.md](./docs/RADAR-VIDEO-WORKFLOW.md) — how Radar social videos are made

---

### Prompts

A public collection of useful prompts discovered and contributed by people.

Prompt files live in `content/prompts/`. Files beginning with `_` and
`content/prompts/CONTRIBUTING.md` are ignored by the prompt loader. Use
`content/prompts/_template.md` for new submissions.

**Copy counts.** PostHog `copy_prompt` events are the source of truth — the same
data the Stats page reports. Counts are read from PostHog (365-day window,
cached in-process) so they survive deploys and ephemeral disks.

A server-side JSON file acts as the fallback when PostHog is not configured (for
example local development). It writes to
`/tmp/nimaaksoy-prompt-copy-counts.json`, or to `PROMPT_COPY_COUNTS_FILE` if set.
The two sources are merged with `max`, never summed, since both count the same
click. If neither is available, copying still works and the button simply shows
the count it already had.

Because PostHog needs a moment to make a new event queryable, the button credits
a copy immediately and only ever revises the number upward — a refetch cannot
roll back a count the visitor just incremented.

---

### Skills

Reusable AI skills live in `skills/` and are published at
[nimaaksoy.com/skills](https://nimaaksoy.com/skills). Generated indexes and ZIP
downloads are written to `public/skills-data/`.

```bash
npm run skills:validate
npm run skills:build-index
npm run skills:new
```

Hermes maintenance instructions live in
[`docs/SKILLS-HERMES.md`](./docs/SKILLS-HERMES.md).

---

### Stats

Public site analytics live at [nimaaksoy.com/stats](https://nimaaksoy.com/stats).
The page is powered by PostHog when these production environment variables are set:

```bash
POSTHOG_KEY=phc_...
POSTHOG_PROJECT_ID=...
POSTHOG_PERSONAL_KEY=phx_...
POSTHOG_UI_HOST=https://us.posthog.com
POSTHOG_SITE_HOST=nimaaksoy.com
```

`/analytics.js` loads PostHog from the site origin, `/ph/*` proxies PostHog
ingest/assets, and `/stats` queries aggregate data server-side. Without
credentials, the page renders a setup state instead of failing.

The page is never allowed to wait on PostHog:

- It is rendered with `revalidate = 120`, so visitors get a cached page that is
  refreshed in the background rather than a live query per request.
- The panels sit behind `<Suspense>`, so the page shell and headings paint
  immediately and the numbers stream in when the query resolves.
- `lib/site-analytics.ts` caches results in-process and serves stale data while
  refreshing. Concurrent requests share one query instead of each firing their
  own, queries time out at 6s, and a failed refresh keeps the last good numbers
  and retries after 20s instead of blanking the page for a full cache window.

---

### Sponsor Checkout

Sponsor checkout uses Stripe Checkout and signed Cloudinary uploads for sponsor
logos. Set these environment variables locally and in Vercel:

```bash
NEXT_PUBLIC_APP_URL=https://nimaaksoy.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SPONSOR_PRICE_1_MONTH=price_...
STRIPE_SPONSOR_PRICE_3_MONTHS=price_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_SPONSOR_FOLDER=nimaaksoy/sponsors
```

Cloudinary's single URL format also works instead of the three separate
Cloudinary credentials:

```bash
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

---

### Chrome extensions

Small browser extensions built to solve everyday problems.

Current code lives under:

```text
chrome-extension/
  life-in-dots/     # new-tab life timeline (store-ready package)
```

---

### Life in Dots

A quiet life-timeline experiment: years, months, days, and hours as dots — on the site and as a Chrome new-tab extension.

**Live:** [https://nimaaksoy.com/life-in-dots](https://nimaaksoy.com/life-in-dots)

---

### Experiments

You'll find small projects, UI ideas, prototypes, and features that may eventually become standalone products.

Some experiments stay here.
Some become products.
Some fail — and that's okay.

---

## Tech stack

- Next.js 16 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Tabler Icons

---

## Run locally

```bash
git clone https://github.com/nimaaksoy/nimaaksoy.com.git
cd nimaaksoy.com
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # run production server
npm run lint    # lint
npm run prompts:validate # validate prompt Markdown files
```

---

## Project structure

```text
app/                  Website pages (home, radar, tools, life-in-dots, prompts, ...)
components/           Shared UI components
content/              Radar day JSON, prompt Markdown, and other content
docs/                 Documentation (Radar, video workflow)
lib/                  Shared utilities and loaders
public/               Images, icons, assets
chrome-extension/     Browser extensions
scripts/              Helper scripts
```

### Navigation

`components/SiteChrome.tsx` owns the shared navbar and footer for every page and
is the single place navigation items are defined. It renders the full inline nav
from `md` up; below that, `components/MobileNav.tsx` shows a hamburger that opens
the same items as a drop-down panel.

The panel is rendered into `<body>` with a portal on purpose: the fixed navbar
sets `backdrop-blur`, which makes it the containing block for fixed-position
descendants and would otherwise collapse the full-screen overlay to zero height.

---

## Philosophy

I like building small things.

Many of them start as weekend experiments.

Some become products.

Others simply teach me something new.

This repository is my playground for trying ideas, learning, and sharing what works.

---

## Contributing

Bug reports, suggestions, and pull requests are welcome.

If you're planning a larger change, open an issue first so we can discuss the idea.

For prompt submissions, start with [`content/prompts/CONTRIBUTING.md`](./content/prompts/CONTRIBUTING.md).

---

## License

This project is **source-available** under the [PolyForm Noncommercial License 1.0.0](https://polyformproject.org/licenses/noncommercial-1.0.0) — not traditional open source.

You're welcome to:

- Learn from the code
- Run it locally
- Build on the ideas
- Experiment with it personally or for education

**Not allowed** without written permission:

- Commercial use
- Selling, hosting for money, or putting any part of this into a commercial product or SaaS
- Using my name, logo, or branding

Companies that need commercial rights: [me@nimaaksoy.com](mailto:me@nimaaksoy.com).

Website content, branding, writing, images, and logos remain my intellectual property unless stated otherwise.

Full terms: [`LICENSE`](./LICENSE) (SPDX: `PolyForm-Noncommercial-1.0.0`).

GitHub may not show a classic open-source license badge for this — that's expected for source-available licenses. The `LICENSE` file is the source of truth.

---

Made by [Nima Aksoy](https://nimaaksoy.com)
