---
name: Verse Chorus Bridge Song Structure
description: Use when shaping a song into a V-C-V-C-B-C structure. Returns a section-by-section outline with a rhyme scheme, syllable target, and prosody note for each section.
dependencies: []

category: music
subcategory: songwriting
tags: [songwriting, structure, lyrics]
author:
  name: Nima Aksoy
  url: https://nimaaksoy.com
  github: nimaaksoy
license: CC-BY-4.0
version: 0.1.0
created: 2026-05-14
updated: 2026-05-14
---

# Verse Chorus Bridge Song Structure

## Overview

A skill for turning a song idea into a clear V-C-V-C-B-C scaffold. Each section gets a one-line job, a rhyme scheme, a syllable-per-line target, and a prosody note. The skill is genre-agnostic but assumes a roughly three-minute pop, country, or singer-songwriter form.

## When to use this skill

- The user has a song concept, a hook line, or a draft set of lyrics and wants to organise them.
- The user is stuck on a bridge or a second verse.
- The user wants section labels and a rhyme map before writing words.

## Instructions

1. Confirm the song's emotional throughline in one sentence. If unclear, ask once.
2. Lay out six sections in this order: Verse 1, Chorus, Verse 2, Chorus, Bridge, Final Chorus.
3. For each section, write:
   - **Job**: one short line stating what this section must accomplish.
   - **Rhyme scheme**: e.g. `ABAB`, `AABB`, `ABCB`.
   - **Syllables per line**: a target range (e.g. 7 to 9).
   - **Prosody note**: where stresses should land relative to the downbeat.
4. The chorus rhyme scheme and syllable count must stay constant across all three chorus repeats. The bridge should break at least one of: rhyme scheme, syllable count, melodic register.
5. Verse 2 should advance the situation, not restate Verse 1. Note this explicitly.
6. End with a one-line summary of the contrast the bridge creates.

## Examples

### Example 1 — A breakup song with a steady chorus

**Input:**
> I want a song about realising the relationship ended months before either of us said it.

**Expected behaviour:**

> Throughline: the moment of recognising a quiet ending.
>
> **Verse 1** — Job: set the room and the small detail that triggers the realisation. Rhyme: ABAB. Syllables: 8 to 9. Prosody: line one starts on the downbeat.
>
> **Chorus** — Job: name the realisation in plain language. Rhyme: AABB. Syllables: 7. Prosody: hook lands on beat one of the second bar.
>
> **Verse 2** — Job: zoom out from the room to a memory months earlier. Rhyme: ABAB. Syllables: 8 to 9. Prosody: same as Verse 1.
>
> **Chorus** — Same scheme, same syllables, same melody. No new information.
>
> **Bridge** — Job: shift from observation to a question to the other person. Rhyme: ABCB. Syllables: 5 to 6. Prosody: pickup notes, register one third higher.
>
> **Final Chorus** — Same scheme. The last line repeats with one word changed.
>
> Bridge contrast: shorter lines, higher register, direct address.

### Example 2 — Up-tempo song with a strong hook word

**Input:**
> I have the hook "we were always summer" and I want a structured shell for it.

**Expected behaviour:**

> Throughline: a friendship that only ever lived in one season.
>
> **Verse 1** — Job: place the hook in time, name the year. Rhyme: AABB. Syllables: 9 to 10. Prosody: conversational, anacrusis on each line.
>
> **Chorus** — Job: deliver the hook twice with one image around it. Rhyme: ABAB. Syllables: 6. Prosody: hook on the downbeat, both times.
>
> **Verse 2** — Job: jump forward to the present and a detail that proves the season ended. Rhyme: AABB. Syllables: 9 to 10.
>
> **Chorus** — Identical to first chorus.
>
> **Bridge** — Job: collapse the time gap into one image. Rhyme: free, no end rhyme. Syllables: variable, 4 to 8. Prosody: half-time feel.
>
> **Final Chorus** — Identical scheme. Add a tag of the hook line a cappella at the end.
>
> Bridge contrast: rhyme drops out and the rhythm halves.

## Resources

None.

## Notes & limitations

- The skill assumes a Western pop song form. It does not cover through-composed forms, modal folk, or rap structures.
- The syllable targets are guidance, not rules. The skill should never reject a strong line for being one syllable off.
- The skill produces a scaffold, not finished lyrics.

## Changelog

- `0.1.0` — initial version.
