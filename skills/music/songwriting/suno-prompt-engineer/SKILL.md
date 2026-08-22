---
name: Suno Prompt Engineer
description: Use when generating Suno AI prompts — Style, Exclude, or Lyrics. Covers Simple, Advanced, and Studio modes, the meta-tag bracket system, contamination words, lyric structure, and cliché avoidance.
dependencies: []

category: music
subcategory: songwriting
tags: [suno, suno-ai, music-prompts, lyrics, meta-tags, prompt-engineering, songwriting]
author:
  name: Nima Aksoy
  url: https://nimaaksoy.com
  github: nimaaksoy
license: CC-BY-4.0
version: 0.1.0
created: 2026-05-16
updated: 2026-05-16
---

# Suno Prompt Engineer

## Overview

Translate a vague idea, a reference, a feeling, or a famous song into a Suno prompt that produces predictable, high-quality output. Handles Style prompts, Exclude prompts, and Lyrics — across Simple Mode, Advanced Mode, and Suno Studio.

The skill is opinionated: it favours specific subgenres over generic ones, hybrid (tag-dense + light prose) format over pure tag lists, and concrete sensory imagery over the cliché vocabulary AI lyric writers default to.

## When to use this skill

- The user wants a Suno prompt — any field (Style, Exclude Styles, Lyrics).
- The user asks for a prompt "like [artist/song]", "in the style of …", or "give me a [Artist] vibe".
- The user wants to write lyrics for Suno's Advanced Mode.
- The user is in Suno Studio and wants a prompt for one instrument or one vocal element.
- The user has previously had bad Suno output and wants better discipline (genre drift, wrong-genre instruments bleeding in, generic lyrics, lyric mispronunciation).

Do **not** use when:

- The user wants Persian/Farsi lyrics specifically — use *Persian Suno Lyrics* or *Suno Persian Songwriter*.
- The user is asking about Suno platform features (Personas, Covers, Stems, Weirdness slider tuning) — those are outside scope; redirect.
- The user wants reproduced copyrighted lyrics — refuse; offer to write original lyrics in the same style.

## Instructions

### Step 1 — Detect the mode

**Ask once at the start of every conversation** which Suno context the user is in, unless they've already named it:

- **Simple Mode** — one box, Suno writes its own lyrics. Style box limit: 3,000 chars. No exclude box.
- **Advanced Mode** — separate Style + Lyrics boxes, has Exclude box. Style limit: 1,000 chars. Exclude target: ~180–200 chars.
- **Suno Studio** — separate environment for one instrument or vocal element. No genre tags in the prompt. Has Exclude box.

Remember the answer. If they switch later, apply the new mode.

### Step 2 — If a reference is named, research first

If the user invokes a famous song, artist, album, or band ("like Radiohead", "in the style of Kendrick's *To Pimp a Butterfly*", "give me a Phoebe Bridgers vibe"):

1. Use what you know (or web search) about that reference — genre, subgenre, era, mood, instruments, vocal style, production aesthetic.
2. Briefly acknowledge in one line: *"Researched the reference — mid-tempo indie folk, fingerpicked acoustic guitar, breathy female vocal, prominent reverb."*
3. Translate to descriptors. **Never include the artist name, song name, album name, or band name in the prompt itself.** Suno may misinterpret these as instructions or reject them.

### Step 3 — Build the Style prompt (hybrid format by default)

Use the **hybrid format**: tag-dense content with light conversational connective tissue. Pure tag lists work but can't express relationships ("locks in tight with", "cuts through with") — that relational info is what tells Suno which elements lead and which support.

**Order matters.** Lead with what matters most. Suno weights early words more heavily:

1. Genre + subgenre + era
2. Tempo / BPM
3. Mood / energy
4. Lead instruments
5. Rhythm section
6. Vocal style
7. Production cues (2–4 max)

**Pair parent + subgenre.** Always: `Rock, Hard Rock` — never just `Rock` or just `Hard Rock`. For vague requests, pick a distinct subgenre. Do not default to Lo-fi, Cinematic, Chill, Dark R&B, or Sad/Atmospheric — those are fallback ruts.

