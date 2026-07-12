# Radar — how it works

Curated daily picks of open source projects and AI updates worth sharing.  
Not a dump of everything trending — only 1–5 items per day with a short human take.

Live URLs:

| Locale | Index | Day page |
|--------|--------|----------|
| English | `/radar` | `/radar/YYYY-MM-DD` |
| Farsi (RTL) | `/fa/radar` | `/fa/radar/YYYY-MM-DD` |

Canonical domain: `https://nimaaksoy.com`

---

## Goals

1. Highlight **only** things worth a founder/builder’s time.
2. Keep Nima’s voice (short take, not a scrape).
3. Store content in GitHub so Hermes (or anyone) can add days via PR.
4. Make social sharing easy: each day has EN + FA captions for X and LinkedIn.
5. Flow: **add content → site deploys → share day page on social** (link back to site).

---

## Cadence & quality bar

- **1–5 items per day** (skip the day if nothing is worth it).
- Prefer: useful tools, strong launches, real momentum, things you’d actually try.
- Avoid: pure hype, duplicate topics within ~24h, empty “top 10” lists, copy-paste from Trendshift/HuggingNews without a take.
- Each item needs an original 1-line take in **English and Farsi**.

Sources to scan (not auto-publish):

- [Trendshift](https://trendshift.io/) — rising GitHub repos
- [HuggingNews](https://huggingnews.com/) — AI news wire
- GitHub / X / HN when something real is moving

---

## Content storage

Path: `content/radar/YYYY-MM-DD.json`

One file = one day. Filenames must be ISO dates (`2026-07-12.json`).

### Schema

```json
{
  "date": "2026-07-12",
  "items": [
    {
      "slug": "opencut",
      "name": "OpenCut",
      "url": "https://github.com/OpenCut-app/OpenCut",
      "tags": ["video", "opensource"],
      "starsGained": 370,
      "take": {
        "en": "open-source CapCut alternative — actually usable",
        "fa": "جایگزین متن‌باز کپ‌کات — واقعاً قابل استفاده"
      },
      "source": "github"
    }
  ],
  "social": {
    "x": {
      "en": "Today on my radar — open source finds worth your time:\n\n• …\n\nhttps://nimaaksoy.com/radar/2026-07-12",
      "fa": "امروز روی رادارم — چند پروژه متن‌باز که ارزش دیدن دارن:\n\n• …\n\nhttps://nimaaksoy.com/fa/radar/2026-07-12"
    },
    "linkedin": {
      "en": "… longer professional caption …\n\nhttps://nimaaksoy.com/radar/2026-07-12",
      "fa": "…\n\nhttps://nimaaksoy.com/fa/radar/2026-07-12"
    }
  }
}
```

### Field notes

| Field | Required | Notes |
|-------|----------|--------|
| `date` | yes | Must match filename |
| `items[].slug` | yes | kebab-case, unique within the day |
| `items[].name` | yes | Display name |
| `items[].url` | yes | Prefer project homepage or GitHub |
| `items[].tags` | no | Short lowercase tags |
| `items[].starsGained` | no | Optional momentum hint |
| `items[].take.en` / `take.fa` | yes | One line, original voice |
| `items[].source` | no | e.g. `github`, `huggingnews` |
| `social.x` / `social.linkedin` | yes | EN + FA captions; always include day URL |

---

## Code map

| Path | Role |
|------|------|
| `content/radar/*.json` | Day content |
| `lib/radar.ts` | Load + sort days, types |
| `components/radar/*` | Shared UI (chrome, day view, share) |
| `app/radar/page.tsx` | EN index |
| `app/radar/[date]/page.tsx` | EN day |
| `app/fa/layout.tsx` | Farsi RTL + font |
| `app/fa/radar/*` | FA routes |
| `app/sitemap.ts` | Includes radar URLs |
| Footer on `app/page.tsx` | Link to `/radar` |

No database. Content is read from the filesystem at build/request time.

---

## How to add a new day (Hermes / human)

1. Scan sources; pick **1–5** items only.
2. Create `content/radar/YYYY-MM-DD.json` with EN + FA takes and social captions.
3. Captions must link to:
   - EN social → `https://nimaaksoy.com/radar/YYYY-MM-DD`
   - FA social → `https://nimaaksoy.com/fa/radar/YYYY-MM-DD`
4. Open a PR (or push to the working branch). Vercel/CI deploys on merge to `main`.
5. After deploy, open the day page → use **Share** (X / LinkedIn / copy caption).

Optional checklist before merge:

- [ ] 1–5 items only  
- [ ] Takes are original (not scraped blurbs)  
- [ ] Farsi is natural (روان و خودمونی), not machine-stiff  
- [ ] Social captions include the correct day URL  
- [ ] `npm run build` passes  

---

## SEO rules (avoid thin content)

**Do**

- Original takes on every item  
- Stable day URLs  
- Link from homepage footer → `/radar`  
- Share day pages on social (real traffic + signals)

**Don’t**

- Auto-mirror Trendshift/HuggingNews with no filter  
- Post 20+ empty link cards  
- Duplicate the same item across many days without new angle  

Radar supports brand + social; it is not the main SEO engine of the site.

---

## Social flow

```
Hermes/human writes day JSON
        ↓
PR → merge → deploy (Vercel)
        ↓
Day page live (/radar/DATE and /fa/radar/DATE)
        ↓
Share buttons / captions → X + LinkedIn
        ↓
Clicks land on the site
```

X intent URL is prefilled with the caption.  
LinkedIn share uses the day URL (LinkedIn often strips prefilled text); full caption is always one-click copyable on the page.

---

## Design tokens (match site)

- Background `#0A0A0A` / cards `#111111`
- Text `#EAEAEA` / secondary `#9A9A9A` / muted `#7F7F7F`
- Border `#1F1F1F`
- Accent `#2CFF05`
- Fonts: Manrope (EN), Vazirmatn (FA), JetBrains Mono (labels)

---

## Changing this system later

If you change URLs, schema, or cadence:

1. Update this file first (`docs/RADAR.md`).
2. Update `lib/radar.ts` types + loaders.
3. Update pages/components.
4. Migrate existing JSON files if the schema breaks.
5. Refresh sitemap if route patterns change.

Last updated: 2026-07-12
