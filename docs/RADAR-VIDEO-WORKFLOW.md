# Radar Video Workflow

How we turn a selected [Radar](https://nimaaksoy.com/radar) project into a short social explainer video.

This document describes the **real current system**: content lives in this repository; video automation lives in a separate project on the production machine. Do not invent tools that are not listed here.

| Piece | Location |
|-------|----------|
| Radar product + day JSON | This repo (`nimaaksoy.com`) |
| Radar product docs | [`docs/RADAR.md`](./RADAR.md) |
| Video pipeline (render, TTS, record) | `/home/nima/ai-home/radar-video` (not in this git repo) |

### Naming (do not mix)

| Layer | Name | Example |
|-------|------|---------|
| **Day file** | Editorial batch for one calendar day | `content/radar/2026-07-25.json` |
| **Slug** | One product’s identity (site + video) | `ego-lite` |
| **Live URL** | Share and item page | `https://nimaaksoy.com/radar/ego-lite` |
| **Video command** | Pipeline argument | `./scripts/run_job.sh ego-lite` |
| **Video job / output** | Working dir + MP4 | `jobs/ego-lite/`, `…/ego-lite/…-ego-lite-radar.mp4` |

Wrong: treat `2026-07-25.json` as the video name.  
Right: item **`ego-lite`** lives **inside** that day file; every video step uses **`ego-lite`**.

Hermes operators: the skill `nimaaksoy-radar` encodes the same table — keep skill + this doc in sync.

---

## Purpose

Radar is a human filter for AI and open source finds that are worth a founder’s time. A **Radar video** is a short, narrated walkthrough of one item so people can understand the product in under a minute without reading the full page.

We make a video when an item is strong enough to stand alone:

- Clear product shape (not a vague “cool repo”)
- Real “why it matters” signal
- Something to **show** (public site, demo, docs, or GitHub presence)
- Prefer full video fields: `explanation`, `howItWorks`, `different`, `verdict`, and ideally `homepage`

Skip video for thin picks, pure link dumps, or items with no public surface to film.

**Goal of the cut:** hook → what it is → how it works on a real screen → social proof → Radar call → link people to `https://nimaaksoy.com/radar/{slug}`.

---

## Video format

Configured in `radar-video/config/settings.yaml` and the Hyperframes open/close template.

| Spec | Value |
|------|--------|
| Resolution | **1920×1080** |
| Aspect ratio | **16:9 landscape** |
| Frame rate | **30 fps** |
| Codec | H.264 video (`libx264`) + AAC audio, `yuv420p` |
| Target length | ~**40–90 s** typical (config target 90 s; hard max **180 s**) |
| Narration | ~**120–150 words**, TTS target ≤ **~60 s** of speech |
| Captions | Burned-in **single-line** subtitles (white text, lower third) |

### Visual style

Matches the site’s Radar look:

- Dark background (`#0a0c0f`), soft green radial accents
- Accent green `#22c55e`
- Muted body text `#9aa3ad`
- System / Inter-style sans for title cards
- Open and close cards use kicker **“RADAR”** and footer **`nimaaksoy.com/radar`**
- Mid-scene browser footage is cropped toward useful UI (avoid empty footers)
- Small lower-third labels on some scenes (e.g. `URL → Scrape`, star counts)

### Branding rules

- Use the product’s real name and URLs from Radar JSON
- Do **not** rebrand the product as “nimaaksoy”
- Close card shows the **call only** (e.g. **Must watch**) — never the spoken or on-screen word **“verdict”**
- Name, logo, and personal branding on the site stay under the project license; do not use them for commercial third-party videos without permission (see repo `LICENSE`)

### Platforms

Primary output is a **16:9 horizontal MP4**, suited for:

- **X** and **LinkedIn** (upload as video or attach to the share caption)
- **YouTube** (standard landscape; not currently rendered as vertical Shorts)
- Optional later reframe for Instagram Reels / Shorts (not automated today)

Delivery after a successful run: quality-checked file under `radar-video/output/…`, with optional **Telegram** notify via Hermes.

---

## Content structure

Scene order comes from the **deterministic planner** in `radar-video/scripts/radar_video/stages_plan.py`. There are two plan shapes.

### Generic product (most items)

Example: **ego lite** (~6 scenes, ~43 s planned).

| # | Role | Type | ~Duration | What you see |
|---|------|------|-----------|--------------|
| 1 | Open | Graphic | 4 s | Radar title card: name + take |
| 2 | Workflow | Browser | 10 s | Product homepage / CTA (input→action style demo) |
| 3 | Result | Browser | 10 s | Docs or product detail (“how it works”) |
| 4 | Options | Browser | 8 s | Feature depth (no footer scrolling) |
| 5 | Proof | Browser | 7 s | GitHub header / stars |
| 6 | Close | Graphic | 4 s | Call (e.g. Must watch) + take line + stats |

### Firecrawl special case

When slug/name/URLs look like Firecrawl, the planner uses a **playground workflow** (~8 scenes): open → scrape URL → Markdown/JSON result → Search/Crawl/Map → API docs → MCP docs → GitHub → close.

### Narration arc (spoken)

1. **Name + take** (hook)
2. **Why / how / different** in plain language
3. **Badges** if present (demo / API / MCP)
4. **Stars** if known
5. **Call only** — e.g. “Must watch.” not “Verdict: must watch”

Subtitles follow the same script, **one line per cue**.

---

## Source material

### From this repository

| Source | Use |
|--------|-----|
| `content/radar/YYYY-MM-DD.json` | Canonical item: `slug`, `name`, `url`, `take`, `why`, `explanation`, `howItWorks`, `different`, `verdict`, badges, stars, `image`, optional **`homepage`** |
| Live page | `https://nimaaksoy.com/radar/{slug}` after merge/deploy |
| Share captions | For **posting** the finished video on X/LinkedIn (`share.x` / `share.linkedin`); not burned into the video |

### Required fields before the pipeline will load an item

From `radar-video` settings `trigger.require_complete_fields`:

`slug`, `name`, `take`, `explanation`, `why`, `howItWorks`, `different`, `verdict`

Strongly recommended: `homepage`, `stars`, `starsGained`, `hasDemo` / `hasApi` / `hasMcp`, `image`.

### Collected at render time (pipeline)

| Material | How |
|----------|-----|
| Product website / docs / demo | Playwright headless recording of planned URLs |
| GitHub | Recorded repo page (stars / presence) |
| Open / close motion cards | Hyperframes template `templates/radar-style` (GSAP) |
| Fallback cards | ffmpeg `drawtext` if Hyperframes fails |
| Narration audio | xAI TTS via Hermes (`voice_id: sirius`) |
| Captions | Generated SRT from narration, burned in with ffmpeg |
| OG / product images | Used on the **website**, not as the main mid-video track (video prefers live UI) |

The pipeline **does not** paste the GitHub README into the script. Narration is built from Radar EN fields (`take`, `why`, `howItWorks`, `different`, etc.).

---

## Production workflow

End-to-end path from pick to file.

### 1. Select the item

- Choose a Radar-worthy product (see [`RADAR.md`](./RADAR.md)).
- Decide it is video-worthy (demoable + clear value).

### 2. Complete Radar JSON

- Write full EN fields in `content/radar/YYYY-MM-DD.json`.
- Set `homepage` when the marketing site is not the GitHub URL.
- PR → merge → deploy so `https://nimaaksoy.com/radar/{slug}` is live when possible.

### 3. Run the video pipeline

On the machine that has `radar-video`:

```bash
cd /home/nima/ai-home/radar-video
./scripts/run_job.sh <slug>
# re-run everything:
./scripts/run_job.sh <slug> --force
# resume from a stage:
./scripts/run_job.sh <slug> --from-stage record
```

Optional poll for new complete items:

```bash
PYTHONPATH=scripts python3 scripts/radar_video/poll.py --once
```

### 4. Pipeline stages (automatic)

| Stage | What happens |
|-------|----------------|
| `load_source` | Find slug in local Radar day JSON → `jobs/<slug>/source.json` |
| `research` | Probe GitHub + site URLs; prefer `homepage` |
| `plan` | Build scene list + narration → `plan.json`, `narration.txt` |
| `record` | Playwright records browser scenes (workflow required) |
| `tts` | Hermes xAI TTS → `narration.wav` |
| `captions` | One-line SRT cues from narration |
| `hyperframe` | Render open/close Radar graphics |
| `assemble` | ffmpeg: scenes + labels + audio + subtitles → final MP4 |
| `quality` | Hard checks (1080p, audio, workflow, no spoken “verdict”, one-line captions, …) |
| `notify` | Telegram success/failure via Hermes when configured |

Timing: scene durations are fixed in the plan (typically 4–10 s each). TTS length is whatever the 120–150 word script needs; assemble pads/aligns audio to the visual timeline.

### 5. Check and save

- Working artifacts: `radar-video/jobs/<slug>/` (recordings, plan, wav, srt, logs)
- Published file:

```text
radar-video/output/YYYY-MM-DD/<slug>/YYYY-MM-DD-<slug>-radar.mp4
```

Examples:

- `output/2026-07-24/firecrawl/2026-07-24-firecrawl-radar.mp4`
- `output/2026-07-25/ego-lite/2026-07-25-ego-lite-radar.mp4`

### 6. Post (manual)

- Attach the MP4 to social posts.
- Prefer captions from `share.x` / `share.linkedin` ending with `https://nimaaksoy.com/radar/{slug}`.
- Do not dump caption drafts onto the Radar webpage.

---

## Writing rules

Same voice as Radar ([`RADAR.md`](./RADAR.md) Voice section):

- Human and direct
- Easy words
- No empty hype (“revolutionary”, “game-changing”, “seamlessly”, … — banned in the planner)
- Explain the real value
- Do **not** copy the GitHub README or marketing fluff
- Do not repeat the same sentence across `take` / `why` / on-screen labels
- On-screen labels stay short (a few words)
- Subtitles stay **one line**
- End with the **call** only: “Must watch.” / “Worth testing.” — never say the word “verdict”

---

## Quality checklist

Use before posting:

- [ ] Clear hook in the first seconds
- [ ] Correct project name on open card and in speech
- [ ] Correct source / product URLs in the plan (no wrong site)
- [ ] Accurate explanation (matches Radar `take` / `why` / `howItWorks`)
- [ ] Readable on-screen text (not walls of copy)
- [ ] No clipped UI, no long footer scrolls
- [ ] 1920×1080, 30 fps
- [ ] Smooth enough cuts (no broken recordings)
- [ ] Working audio (not silent; narration intelligible)
- [ ] One-line captions; no multi-line subtitle blocks
- [ ] Closing call only (no spoken “verdict”)
- [ ] Correct Radar URL in captions / posts: `https://nimaaksoy.com/radar/{slug}`
- [ ] `quality.json` passed (or manual review if re-exported)
- [ ] Final MP4 watched once before posting

---

## Example

Using **ego lite** from `content/radar/2026-07-25.json`.

### Source fields (abbreviated)

| Field | Value |
|-------|--------|
| `slug` | `ego-lite` |
| `name` | ego lite |
| `url` | `https://github.com/citrolabs/ego-lite` |
| `homepage` | `https://lite.ego.app/` (set when known; helps recording) |
| `take` | A Chromium browser built so you and AI agents share logins, but work in separate Spaces. |
| `verdict` | `must-watch` → spoken/on-screen **Must watch** |
| `stars` / `starsGained` | ~2.8k / +225 |

### Narration (pipeline shape)

> ego lite. A Chromium browser built so you and AI agents share logins, but work in separate Spaces. Most agent browsers either wipe your session or fight you for the same tabs. … There is a public demo. About 2.8k GitHub stars, with roughly 225 recent stars gained. **Must watch.**

### Suggested scenes (matches generic plan)

| Scene | ~Time | On-screen | Action |
|-------|-------|-----------|--------|
| Open | 0–4 s | ego lite + take | Title card |
| Site | 4–14 s | Download → Agent skill | lite.ego.app scroll / CTA |
| Docs | 14–24 s | How it works | Docs / skill install |
| Features | 24–32 s | Spaces · Snapshot · Skill | Feature sections |
| GitHub | 32–39 s | 2.8k stars · +225 recent | Repo header |
| Close | 39–43 s | **Must watch** | Radar close card |

### Call to action

- On card footer: `nimaaksoy.com/radar`
- Social post ends with: `https://nimaaksoy.com/radar/ego-lite`

---

## File and code map

### In this repository (`nimaaksoy.com`)

| Path | Role |
|------|------|
| `content/radar/*.json` | Day files; **source of truth** for video load |
| `docs/RADAR.md` | How Radar product + content work |
| `docs/RADAR-VIDEO-WORKFLOW.md` | This video workflow |
| `app/radar/**` | Live pages linked from posts |
| `components/radar/**` | UI (not used for rendering MP4) |
| `lib/radar.ts`, `lib/radar-shared.ts` | Content loaders for the site |
| `README.md` | Links to Radar + video docs |

There is **no** video renderer inside this Next.js app. Videos are produced offline by the pipeline below.

### Video project (`/home/nima/ai-home/radar-video`)

| Path | Role |
|------|------|
| `config/settings.yaml` | Resolution, FPS, durations, TTS, stages, required fields |
| `scripts/run_job.sh` | Entry: run pipeline for a slug |
| `scripts/radar_video/pipeline.py` | Stage orchestration |
| `scripts/radar_video/poll.py` | Optional: pick new complete items |
| `scripts/radar_video/stages_load.py` | Load item from Radar day JSON |
| `scripts/radar_video/stages_research.py` | URL research / homepage maps |
| `scripts/radar_video/stages_plan.py` | Scenes + narration (generic + Firecrawl) |
| `scripts/radar_video/stages_record.py` | Playwright browser capture |
| `scripts/record_scenes.mjs` | Node/Playwright recorder helper |
| `scripts/radar_video/stages_tts.py` | Hermes xAI TTS |
| `scripts/radar_video/stages_captions.py` | One-line SRT generation |
| `scripts/radar_video/stages_hyperframe.py` | Open/close cards (Hyperframes + ffmpeg fallback) |
| `scripts/radar_video/stages_assemble.py` | ffmpeg composite + burn captions |
| `scripts/radar_video/stages_quality.py` | Automated QC |
| `scripts/radar_video/stages_notify.py` | Telegram notify |
| `templates/radar-style/` | Hyperframes open/close design (dark + green) |
| `jobs/<slug>/` | Per-job working directory |
| `output/YYYY-MM-DD/<slug>/` | Final MP4s |
| `state/processed.json` | Idempotent poll state |

### External tools used

| Tool | Role |
|------|------|
| **Python 3** | Pipeline |
| **Playwright** | Headless browser recording |
| **ffmpeg / ffprobe** | Encode, crop, captions, contact sheets |
| **Hyperframes** | Motion title/close cards |
| **Hermes + xAI TTS** | Voiceover (`sirius`) |
| **Hermes Telegram** | Optional delivery of finished MP4 |

---

## Updating the workflow

Update **this file** whenever any of the following change:

- Video dimensions, FPS, duration budgets, or caption style
- Scene order or planner (generic / Firecrawl)
- Narration or branding rules (including the no-“verdict” rule)
- Render stack (Hyperframes, Playwright, TTS, ffmpeg flags)
- Output path pattern or notify path
- Required Radar fields for video load

Also update:

- `radar-video/config/settings.yaml` and the stage that changed
- Operator notes in the Hermes skill `references/radar-video.md` if that skill is still used for ops

Keep [`docs/RADAR.md`](./RADAR.md) about the **product and content system**. Keep video production details here.

If the system grows (many templates, multiple guides), consider:

```text
docs/radar/
  README.md
  CONTENT.md
  VIDEO-WORKFLOW.md
```

Until then, one file under `docs/` is enough.

---

Last updated: 2026-07-25