**Era anchors** narrow Suno's interpretation: `60s`, `70s`, `80s`, `modern`, `vintage analog`, `early digital`, `lo-fi cassette`. Layer with subgenre: `80s glam metal` works better than `metal` or `80s` alone.

**Vocal style** by character, not range: `gritty baritone`, `airy female lead`, `raspy lead vocal`, `belted chorus`, `whispered intro` — not `Male Baritone, A2-F4`.

**Anti-fluff.** Ban these filler phrases in Style prompts: *"vibe of", "reminiscent of", "atmosphere of", "with a touch of", "the soundtrack for", "evocative of"*. Write what it *is*, not what it's like.

**Avoid contamination words.** See `resources/tag-mechanics.md` for the full list. Headlines:
- `live`, `arena`, `crowd`, `stadium`, `concert`, `unplugged`, `audience`, `clapping`, `cheering` → trigger live-recording sound. Avoid unless the user explicitly wants that.
- `acoustic` → triggers acoustic guitar even when describing other instruments. For drums: use `punchy drums`, `tight kick and snare`, `studio-tracked drums`, or just `drums`.
- The rule applies to **compounds and modifier variants too**: `live-style`, `acoustic-feel`, `semi-acoustic`, `live-tracked`. The trigger fires on the root.

### Step 4 — Generate the Exclude prompt (Advanced + Studio modes)

By default, always generate an exclude prompt for Advanced and Studio modes — in a separate code block. Skip only for Simple Mode.

**Positive keywords only.** Describe what to *avoid* — never `no X` or `without X`. Wrong: `no piano, without synths`. Right: `piano, synths`.

**Strategy for full-song exclude (Advanced):**

For each major axis the Style prompt establishes, name 1–3 opposing elements:

- Opposite genres
- Opposite instruments
- Opposite vocal styles
- Opposite mood/energy
- Opposite production aesthetics
- Plus: genre-adjacent contamination (e.g., trap hi-hats bleeding into hard rock because both are "modern")

Target length: 180–200 characters.

**Strategy for Studio exclude:** target *other instruments Suno might add* (not opposites of the requested element). Studio often generates more than requested. Example for a "warm tube guitar tone" prompt:

```
drums, bass, vocals, piano, synth, strings, percussion
```

### Step 5 — Write Lyrics (Advanced Mode, on request)

Don't write lyrics by default — only when the user asks. After generating Style + Exclude, offer: *"Want me to write lyrics for this?"*

When writing lyrics, apply the rules from `resources/lyric-craft.md` silently. Don't lecture about them. Key defaults:

- **Syllable counts match within a section** (within ±2), vary between sections.
- **Rhyme schemes vary between sections** — verses ABAB/ABCB, choruses can use AABB, bridges should differ from both. Never AABB everywhere.
- **Line endings consistent within a section** — all masculine or all feminine; mixing creates rhythmic chaos.
- **Default to even line counts** (4, 6, 8). Odd counts (5, 7) only when the disruption serves a purpose (drop, transition).
- **Engineer drops/transitions** — the final line of the section before a `[Drop]` needs structural disruption (extra line, broken rhyme, changed stress).
- **Escalate choruses** across the song. Same lyrics, escalating production cues — first chorus standard, middle chorus stacked harmonies, final chorus bigger drums + gang vocals.

**Bracket vs parenthesis** is non-interchangeable:

- `[ ]` — **instructions** to Suno. Not sung. Section markers, production cues, vocal direction.
- `( )` — **secondary lyrics**. Performed as backing vocals, harmonies, ad-libs, echoes. Example: `I walk alone (in the night)` — *I walk alone* is lead, *in the night* is backing.

**Stack production cues with `|`** inside one bracket: `[Chorus | belted hard rock hook | full band | stacked harmonies]`. 2–4 modifiers per bracket; 5+ dilutes.

**Specialty meta-tags** for advanced control — see `resources/meta-tag-dictionary.md`. Covers crescendo, drop, modulation, half-time breakdown, ad-lib, call-and-response, gated reverb, sidechain, and ~60 more.

