# nimaaksoy.com

Source code for my personal website and a growing collection of experiments, tools, and ideas.

**Website:** [https://nimaaksoy.com](https://nimaaksoy.com)

This repository is where I build in public. Some projects become standalone products, some stay as experiments, and others are simply things I wanted to learn.

---

## Projects

- **Radar** — Curated AI & open-source discoveries -> [nimaaksoy.com/radar](https://nimaaksoy.com/radar)
- **Prompts** — Public prompt library -> [nimaaksoy.com/prompts](https://nimaaksoy.com/prompts)
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

Copy counts use the simplest built-in adapter: a server-side JSON file. In
development it writes to `/tmp/nimaaksoy-prompt-copy-counts.json`. For
production, set `PROMPT_COPY_COUNTS_FILE` to a writable path on persistent
storage. If that file is unavailable, copying still works and the UI falls back
gracefully.

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
