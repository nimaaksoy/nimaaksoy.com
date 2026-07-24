# Radar — how it works

Curated signal page for AI + open source finds that are **worth a founder’s time**.  
Dense value feed: short explanation, clear “why it matters”, verdict and capability badges when known, source links, image when useful.

This page must stay **pure value**. No noise. No public social caption dumps.  
**Do not** paste GitHub descriptions or README sections onto the page.

Canonical domain: `https://nimaaksoy.com`

| Locale | Index | Item |
|--------|--------|------|
| English only | `/radar` | `/radar/{slug}` |

Farsi routes were removed. Historical JSON may still contain `fa` strings; the UI only renders English.

---

## What Radar is (and is not)

**Is**
- A human filter for important / useful AI + OSS signals
- Flat project feed (up to 50 per page), newest first
- Each item strong enough to share alone
- Short explanation + expandable “why it matters” + optional richer sections

**Is not**
- A dump of everything trending
- Day-grouped archive UI (storage may still be one JSON file per day)
- Public caption drafts for social

Internal cadence (never show this on the public UI): **1–5/day** is fine; skip the day if nothing is worth it. Day files may hold up to **10** items if needed.

---

## Page UX

### Main feed (`/radar`)
- Horizontal cards: ~30% image / 70% content on desktop; stacked on mobile
- Image uses `object-contain` (no crop of logos/screenshots); fallback SVG when missing
- Sticky toolbar: sort/filter chips that only appear when data exists, plus search
- Pagination at 50 projects per page
- Expandable explanation; separate collapsible “why it matters” when it adds signal

### Item page (`/radar/{slug}`)
- Not an enlarged list card
- Sections only when content exists: explanation, why it matters, how it works, what makes it different, trending, capabilities, similar tools
- Verdict + Demo/API/MCP badges
- Source + share intents

### Share
- Buttons open X/LinkedIn with the **saved human caption** + item URL  
- Captions stay off the page (JSON only)

---

## Content storage

Path: `content/radar/YYYY-MM-DD.json`  
The loader flattens all days into projects sorted by date (newest first).  
**Slug must be unique across all days.**

### Schema

```json
{
  "date": "2026-07-24",
  "items": [
    {
      "slug": "firecrawl",
      "name": "Firecrawl",
      "url": "https://github.com/firecrawl/firecrawl",
      "image": "https://opengraph.githubassets.com/1/firecrawl/firecrawl",
      "tags": ["web-scraping", "agents", "api", "mcp"],
      "stars": 78000,
      "starsGained": 420,
      "verdict": "must-watch",
      "hasDemo": true,
      "hasApi": true,
      "hasMcp": true,
      "trending": ["Agent + MCP install path"],
      "similar": [
        { "name": "Page Agent", "slug": "page-agent" },
        { "name": "Browserbase", "url": "https://www.browserbase.com" }
      ],
      "take": {
        "en": "Short scannable explanation (what it is / does).",
        "fa": "kept for historical files; UI is English-only"
      },
      "why": {
        "en": "Why this pick matters. Pure value. Not a repeat of take.",
        "fa": "..."
      },
      "explanation": {
        "en": "Optional longer explanation for the detail page.",
        "fa": "..."
      },
      "howItWorks": {
        "en": "Optional: how it works.",
        "fa": "..."
      },
      "different": {
        "en": "Optional: what makes it different.",
        "fa": "..."
      },
      "share": {
        "x": {
          "en": "human caption for X. ends with item url.\n\nhttps://nimaaksoy.com/radar/firecrawl",
          "fa": "..."
        },
        "linkedin": {
          "en": "human caption for LinkedIn.\n\nhttps://nimaaksoy.com/radar/firecrawl",
          "fa": "..."
        }
      },
      "source": "github"
    }
  ]
}
```

`share` captions power the share buttons. **Do not render them on the webpage.**

### Field notes

| Field | Required | Notes |
|-------|----------|--------|
| `date` | yes | Matches filename |
| `items[].slug` | yes | kebab-case, **globally unique** |
| `items[].name` | yes | Display name |
| `items[].url` | yes | Source of truth (repo/product/post) |
| `items[].image` | preferred | OG image or product image URL |
| `items[].take` | yes | Short explanation EN+FA (EN shown) |
| `items[].why` | yes | Why it matters EN+FA (EN shown) |
| `items[].explanation` | no | Longer explanation for detail |
| `items[].howItWorks` | no | How it works |
| `items[].different` | no | What makes it different |
| `items[].verdict` | no | `must-watch` \| `worth-testing` \| `worth-sharing` \| `interesting` \| `skip` |
| `items[].hasDemo` / `hasApi` / `hasMcp` | no | boolean capability flags |
| `items[].stars` / `starsGained` | no | Star metrics when known |
| `items[].trending` | no | Short signal labels |
| `items[].similar` | no | `{ name, url?, slug? }[]` |
| `items[].share.x` / `share.linkedin` | yes | Human captions EN+FA (hidden on page) |
| `items[].tags` | no | Short tags / tech |

**Reference item with full fields:** `content/radar/2026-07-24.json` → Firecrawl.  
Existing items may leave optional fields empty; fill them over time.

---

## Voice

Human, easy words. UI is English-only.

**Do**
- Plain sentences
- Explain the real update or reason it matters
- Prefer concrete change over hype
- No repeated copy across `take` / `why` / `explanation`

**Don’t**
- Bullet catalogs, colon lists, em-dash list glue
- Public caption blocks on the webpage
- Thin scrapes with no “why”
- Pasted README or GitHub about text

### Social image

Each item page generates its own Open Graph image at:
- `/radar/{slug}/opengraph-image`

---

## How to add a project

1. Scan Trendshift, HuggingNews, GitHub/X for real signal.
2. Keep only items that are share-worthy alone.
3. Write `take` + `why` (EN required in `en`; keep `fa` non-empty for schema). Prefer optional full fields when you know them.
4. Prefer unique `slug`, image, and share URLs pointing at `https://nimaaksoy.com/radar/{slug}`.
5. Save under `content/radar/YYYY-MM-DD.json` (new day or append to day).
6. PR → merge → deploy.
7. Share **item URLs**, not caption drafts from the site.

Checklist:

- [ ] 1–5 items or skip day  
- [ ] Globally unique slug  
- [ ] Each item has `why` with real value  
- [ ] Image when possible  
- [ ] Share captions use `/radar/{slug}`  
- [ ] `npm run build` passes  

---

## Code map

| Path | Role |
|------|------|
| `content/radar/*.json` | Day content (flattened at load) |
| `lib/radar.ts` / `lib/radar-shared.ts` | Loaders + paths + types |
| `components/radar/RadarFeed.tsx` | Index feed + sticky toolbar |
| `components/radar/RadarProjectCard.tsx` | Horizontal list card |
| `components/radar/RadarProjectView.tsx` | Item detail page |
| `app/radar/**` | Routes |
| `docs/RADAR.md` | This file |

---

## SEO

Item pages with original text + images help.  
Scraped link dumps without `why` are thin content. Do not ship those.

Last updated: 2026-07-24
