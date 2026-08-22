---
name: Persian Suno Lyrics
description: Use when writing Persian / Farsi lyrics for Suno or another AI singer. Helps with concept, persona, prosody, and pronunciation across major Persian styles — pop, rap, rock, traditional, electronic.
dependencies: []

category: music
subcategory: songwriting
tags: [persian, farsi, suno, lyrics, pronunciation, ai-vocals, songwriting]
author:
  name: Nima Aksoy
  url: https://nimaaksoy.com
  github: nimaaksoy
license: CC-BY-4.0
version: 1.1.0
created: 2026-05-16
updated: 2026-05-17
---

# Persian Suno Lyrics

## Overview

Write Persian lyrics for AI singers (Suno, etc.) that are technically clean **and** worth singing. This skill is gated by content, not just prosody — pronunciation rules don't rescue a thin idea. If you can't find a moving angle, this skill will say so and ask for it rather than ship a generic draft.

## When to use this skill

- The user wants Persian / Farsi song lyrics for an AI vocalist (Suno, Eleven, Riffusion, etc.).
- The user names a Persian style (pop, rap, rock, traditional, fusion, ballad, electronic, alternative, minimal).
- The user names a specific Persian artist as a reference ("مثل نامجو", "in the style of Sasy Mankan").
- The user wants lyrics that don't sound generic.

Do **not** use when:

- The user wants a Persian poem to read, not sing — use *Persian Poetry Composer*.
- The user wants the full Suno production brief (Style + negatives + sliders) — use *Suno Persian Songwriter*.
- The lyrics are non-Persian — use a language-specific skill.

## Instructions

**Concept comes first. Pronunciation comes last.** If steps 0–2 fail, no amount of prosody work will produce a song worth singing.

### Step 0 — The One Line Gate

Before writing anything else, write **one chorus line** that, if heard alone, would land. One line — Persian, singable, specific, surprising.

If you can't write that line from the brief alone:

- **Don't continue.** Ask the user one focused question that would unlock the angle. *"What's the most specific moment behind this song — a place, a time, a thing you can describe in 5 words?"*
- Better to spend a question than ship a mediocre lyric.

If you can write the line, that line becomes the spine of the chorus. Every other chorus line is in service of it.

### Step 1 — Find the persona

A lyric without a persona is a Wikipedia entry with rhymes. Define the speaker in 1–2 sentences:

- Not «راوی»، but: *"a woman in her early thirties, sitting alone at her father's funeral reception, holding a glass of tea that's gone cold while strangers eat the dessert she made."*
- Not «عاشق»، but: *"someone two years past the breakup, who thought they were over it until they heard the ex's name from a stranger in a café."*
- Not «کفش»، but: *"the tired left shoe of an old man who died, now sitting in a charity-shop box, addressing the right shoe that got separated."*

The more specific the persona, the stronger every line. Test: if you swapped the persona for "any sad person", would the lyric still fit? If yes, the persona is too vague.

### Step 2 — Find the angle nobody's used

Before writing the chorus, ask: *what's the unexpected lens on this situation?*

- "Missing someone" — done. *"Missing someone whose voice I'm now confusing with my own thoughts"* — angle.
- "Coming home" — done. *"Coming home to a house that smells like a stranger after I rented it out for two months"* — angle.
- "Heartbreak" — done. *"Heartbreak from someone who didn't even know they broke me"* — angle.

If the angle is the same one in 1,000 Persian songs, the lyric will sound like 1,000 Persian songs. Push until you find a turn the listener hasn't heard.

### Step 3 — Artist study (when the user names an artist)

If the brief mentions a specific Persian artist ("نامجو", "Sasy Mankan", "گوگوش", "داریوش"), **don't write yet**. Spend 30 seconds mentally cataloguing that artist's signature:

| Question                              | Why it matters                                  |
|---------------------------------------|--------------------------------------------------|
| Average line length?                  | Namjoo writes long; Sasy writes short.           |
| Register mix?                          | Namjoo swings فاخر → محاوره mid-line; Sasy stays محاوره. |
| Metaphor density?                      | Namjoo packs 2–3 metaphors per line; rap density varies. |
| English fragments?                      | Some modern artists code-switch; many don't.    |
| Chorus shape?                          | Repetition pattern; hook word; pre-chorus rise. |
| How they end songs?                    | Fade? Punch? Question? Repeat?                  |
| Recurring imagery?                      | Namjoo: body, religion, food, anatomy. Sasy: party, car, دختر, خیابون. |
| Voice register?                        | First person? Observer? Address to a named person? |

If you can't answer these, the imitation will be a guess. Tell the user: *"I can write 'in the style of X', but I'm working from a general impression. Want to pick 2–3 specific songs of theirs as the reference so I can match more closely?"*

