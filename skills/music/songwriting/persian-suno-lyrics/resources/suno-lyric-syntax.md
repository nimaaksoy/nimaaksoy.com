# Suno lyric syntax — bracket, parenthesis, pipe, meta-tags

The mechanical syntax inside Suno's Lyrics field. Universal — works for Persian as well as English. None of this is about pronunciation or meaning; it's about which symbol does what.

---

## `[ ]` vs `( )` — instructions vs secondary lyrics

These are **not interchangeable**:

| Symbol | Read by Suno as | Performed? |
|---|---|---|
| `[ ... ]` | Instructions to Suno — section markers, production cues, vocal direction | **Not sung.** The text inside is invisible to the listener. |
| `( ... )` | Secondary lyrics | **Sung** as backing vocals, harmonies, ad-libs, or echoes. |

Examples:

- `[Chorus | belted hook]` — Suno understands "this section is a belted-hook chorus". The bracket text is never heard.
- `این صدا (تو رو میخواد)` — Lead sings *این صدا*, backing voice answers *تو رو میخواد*. Both are performed.

Use parentheses deliberately. They're the cleanest way to design a call-and-response chorus without needing a separate `[duet]` tag:

```
[Chorus]
هنوز این شب (صدای توئه)
هنوز این در (نگاهِ توئه)
هنوز اینجام (تو نیستی)
هنوز قلبم (با ردِّ توئه)
```

---

## The pipe `|` — stacking cues inside one bracket

The pipe is an AND operator inside a single bracket. Combine 2–4 cues per bracket — five or more dilutes the effect.

```
[Chorus | belted hook | stacked harmonies | bass drop]
```

Order from broadest to most specific:

1. Section name or core element first
2. Vocal character second
3. Instrumental / mix cue third
4. Effect cue fourth

Bad: `[bass drop | belted | stacked | Chorus]` — section name buried at the end.

Good: `[Chorus | belted | stacked harmonies | bass drop]` — Suno parses left-to-right and weights early cues more.

Keep each bracket under ~80 characters. Beyond that, Suno's confidence drops.

---

## Specialty meta-tag vocabulary

Section tags Suno reliably recognises:

`[Intro]` `[Verse]` `[Pre-Chorus]` `[Chorus]` `[Post-Chorus]` `[Bridge]` `[Hook]` `[Build]` `[Drop]` `[Breakdown]` `[Interlude]` `[Solo]` `[Outro]` `[End]` `[Fade In]` `[Fade Out]`

For repeats with variation: `[Verse 1]`, `[Verse 2]`, `[Final Chorus]`, `[Reprise]`, `[Quiet Bridge]`.

### High-value specialty tags for Persian songs

These are the bracket cues that pay off for Persian production. (For the full ~70-tag catalogue, see *Suno Prompt Engineer* skill's `resources/meta-tag-dictionary.md`.)

**Energy and dynamics**

- `[crescendo]` — gradual volume / intensity rise. Good before a final chorus.
- `[swell]` — momentary surge on a sustained note. Works under a `جان~~` hold.
- `[half-time breakdown]` — drum tempo halves while key/mood stays. Pop and modern indie love this.
- `[power-off drop]` — abrupt glitchy silence after a build. Modern/electronic Persian.
- `[fade: out]` — gradual fade. Default for emotional ballads.
- `[silence: 2s]` — explicit pause. Use sparingly.

**Vocal direction**

- `[ad-lib]` — improvised vocal flourishes, typically backing.
- `[call-and-response]` — lead sings a line, backing answers. Pairs naturally with `( ... )`.
- `[chant]` / `[chant-loop]` — repeated rhythmic vocal phrase. Useful for tribal-leaning Persian or hook intensification.
- `[vulnerable vocals]` — exposed, intimate, stripped delivery. Bridges.
- `[shout: gang]` — gang shout on a single word. Final-chorus accent.
- `[ad-lib]` over a final chorus: stack with the chorus brackets — `[Final Chorus | full band | gang shouts | ad-lib]`.

**Harmonic / compositional**

- `[modulation: ascending]` — key change up. Classic final-chorus lift.
- `[pedal-point]` — sustained bass note while chords shift above. Mystical/traditional Persian sits well on this.
- `[counterpoint]` — two melodic lines simultaneously. Bridges in art-pop / fusion.

**Production**

- `[reverb: hall]` / `[reverb: gated]` — apply to a single section.
- `[echo: tape]` / `[echo: slapback]` — section-level echo style.
- `[layering: four-part vocal stack]` — explicit stacking depth.
- `[stereo: wide]` — widen the field for the marked section only.

**Track-level (use once, at top or bottom)**

- `[no-repeat]` — Suno doesn't repeat verses verbatim. Useful when you wrote two distinct verses and don't want them collapsed.
- `[sequence: intro, verse, chorus, verse, chorus, bridge, chorus, outro]` — pin the song shape.
- `[length: 210]` — target seconds. Use when you need a specific runtime.
- `[language: Persian]` — explicitly set language. Belt-and-braces with Persian-script lyrics.

---

## Chorus escalation across repeats — same lyric, growing production

A common AI-lyric failure is identical chorus repeats producing identical musical sections. The song stays flat. Suno reads each chorus's brackets independently — give them different cues and the energy will build.

### Default escalation

| Chorus instance | Cues to add |
|---|---|
| First chorus | Standard production. Establish the hook. |
| Middle chorus | + stacked harmonies, layered backing, slight textural shift |
| Final chorus | + bigger drums, gang shouts / chant-style backing, an extra instrumental layer |

### Example — same Persian chorus, escalating cues

```
[Chorus | belted hook | full band]
هنوز این شب، صدای توئه
هنوز این در، نگاهِ توئه

[Chorus | stacked harmonies | doubled vocal | tape saturation]
هنوز این شب، صدای توئه
هنوز این در، نگاهِ توئه

[Final Chorus | bigger drums | gang shouts | ad-lib | wide stereo]
هنوز این شب، صدای توئه
هنوز این در، نگاهِ توئه
```

The lyric is identical. The brackets escalate. Suno reads this as "build energy across the song."

### Optional — vary one or two final-chorus lines for climax

Keep the hook intact; modify only the surrounding lines. A short lyric variation in the final chorus is a stronger climax signal than escalating production cues alone:

```
[Final Chorus | bigger drums | gang shouts]
هنوز این شب، صدای توئه          (hook — unchanged)
هنوز این در، نگاهِ توئه          (hook — unchanged)
ولی این بار، اون چراغ هم میشنوه  (modified — climax)
که این خونه دیگه برمی‌گرده       (modified — climax)
```

---

## Avoid in Persian songs

The English tag `[acoustic]` triggers Suno's acoustic-guitar default and can override Persian-instrument cues. Use `[fingerpicked guitar]` or `[nylon guitar]` instead.

`[live]`, `[stadium]`, `[arena]`, `[crowd]`, `[concert]`, `[unplugged]` all trigger live-recording sound (room reverb + audience noise). Avoid unless the song is meant to sound like a live performance. The trigger fires on the root — `[live-style]`, `[live-tracked]`, `[unplugged-feel]` are all equally contaminated.

For "anthemic" or "gang" energy without the live trigger, use `[gang shouts]`, `[anthemic backing vocals]`, or `[shouted backing vocals]`.