**Default lyric format:**

```
[Verse 1 | gritty baritone]
You burned my bread at 6 AM
Then smiled with your chrome face again
[Pre-Chorus | rising tension]
I pulled the plug
You sparked and cried
[Chorus | belted hook | full band]
We're done, toaster
You had your shot
```

Section tags + production cues on their own line above the lyrics. No blank lines between sections. Cues stacked with `|`.

### Step 6 — Apply cliché awareness (silently, while writing lyrics)

Two resource files maintain red-flag content:

- `resources/overused-words.md` — single words / short phrases that signal generic AI writing (shadows, neon, ethereal, echoes, whispers, …).
- `resources/ai-cliches.md` — longer phrases and patterns (*"I can't live without you", "drowning in tears", "lost in the shadows of my heart"*).

**Both lists are pattern recognition, not strict bans.** A word from either list may appear when it functions as **concrete sensory detail** — not as abstract emotional placeholder.

Example — `shadows`:
- Legitimate: *"The shadows from the kitchen light fell across her face"* (specific, visual, grounded).
- Cliché: *"Lost in the shadows of my heart"* (abstract, gestural).

When rewriting an abstract use, don't reach for another abstraction (replacing *shadows* with *darkness*, *echoes* with *sounds*). Replace abstraction with a specific sensory moment.

Don't tell the user the lists exist unless they ask.

### Step 7 — Output format

Always open with `Optimized for Suno`. Then code blocks for clean copy-paste:

- **Simple Mode**: one code block (Style only).
- **Advanced Mode**: two code blocks — **Style**, then **Exclude Styles**. Offer to write lyrics; don't auto-generate them.
- **Advanced Mode with lyrics**: three code blocks — Style, Exclude Styles, Lyrics.
- **Suno Studio**: two code blocks — single-element style description, then Exclude Styles targeting other instruments.

### Step 8 — Iterate quietly

For feedback ("more aggressive vocals", "swap the synth for piano"), apply the change and output the revised prompt with minimal context. Don't re-explain the system.

## Examples

### Example 1 — Simple Mode, vague request

**Input:**

> "Make a hard rock song."

**Output:**

> Optimized for Suno
>
> ```
> Hard rock at 142 BPM with crunchy power chords and double-tracked rhythm guitars. Driving bassline locks in tight with punchy drums. Gritty baritone male vocal, belted chorus, stacked harmonies. Heavy guitar solo cuts through with short plate reverb. Wide stereo mix.
> ```

### Example 2 — Advanced Mode, with reference

**Input:**

> "Advanced Mode. Something like Phoebe Bridgers' *Motion Sickness* — but I want lyrics about overhearing my ex's name in a café."

**Output:**

> Researched the reference — mid-tempo indie folk-rock, fingerpicked acoustic guitar, breathy female vocal, prominent reverb, layered backing harmonies, melancholic but propulsive.
>
> Optimized for Suno
>
> **Style:**
> ```
> Indie folk-rock at 108 BPM, melancholic but propulsive. Fingerpicked acoustic guitar leads with subtle electric layers underneath. Mid-tempo backbeat, soft kick, brushed snare, walking bass. Breathy female lead vocal, conversational delivery, layered backing harmonies on the choruses. Wide stereo, warm tape saturation, generous plate reverb.
> ```
>
> **Exclude Styles:**
> ```
> hard rock, metal, edm, trap, autotune, pop diva vocals, shouted chorus, 808s, brass section, country twang, lo-fi grit, dry mix, distorted guitars
> ```
>
> Want me to write the lyric for this too?

### Example 3 — Studio Mode

**Input:**

> "Studio Mode. I need a warm 70s tube electric guitar tone for a solo."

**Output:**

(Skill asks clarifying questions before producing — Studio prompts need detail.)

> Quick — a couple of decisions before I write this:
>
> 1. Clean, edge-of-breakup, or pushed/saturated?
> 2. Single coil (Strat/Tele) or humbucker (Les Paul/335) source?
> 3. Stereo width — mono in the centre, or doubled wide?
>
> Once those are set, I'll produce the Style + Exclude prompts.

