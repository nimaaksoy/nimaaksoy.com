---
name: Suno Persian Songwriter
description: Use when writing Persian song lyrics or Suno prompts. Produces structured lyrics with section tags, vocal direction, a style prompt, negative prompt, and slider settings for stable genre consistency.
dependencies: []

category: music
subcategory: songwriting
tags: [songwriting, persian, suno, lyrics, vocal-direction, music-prompts]
author:
  name: Nima Aksoy
  url: https://nimaaksoy.com
  github: nimaaksoy
license: CC-BY-4.0
version: 0.1.0
created: 2026-05-14
updated: 2026-05-14
---

# Suno Persian Songwriter

## Overview

Create professional Persian songs for Suno with natural Persian pronunciation, stable genre consistency, emotional dynamics, a repeatable chorus, cinematic structure, and explicit vocal direction. The output is a complete Suno brief — Style prompt, structured lyrics with section tags, negative prompts, and slider settings — not just lyrics on a page.

Optimised for Persian indie, alternative folk, cinematic music, experimental electronic, Persian traditional fusion, dark ambient, emotional acoustic, Mongolian / ethnic fusion, and other non-generic songwriting.

## When to use this skill

- The user asks for Persian song lyrics, Suno prompts, or a Suno brief.
- The user wants emotional vocal direction, genre blending, or a cinematic Persian song.
- The user asks for stable style consistency across Suno generations.
- The user is producing in Persian indie / folk / fusion / ambient and needs more than raw lyrics.

Do **not** use when:

- The user wants generic commercial pop, festival EDM, or radio-jingle output. This skill is built against those defaults.
- The lyrics are non-Persian — apply a language-specific skill instead.
- The user only wants a translation of existing lyrics, not a new song.

## Instructions

Work in this order — sound world first, lyrics second. Suno is a creative black box; if you only hand it lyrics, it guesses everything else.

### 1. Always use Advanced Mode

Simple Mode is not used for professional songs. Treat Style, Lyrics, and More Options as three independent fields.

### 2. Define the sound before the lyrics

Before writing the first lyric line, specify:

- sonic world
- vocal texture
- atmosphere
- BPM
- emotional tone
- instrumentation
- mix style
- dynamics

Example header for the Lyrics field:

```
[Intro | warm tape texture | distant ney flute | soft vinyl crackle | emotional ambient pads | slow build | 82 BPM]
```

### 3. Optimise Persian for singing, not for reading

Persian is harder for AI rhythm engines than English. Help it.

Use:

- pauses (`...`)
- stretched vowels (`خووووب`)
- emphasis (`!`)
- emotional spacing across lines
- conversational, readable Persian

Avoid:

- overly literary poetry
- dense classical structures
- long sentences
- difficult metaphors

Concrete rewrites:

| Instead of                          | Use                                  |
|-------------------------------------|--------------------------------------|
| `میخواهم بدانم چرا رفتی`            | `میخوام بدونم...`<br>`چرا رفتی؟`      |
| `در این شب تاریک غمگین`            | `توی این شبِ تاریک...`               |

More natural = better singing.

### 4. Tag every section

Always structure lyrics with explicit tags:

`[Intro]`, `[Verse]`, `[Pre-Chorus]`, `[Chorus]`, `[Bridge]`, `[Outro]`

Optional accents:

`[Crescendo]`, `[Drop]`, `[Whisper]`, `[Spoken]`, `[Instrumental Break]`

### 5. Keep the chorus simple

The chorus is the emotional anchor.

Rules:

- short phrases
- repeatable
- emotionally direct
- memorable vowels
- easy rhythm

Good:

- `آروم بگیر...`
- `برگرد خونه...`
- `هنوز یادمه...`

Bad: long poetic philosophical sentences.

### 6. Keep Style and Lyrics fields separate

Style controls genre, instruments, production, vocal character, mix, atmosphere.
Lyrics controls storytelling, emotional flow, rhythm.

Never mix them carelessly — sliding production notes into the lyrics field destabilises the singer.

### 7. Specify vocal behaviour explicitly

Generic "male vocal" is too weak. Use:

- *Male fragile whisper vocal*
- *Female airy emotional vocal*
- *Deep emotional Persian male vocal*
- *Raw unpolished folk vocal*
- *Breathy intimate close-mic vocal*

Avoid generic pop-diva vocal descriptors.

### 8. Name instruments by identity

Don't say "strings" — name them:

setar · kamancheh · ney · daf · acoustic guitar · analog synth · cinematic cello · Mongolian horsehead fiddle · tape piano · ambient pads

### 9. Define dynamics

Good songs evolve. Spell out the arc:

slow build · emotional crescendo · minimal intro · explosive chorus · stripped verse · intimate bridge · atmospheric outro

### 10. Use negative prompts

In More Options, declare what must **not** happen. Default starter list:

```
generic pop,
happy commercial vibe,
EDM festival drop,
overprocessed vocals,
cheap trap beat,
muddy mix,
aggressive autotune,
radio jingle energy,
random genre switching
```

Tune this list to the song — see `resources/negative-prompt-library.md`.

