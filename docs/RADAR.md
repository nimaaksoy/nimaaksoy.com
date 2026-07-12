# Radar — how it works

Curated signal page for AI + open source finds that are **worth a founder’s time**.  
Inspired by dense value feeds like Perplexity Discover: short hook, clear “why it matters”, source, image when useful, shareable item URL.

This page must stay **pure value**. No noise. No public social caption dumps.

Canonical domain: `https://nimaaksoy.com`

| Locale | Index | Day | Item |
|--------|--------|-----|------|
| English | `/radar` | `/radar/YYYY-MM-DD` | `/radar/YYYY-MM-DD/slug` |
| Farsi (RTL) | `/fa/radar` | `/fa/radar/YYYY-MM-DD` | `/fa/radar/YYYY-MM-DD/slug` |

---

## What Radar is (and is not)

**Is**
- A human filter for important / useful AI + OSS signals
- Each item strong enough to share alone
- Short hook + expandable **why it matters** (or what actually changed)

**Is not**
- A dump of everything trending
- A daily “top AI news of the world” wire by default
- Public caption drafts for social

Does it always pick *the single most important AI update of the day*?  
**No.** It picks **1–5 things worth sharing that day** (product update, OSS breakthrough, real capability shift). Sometimes that includes major AI news. Sometimes a quieter tool matters more for builders.

Internal cadence (never show this on the public UI): **1–5/day**, skip the day if nothing is worth it.

---

## Page UX (pure value)

1. **Hook** (`take`) — one short line
2. **Toggle: Why it matters** (`why`) — only value: why this pick matters, or what new/important update landed. No fluff.
3. **Source link** — original repo / product / announcement
4. **Image** when available (OG image, product shot, paper figure)
5. **Share on each item** — buttons open X/LinkedIn with the **saved human caption** + item URL  
6. **Captions exist, but stay off the page** — stored in JSON only, used by share intents / copy post. Never rendered as visible page text.

Item pages are the share targets (Discover-style deep links).

---

## Content storage

Path: `content/radar/YYYY-MM-DD.json`

### Schema

```json
{
  "date": "2026-07-12",
  "items": [
    {
      "slug": "opencut",
      "name": "OpenCut",
      "url": "https://github.com/OpenCut-app/OpenCut",
      "image": "https://opengraph.githubassets.com/1/OpenCut-app/OpenCut",
      "tags": ["video", "opensource"],
      "take": {
        "en": "Open source CapCut alternative people are actually shipping with.",
        "fa": "جایگزین متن‌باز کپ‌کات که واقعاً باهاش کار می‌کنن."
      },
      "why": {
        "en": "Why this matters or what changed. Pure value only. 2–5 short sentences.",
        "fa": "چرا مهمه یا چی عوض شده. فقط ارزش. چند جمله کوتاه."
      },
      "share": {
        "x": {
          "en": "human caption for X. ends with item url.\n\nhttps://nimaaksoy.com/radar/2026-07-12/opencut",
          "fa": "کپشن انسانی برای X با لینک آیتم.\n\nhttps://nimaaksoy.com/fa/radar/2026-07-12/opencut"
        },
        "linkedin": {
          "en": "human caption for LinkedIn.\n\nhttps://nimaaksoy.com/radar/2026-07-12/opencut",
          "fa": "کپشن انسانی برای لینکدین.\n\nhttps://nimaaksoy.com/fa/radar/2026-07-12/opencut"
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
| `items[].slug` | yes | kebab-case, unique per day |
| `items[].name` | yes | Display name |
| `items[].url` | yes | Source of truth (repo/product/post) |
| `items[].image` | preferred | OG image or product image URL |
| `items[].take` | yes | Short hook EN+FA (shown) |
| `items[].why` | yes | Why it matters / what changed EN+FA (toggle) |
| `items[].share.x` / `share.linkedin` | yes | Human captions EN+FA for share intents only (hidden on page) |
| `items[].tags` | no | Short tags |

---

## Voice

Human, easy words. Casual Farsi (روان و خودمونی).

**Do**
- Plain sentences
- Explain the real update or reason it matters
- Prefer concrete change over hype
- Farsi: start every sentence with Persian words (never English first — breaks RTL)
- Farsi: put English product names later in the sentence, or use Persian spelling (کلیبری / اپن‌کات)
- Farsi: avoid mid-sentence English tech words when a Persian phrase works

**Don’t**
- Bullet catalogs, colon lists, em-dash list glue
- Bookish EN/FA
- Public caption blocks on the webpage
- Thin scrapes with no “why”
- Farsi captions that begin with `Colibri` / `OpenCut` / `UI Skills` etc.

### Social image

Each item page generates its own Open Graph image at:
- `/radar/DATE/slug/opengraph-image`
- `/fa/radar/DATE/slug/opengraph-image`

X/LinkedIn should pick this card image from the site (not broken external GitHub OG).

---

## How to add a day

1. Scan Trendshift, HuggingNews, GitHub/X for real signal.
2. Keep only items that are share-worthy alone.
3. Write `take` + `why` (EN+FA). Prefer `image`.
4. Save `content/radar/YYYY-MM-DD.json`.
5. PR → merge → Vercel deploy.
6. Share **item URLs**, not caption drafts from the site.

Checklist:

- [ ] 1–5 items or skip day  
- [ ] Each item has `why` with real value  
- [ ] Image when possible  
- [ ] Human voice EN+FA  
- [ ] `npm run build` passes  

---

## Code map

| Path | Role |
|------|------|
| `content/radar/*.json` | Day content |
| `lib/radar.ts` / `lib/radar-shared.ts` | Loaders + paths |
| `components/radar/RadarItemCard.tsx` | List card + why toggle + share |
| `components/radar/RadarItemView.tsx` | Item page |
| `app/radar/**` | EN routes |
| `app/fa/radar/**` | FA routes |
| `docs/RADAR.md` | This file |

---

## SEO

Item pages with original `why` text + images help.  
Scraped link dumps without `why` are thin content. Do not ship those.

Last updated: 2026-07-12