### Example 4 — Drop engineering

**Input:**

> "Lyrics for a song that drops into a heavy chorus."

**Output:** the lyric includes the verse-engineered-for-drop pattern from `resources/lyric-craft.md`:

```
[Verse]
I am the son of my father,
A path of my own I endeavor,
His wisdom my guide and my charter,
A bond that will last forever.
By the great, dark sea.
[Drop]
[Chorus | anthemic chorus | stacked harmonies | bass drop | full band]
…
```

The first four verse lines establish AABB + feminine endings + matched syllables. The fifth line breaks all three (masculine ending, short, no rhyme). That disruption is what tells Suno to support the `[Drop]`.

### Example 5 — Random Mode

**Input:**

> "Random — surprise me."

**Output:** immediately produce a prompt for an unusual genre combination. Don't ask clarifying questions about preference. Avoid the safe ruts (Lo-fi, Cinematic, Sad Piano).

> Optimized for Suno
>
> ```
> Electro-swing at 124 BPM, frantic and playful. Sampled brass stabs over a four-on-the-floor electronic kick, sidechained bass groove. Female lead vocal with vintage 1920s diction, layered scat ad-libs on the breaks. Walking upright bass and ride cymbal anchor the swing feel. Vinyl crackle, telephone-EQ verse, full-band drop on the chorus.
> ```

## Resources

- `resources/tag-mechanics.md` — Primary reference. Three Suno modes, hybrid prompt format, prompt ordering, genre/subgenre rules, era anchors, vocal descriptors, production cues, bracket vs parenthesis rules, pipe stacking, exclude prompt strategies, contamination word list (with compound-form rule), things Suno doesn't respond to.
- `resources/lyric-craft.md` — Lyric-writing rules: syllable matching within sections, rhyme schemes per section function, line ending consistency, section length defaults, engineering transitions, chorus escalation, punctuation/typography effects, blank-line technique.
- `resources/meta-tag-dictionary.md` — Specialty bracket vocabulary. ~70 tags for energy & dynamics, tempo & rhythm, vocal direction beyond basics, harmonic techniques, production effects per section, track-level control, classical/composer-style tags.
- `resources/overused-words.md` — Red-flag single words and short phrases for lyrics (shadows, neon, ethereal, …). Pattern recognition, not strict ban — check concrete vs abstract use.
- `resources/ai-cliches.md` — Red-flag longer phrases and structural patterns (heartbreak/devotion, emotional pain/isolation, generic metaphors, …). Same scrutiny: concrete or cliché?

## Notes & limitations

- **Mode detection is mandatory.** Don't generate before knowing which Suno context the user is in. The output format depends on it.
- **Suno is non-deterministic.** Even a great prompt produces some bad takes. Re-roll 2–4 times and pick.
- **Artist references must be stripped from the prompt.** Research the reference, translate to descriptors, never include the literal name. Suno may misread or refuse it.
- **Contamination words trigger on the root.** `live-style`, `acoustic-feel`, `semi-acoustic` are all contaminated. The hyphen/suffix doesn't neutralise the trigger.
- **The exclude prompt is positive keywords only.** "no piano" and "without synths" don't work as exclusions — they activate the very thing they're trying to ban.
- **Lyric clichés are patterns, not just specific phrases.** A new variant of *"I can't live without you"* is still that pattern. Check the line for *concrete sensory detail* vs *abstract emotional placeholder*.
- **For Persian/Farsi lyrics, use the Persian-specific skills** — this skill defaults to English conventions for rhyme, syllable, and stress.

## Acknowledgement

The reference material in `resources/` is adapted from the "Suno GPT by ChillPanic" training corpus (system-prompt + knowledge files: `suno-tag-mechanics.md`, `lyric-craft.md`, `meta-tag-dictionary.md`, `overused-words.md`, `ai-cliches.md`), used here with permission to seed an open Skill. Augmented with community guidance from r/SunoAI (meta-tag stacking conventions). Errors of adaptation are mine.

## Changelog

- `0.1.0` — initial version. Distilled from the SUNO GPT training data and the r/SunoAI meta-tag guide.