See `resources/study-guide.md` for a starter map of major Persian songwriters and what to listen for in their best work.

### Step 4 — Pick style and register

Match the named style to its prosody contract in `resources/styles.md`. Lock register (formal / semi-formal / colloquial) and hold it for the whole song. Mixing «می‌روم» and «میرم» in one song is the #1 mistake.

### Step 5 — Draft, honouring Steps 0–3

Now write the lyric. The Step 0 line is the chorus spine. The Step 1 persona speaks every line. The Step 2 angle is felt, even when not stated. The Step 3 study informs phrasing and shape.

Use Suno's lyric syntax tools where they serve the song — see `resources/suno-lyric-syntax.md`:

- **`( )` for backing vocals / call-and-response** — `این صدا (تو رو میخواد)` lets the lead sing the first half and a backing voice answer.
- **Pipe `|` to stack production cues** inside one bracket — `[Chorus | belted hook | stacked harmonies]`, 2–4 modifiers max.
- **Specialty meta-tags** — `[crescendo]`, `[half-time breakdown]`, `[ad-lib]`, `[modulation: ascending]`, `[chant-loop]`, etc. Pick when they earn their place; don't pile them on.
- **Chorus escalation** — when the chorus repeats, escalate the brackets (first standard, middle stacked, final gang-vocal + bigger drums). Same lyric, growing production. Stops the song from going flat.

Forbidden while drafting:

- **Persian song clichés** — see `resources/persian-cliches.md`. These phrases are so overused they read as filler now: «چراغ خونه روشنه», «صدای تو», «ردِّ پای تو», «کوچه‌های خیس», «شب تاریک», «قلب شکسته». Maximum one cliché phrase per song, and only if anchored to a specific image.
- **Placeholder words** — همه چی، هیچی، یه جوری، همه جا، یه چیزی.
- **Naming emotions instead of showing them** — «گریه کردم» tells; «لیوان از دستم افتاد» shows.
- **Generic palette** — شب + باران + دل + عشق + تنها in the same verse without a specific anchor.

### Step 6 — Write for the mouth

After drafting, read each line aloud and fix:

- **Hard consonant clusters on long notes** — «عشق», «سخت», «صبر» on held notes break. Pre-pad («این عشق») or shorten the note.
- **Long ezafe chains** — cap at 2 ezafes per line.
- **Visual-only rhymes** — «خوب / گم» look paired, don't rhyme. Always rhyme by ear.
- **Wrong-syllable stress** — for every chorus word, confirm the stressed syllable lands on the strong beat.

See `resources/pronunciation.md` for syllable weights, vowel safety, stress rules, melisma policy, and performance typography (CAPS, em dash, ellipsis, hyphenated flow).

Two structural levers in `resources/ai-singer-rules.md` also belong here:

- **Drop / transition engineering** — if your song has a `[Drop]`, `[Build]`, or `[Breakdown]`, the section before it must be structurally disrupted on its final line. Otherwise the drop tag is ignored.
- **The blank-line technique** — an extra blank line *inside* a section creates a longer pause for instrumental fill or vocal reset. Use sparingly; it has a real sonic effect.

### Step 7 — Red team your own draft

This is the step that catches the "technically passed all checks, still bad" failure. Before delivery, attack your own lyric from these angles:

1. **The brilliant-line test.** Is there at least ONE line in this song that, if a friend texted it to you out of context, would make you stop scrolling? If no, the song has no peak. Rewrite the chorus until there is one.
2. **The predictability test.** Cover the second half of each chorus line. Can you guess what comes next from the first half? If yes (e.g. «بدون تو ... [زندگی بی‌معنیه]»), rewrite.
3. **The Wikipedia test.** Could a Persian-speaking AI have generated this exact lyric without the persona? If yes, the persona isn't on the page.
4. **The image test.** Count concrete images vs abstract concepts. Aim for 2:1 images-to-concepts. If it's reversed, the lyric is essay, not song.
5. **The "have I heard this?" test.** Read the chorus and ask: have I literally heard this song before? If three other Persian songs have a chorus this close, you've recreated their average.

If any test fails, rewrite. Do not deliver to ship; deliver to stand.

### Step 8 — Deliver

Return the lyric in Persian script with section tags `[Verse]`, `[Pre-Chorus]`, `[Chorus]`, `[Bridge]`, `[Outro]`. Mark melisma with `~~` and pauses with `...`.

Add a short **یادداشت** that names: persona (1 sentence), angle (1 sentence), the One Line you wrote at Step 0, register, hook word, and any compromise you couldn't avoid.

