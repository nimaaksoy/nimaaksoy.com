# nimaaksoy.com

Official source code for [nimaaksoy.com](https://nimaaksoy.com).

## Overview

This is a personal site focused on:
- Intro / hero
- Current projects
- How I think
- Writing and presence
- Contact
- Private tools page
- Radar (`/radar`) — curated open source & AI finds

The design direction is minimal, dark, and content-first, with subtle green accents.

Radar docs: [`docs/RADAR.md`](./docs/RADAR.md)  
Radar video workflow: [`docs/RADAR-VIDEO-WORKFLOW.md`](./docs/RADAR-VIDEO-WORKFLOW.md)

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Tabler Icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev     # Start development server
npm run build   # Production build
npm run start   # Run production server
npm run lint    # Lint project
```

## Project Structure

```text
app/
  layout.tsx
  page.tsx
  not-found.tsx
  robots.ts
  sitemap.ts
  tools/page.tsx
  radar/         # /radar + /radar/[slug]
components/
  radar/
content/radar/   # daily JSON (YYYY-MM-DD.json), flattened in UI
docs/RADAR.md                 # how Radar works
docs/RADAR-VIDEO-WORKFLOW.md  # how Radar social videos are made
lib/
public/
```

## SEO

The app includes:
- Open Graph metadata
- Twitter metadata
- `robots.txt` route
- `sitemap.xml` route
- Favicon and touch icons
- Custom OG image in `public/og-image.png`

## Deployment

This project is ready to deploy on a Linux server (for example, DigitalOcean) using:
- Node.js runtime
- `npm run build`
- `npm run start`

If you use a reverse proxy (Nginx/Caddy), point it to the app port and enable HTTPS.

## Notes

- Media assets (images/videos) are stored in `public/`.
- Update links/content in `app/page.tsx` and `app/tools/page.tsx`.

## License

This project is **source-available**, not traditional open source.

**You may:**

- View the source code
- Clone and run it locally for personal or educational use
- Learn from it and experiment privately

**You may not:**

- Use it commercially (including selling, hosting for money, or putting any part of it into a commercial product or SaaS)
- Use my name, logo, or branding without written permission

**Companies** that want commercial rights must contact me for a separate commercial license: [me@nimaaksoy.com](mailto:me@nimaaksoy.com).

Full legal terms: [`LICENSE`](./LICENSE) — [PolyForm Noncommercial License 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0) (SPDX: `PolyForm-Noncommercial-1.0.0`).

### GitHub license label

GitHub’s license badge mainly highlights common OSI-approved open-source licenses. PolyForm Noncommercial is a standard **source-available** license (on the [SPDX list](https://spdx.org/licenses/PolyForm-Noncommercial-1.0.0.html)), but GitHub may show **no license badge**, **Other**, or only the SPDX name — not “Open Source.” That is expected: this repo is intentionally **not** OSI open source. The `LICENSE` file and this section are the source of truth.