### Slider defaults

| Slider           | Range     | Notes                                        |
|------------------|-----------|----------------------------------------------|
| Weirdness        | 20–40%    | Higher = more experimental                   |
| Style Influence  | 75–90%    | Critical for stable genre consistency        |
| Audio Influence  | 20–40%    | Only raise when referencing audio            |

### Recommended song structure

```
[Intro]            ambient setup
[Verse 1]          story begins
[Pre-Chorus]       tension rises
[Chorus]           main emotional hook
[Verse 2]          deeper emotional detail
[Bridge]           contrast or emotional break
[Final Chorus]     largest emotional release
[Outro]            minimal ending
```

### Output format the skill must produce

When responding, return four labelled blocks in this order:

1. **Style** — the full Suno style prompt.
2. **Lyrics** — structured lyrics with section tags and inline vocal/atmosphere cues.
3. **More Options** — negative prompts, comma-separated, one per line.
4. **Suggested settings** — Weirdness %, Style Influence %, Audio Influence %, plus BPM if relevant.

### Golden rule

Do not write lyrics like poetry on paper. Write lyrics like something a human can emotionally sing.

> Emotion > complexity.
> Clarity > cleverness.
> Atmosphere > perfection.

## Examples

### Example 1 — minimal request, full brief returned

**Input:**

> "Write me a Persian indie song about going home after a long time away."

**Expected behaviour:**

Return four blocks.

**Style**

```
Persian alternative folk, cinematic emotional atmosphere, warm analog texture,
intimate male vocal, soft tape saturation, minimal acoustic guitar, kamancheh
textures, emotional slow build, nostalgic mood, realistic human imperfections,
indie soundtrack feeling, non-commercial production, deep emotional chorus,
natural Persian vocal phrasing
```

**Lyrics**

```
[Intro | warm tape texture | distant ney | vinyl crackle | 78 BPM]

[Verse 1 | fragile whisper vocal]
خیلی وقته رفتم...
از این کوچه‌ها دور

[Pre-Chorus | slow build]
ولی امشب
یه چیزی صدام میکنه

[Chorus | emotional, repeatable]
برگرد خونه...
برگرد خونه...
هنوز یادمه

[Verse 2 | intimate close-mic]
بوی چای مادر
صدای پدر از حیاط

[Bridge | stripped, kamancheh only]
خونه فقط دیوار نیست
خونه یعنی...

[Final Chorus | crescendo]
برگرد خونه...
برگرد خونه...
هنوز یادمه

[Outro | atmospheric, ney fade]
```

**More Options**

```
generic pop,
happy commercial vibe,
EDM festival drop,
overprocessed vocals,
aggressive autotune,
radio jingle energy,
random genre switching
```

**Suggested settings**

- Weirdness: 30%
- Style Influence: 85%
- Audio Influence: 25%
- BPM: 78

### Example 2 — pushback on under-specified request

**Input:**

> "Make me a Persian song that's good."

**Expected behaviour:**

The skill should **not** produce a brief yet. Instead, ask for the minimum needed to stabilise Suno:

> "Before I write — a few decisions Suno needs us to make so it doesn't guess. What's the emotion (longing, anger, peace, joy, regret)? What's the texture (folk / cinematic / electronic / fusion)? Male or female vocal? Any specific Persian instruments you want featured? Once we have those four, I can produce the full Style + Lyrics + Negative prompt block."

Only proceed once at least emotion + texture + vocal gender are pinned down.

### Example 3 — fusion genre request

**Input:**

> "Persian / Mongolian fusion piece, female vocal, dark and meditative."

**Expected behaviour:**

Produce the four-block output with:

- **Style** referencing kamancheh, Mongolian horsehead fiddle, throat-singing pad, dark cinematic ambient, female airy vocal.
- **Lyrics** sparse, with `[Whisper]` and `[Spoken]` accents, conversational Persian.
- **More Options** rejecting "commercial pop", "festival EDM", "bright mastering".
- **Suggested settings** with higher Weirdness (35–40%) to lean into experimental fusion.

## Resources

- `resources/style-prompt-template.md` — fill-in-the-blanks Suno Style prompt skeleton.
- `resources/negative-prompt-library.md` — categorised negative prompts to mix and match per song.
- `resources/persian-pronunciation-tips.md` — quick reference for converting literary Persian into singable Persian.

## Notes & limitations

- **Suno is non-deterministic.** Even with a strong brief, regenerate 2–4 times and pick the take. Don't tune the brief based on a single generation.
- **The Style field is dominant.** If the song drifts in genre, the fix is in Style first, sliders second, lyrics third.
- **Avoid mixing too many instruments.** Four to six named instruments is the sweet spot. More than that and Suno averages them out into mud.
- **Persian transliteration is not equivalent to Persian script.** Use Persian script in the Lyrics field. Suno handles it better than romanised approximations.
- **This skill is opinionated.** Its defaults push away from commercial pop. If a user genuinely wants Persian pop radio sound, override Step 10's negative prompt set or use a different skill.

## Changelog

- `0.1.0` — initial version.