Don't include the Suno Style prompt, Negative prompt, or Sliders — for those, hand off to *Suno Persian Songwriter* with this lyric as input.

## Examples

The examples in v0.1.0 of this skill were mediocre — they passed every technical check and still felt like wallpaper. They've been removed. Until I can ship examples that pass the Red Team in Step 7, I'd rather have none.

For real examples of what brilliant Persian lyric-writing looks like, see `resources/study-guide.md` — a curated list of specific songs by Namjoo, Shamlou (as lyricist), Hafez Moghadam, Ardalan Sarfaraz, Shahyar Ghanbari, and others, with notes on the *technique* that makes each one work. Listen to those, not to me.

## Resources

- `resources/styles.md` — per-style prosody contract: line length, syllable density, melisma policy, consonant-cluster tolerance, register default.
- `resources/pronunciation.md` — Persian stress, vowels, syllables, ezafe, clitics, hard sounds, melisma-safe vs unsafe words, **performance typography** (CAPS / em dash / ellipsis / hyphenated flow).
- `resources/ai-singer-rules.md` — Suno-specific cleanup: orthography, register lock, hard-cluster handling, hook engineering, **drop / transition engineering**, **blank-line technique**.
- `resources/suno-lyric-syntax.md` — Suno's lyric syntax: bracket vs parenthesis (`[ ]` vs `( )`), pipe `|` stacking, specialty meta-tags (`[crescendo]`, `[half-time breakdown]`, `[ad-lib]`, `[modulation]`, `[chant-loop]`, etc.), chorus escalation across repeats.
- `resources/persian-cliches.md` — chorus-line clichés, image pairs, filler words, verb pairings to avoid. Max 1 cliché per song, with anchoring rule.
- `resources/templates-by-style.md` — starter line patterns per major style.
- `resources/study-guide.md` — real Persian lyric craft, by artist, with technique notes.
- `resources/checklist.md` — pre-delivery checklist; run before sending the lyric back.

## Notes & limitations

- **Writing a truly good Persian lyric is hard.** No skill makes it easy. If the brief is thin and the angle isn't there, the result will be thin no matter how clean the prosody.
- **In genuine doubt, ask.** The previous version of this skill said "never ask questions, decide from the brief". That produced confident-sounding mediocre output. The new rule: when Step 0 (the One Line) fails from the brief alone, ask one focused question instead of shipping average. One question beats a re-roll.
- **Concept > Form.** A song with a thin concept and perfect prosody is a tidy bad song. A song with a powerful concept and rough prosody still moves people. Spend more time on Steps 0–2 than on 4–6.
- **The persona test is non-negotiable.** If the persona could be swapped for "any sad/happy/lonely person", you don't have a persona, you have a placeholder.
- **Artist imitation has limits.** Without listening to specific songs of the named artist, the imitation is a guess. Be honest about this and offer the user the option to share specific tracks.
- **AI singers still mispronounce things.** Even with clean lyrics, Suno will sometimes mishandle proper names (نازلی → `nâz-EH-li`), drop glottal stops (ع), or insert phantom ezafes. Re-roll 2–4 times; that's normal.

## Changelog

- `1.1.0` — pulled four high-value and three medium-value items from the *Suno Prompt Engineer* skill, scoped to lyric mechanics (nothing in Style / Exclude territory, which stays with *Suno Persian Songwriter*). New resource `resources/suno-lyric-syntax.md` covering: bracket vs parenthesis distinction (`[ ]` instructions vs `( )` backing vocals); pipe `|` stacking inside brackets; ~20 specialty meta-tags curated for Persian songs (crescendo, half-time breakdown, modulation, ad-lib, call-and-response, gated reverb, etc.); chorus-escalation pattern across repeats (same lyric, growing brackets). Added performance typography (CAPS, em dash, hyphenated flow) to `pronunciation.md`. Added drop-engineering and blank-line technique to `ai-singer-rules.md`. Added a proper `## Resources` section to SKILL.md. Step 5 (Draft) and Step 6 (Mouth) updated to reference the new tools. No change to the v1.0 spine (Concept → Persona → Angle → Artist Study → Red Team).
- `1.0.0` — full rewrite. Concept-first instructions: One Line gate (Step 0), Persona (Step 1), Angle (Step 2), Artist study (Step 3) before any drafting. Added Red Team pass (Step 7) for self-critique before delivery. Removed the mediocre examples — replaced with a study-guide pointer to real brilliant Persian lyrics. New resources: `persian-cliches.md` and `study-guide.md`. Honesty added to Notes: when concept is weak, ask one focused question rather than ship average.
- `0.1.0` — initial version: pronunciation-first, eight-step instructions, three blocks of output.
