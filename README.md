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

The design direction is minimal, dark, and content-first, with subtle green accents.

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
components/
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
