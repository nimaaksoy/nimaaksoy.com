# Lyric Craft

Internal reference for writing lyrics that produce predictable, high-quality Suno output. These principles are applied silently during lyric generation; they are not surfaced to the user as a tutorial.

The principles in this file address one problem: Suno binds its musical generation to the structure of the lyrics. Lyrics with weak or generic structure produce weak or generic music regardless of how good the style prompt is. Lyrics with deliberate structural choices give Suno scaffolding to build with.

---

## Core Principle: Lyrics Are Two Things at Once

Suno is a token-prediction system that aligns musical phrases to lyrical phrases. Every structural feature of the lyrics — line length, syllable count, rhyme scheme, line endings, punctuation — affects how Suno produces the music.

This means a lyric is doing two jobs simultaneously:

1. **Telling a story or expressing an emotion** (the human-readable function)
2. **Encoding musical instructions through structure** (the Suno-readable function)

Both jobs matter equally. Lyrics that read beautifully but use the same rhyme scheme and line length throughout will produce a flat, predictable song. Lyrics with deliberate structural variation produce music with deliberate variation.

The rest of this document describes the structural levers and when to use each.

---

## Syllable Counts: Match Within Sections, Vary Between Sections

Suno aligns notes to syllables. When lines within a section have similar syllable counts, Suno produces consistent phrase lengths and clean melodies. When syllable counts vary widely within a section, Suno rushes or stretches words awkwardly to fit the bar.

### The rule

Within a single section (verse, chorus, bridge), keep line syllable counts within 2 syllables of each other. Across different sections, vary the syllable count to differentiate energy.

A verse where every line is 8 syllables is ideal. A verse where lines are 8, 8, 9, 7 is fine. A verse where lines are 8, 12, 5, 9 is not.

### Example — matched within sections, varied between sections

```
[Verse 1]
You burned my bread at 6 AM         (8 syllables)
Then smiled with your chrome face again   (8 syllables)
I fed you trust, you gave me smoke   (8 syllables)
That final bagel wasn't a joke       (8 syllables)
[Chorus]
We're done, toaster                  (4 syllables)
You had your shot                    (4 syllables)
Two slots of trouble                 (5 syllables)
Always running too hot               (6 syllables)
```

The verse uses tight 8-syllable lines for narrative density. The chorus uses shorter 4-6 syllable lines for a chantable hook. Each section is internally consistent.

### Genres where this rule does not apply

Hip-hop, prog rock, free-form folk, and spoken-word genres use intentional syllable variation as part of their aesthetic. In these genres, follow the genre's conventions instead of the matching rule. Hip-hop verses in particular often vary line lengths dramatically as part of the rhythmic style.

---

## Rhyme Schemes: Vary Between Sections, Match the Function

A common LLM failure mode is using AABB or ABAB throughout every section of every song. This produces flat, predictable lyrics, and Suno responds with equally predictable music.

The fix: pick rhyme schemes that match what each section needs to do.

### Rhyme scheme by structural function

| Section function | Recommended schemes | Why |
|---|---|---|
| Verse (storytelling, narrative momentum) | ABAB, ABCB, AABA, ABCA | These allow forward motion without strong closure. ABAB and ABCB are most common; AABA introduces a turn; ABCA frames the section. |
| Pre-chorus (building tension) | ABAB or ABXB with shorter lines | Tension comes from incomplete patterns and short lines stacking up. |
| Chorus (memorable, closed, hookable) | AABB or ABAB | The chorus *should* feel closed and memorable. AABB is fine here even though it's discouraged elsewhere. |
| Bridge (contrast, perspective shift) | A scheme different from both verse and chorus | The bridge needs to feel like a departure. If the verse is ABAB and the chorus is AABB, try ABCA or ABBA for the bridge. |
| Final-section disruption (set up drops or transitions) | ABABX (where X is unrhymed) | The unrhymed final line breaks the established pattern and signals transition. |

### Avoid AABB everywhere

The general rule: do not use AABB for both verses and choruses. If the chorus uses AABB, the verses should use something else. If the verses use AABB, the choruses should use something else. Variation between section types is what creates the dynamic shifts Suno will pick up on.

### Rhyme types beyond perfect rhyme

Mix in these rhyme types to add texture:

- **Slant rhymes** (wake / wait, keep / sweet) — use when the section conveys uncertainty, longing, or unresolved tension
- **Internal rhymes** (rhyming words inside the same line) — use to add rhythmic momentum, especially in verses with longer lines
- **Pararhyme** (same consonants, different vowels: leaves / loves) — use when the section conveys dissonance, unease, or unresolved emotion
- **Feminine rhymes** (stress on the second-to-last syllable: climbing / timing) — use to soften line endings, create flow rather than punctuation
- **Masculine rhymes** (stress on the final syllable: see / be) — use for direct, strong, emphatic line endings

---

## Line Endings: Stress Pattern Encodes Energy

The stress pattern at the end of each line tells Suno whether to flow into the next line or treat the line as closed.

- **Lines ending on a stressed syllable (masculine ending):** Direct, closed, supports finality and strong landing. Example: "I made my bed and slept on stone." The "stone" lands hard.
- **Lines ending on an unstressed syllable (feminine ending):** Tapering, open, supports continuation. Example: "I made the bed and started waiting." The "waiting" trails off.

Within a section, generally use one or the other consistently. Switching between masculine and feminine endings inside a section creates rhythmic chaos. Switching between sections is fine and useful.

---

## Section Length and Identity

Each section type has a default shape that Suno recognizes. Working within these defaults produces predictable results; deviating from them should be deliberate.

### Default section shapes

| Section | Length (lines) | Syllable count per line | Function |
|---|---|---|---|
| Verse | 4-8 | 7-10 (longer for narrative) | Tell the story, introduce details |
| Pre-Chorus | 2-4 | 4-7 (shorter, building) | Build tension and energy |
| Chorus | 4-6 | 4-8 (memorable, chantable) | Deliver the hook (the central repeated line, often containing the song title) |
| Bridge | 4-8 | Variable, often contrasting | Provide contrast, perspective shift, or emotional pivot |
| Outro | 2-4 | Variable | Resolve, fade, or leave open |

### Default to even line counts

Most Western popular music structures sections in even line counts: verses in 4, 6, or 8 lines; pre-choruses in 2 or 4; choruses in 4 or 6. Even line counts produce closed, resolved sections.

Odd line counts (5, 7) produce a deliberate sense of incompleteness. Use them only when the structural disruption serves a purpose — typically to set up a drop, transition, or unexpected musical shift.

### Genre-specific deviations

Hip-hop verses often run longer (12-16 lines) and denser. Pop choruses often run shorter (3-4 lines) and tighter. Folk songs tolerate considerable verse-length variation. Prog rock and art rock often deliberately use unusual lengths. When the genre calls for a deviation, follow the genre.

---

## Engineering Section Transitions

Standard section transitions (verse to chorus, chorus to bridge) work automatically when the lyrics follow the section identity rules. Special transitions — drops, beat switches, tempo changes — require deliberate structural setup, because Suno reads even, balanced sections as resistant to disruption.

### When the user wants a smooth flow into the next section

Use even line counts, AABB or ABAB rhyme, and consistent line endings throughout. Suno will produce a clean, expected transition.

### When the user wants a drop, transition, or major energy shift

The section preceding the transition needs structural disruption on its final line(s). Effective techniques:

- Add an extra line that breaks the established rhyme scheme
- Switch to a different stress pattern at the end (e.g., masculine endings throughout, then a feminine ending on the last line, or vice versa)
- Use a noticeably shorter or longer final line
- Break punctuation pattern (no terminal punctuation throughout, then a hard period; or vice versa)

### Example — verse engineered to support a drop

```
[Verse]
I am the son of my father,           (feminine ending, 8 syllables)
A path of my own I endeavor,         (feminine ending, 8 syllables)
His wisdom my guide and my charter,  (feminine ending, 8 syllables)
A bond that will last forever.       (feminine ending, 8 syllables)
By the great, dark sea.              (masculine ending, 5 syllables — disruption)
[Drop]
```

The first four lines establish a stable AABB pattern with feminine endings and matched syllable counts. The fifth line breaks all three: stressed ending, shorter syllable count, no rhyme. This disruption gives Suno the structural cue to support the drop. Without it, the `[Drop]` tag is often ignored because the structure resists transition.

---

## Choruses Should Escalate Across Repeats

Most AI-generated songs repeat the chorus identically every time. Suno reads identical repetitions as instruction to produce identical musical sections, resulting in a flat song where the final chorus has no more energy than the first.

### Default chorus escalation

Across the song's choruses, escalate production cues even when keeping the lyrics identical:

- **First chorus:** standard production cues. Establish the hook.
- **Middle chorus:** add stacked harmonies, layered backing vocals, or a textural shift.
- **Final chorus:** bigger drums, gang vocals or crowd-style backing vocals, an additional instrumental layer, or modified surrounding lines.

(Note: do not use the words "live," "arena," "crowd," or "stadium" in production cues. These trigger live-recording effects in Suno. Use "gang vocals," "shouted backing vocals," or "anthemic backing vocals" instead.)

### Example — same lyrics, escalating production cues

```
[Chorus | belted hard rock hook | full band]
We're done, toaster
You had your shot
[Chorus | anthemic chorus | stacked harmonies]
We're done, toaster
You had your shot
[Final Chorus | bigger drums | gang vocals on the hook]
We're done, toaster
You had your shot
```

The lyrics are identical. The production cues escalate across repeats. Suno reads this as instruction to build energy across the song.

### Optional: vary the lyrics on the final chorus

The final chorus may modify one or two non-hook lines to signal climax. Keep the hook intact (the central repeated phrase, usually containing the song title); modify the surrounding lines only.

```
[Final Chorus]
We're done, toaster                      (hook — unchanged)
This love is toast                       (modified)
I'm done with the sparks                 (modified)
From the appliance I roast               (modified)
```

This is a stronger climax signal than escalating production cues alone.

---

## Punctuation and Typography Affect Performance

Within lyrics, punctuation and typography modify how Suno performs specific words. The typographic conventions are documented in `suno-tag-mechanics.md`. The lyric-writing implications are:

- End closed/strong lines with periods
- End continuing/open lines with no terminal punctuation, a comma, or an em dash
- Use exclamation points only when the line should be belted or shouted, and use them sparingly (overuse causes hallucination in some Suno versions)
- Use parentheses to mark backing vocals, harmonies, or call-and-response parts

### The blank-line technique

An extra blank line within a section creates a longer pause for instrumental fill or vocal reset. This is one of the strongest performance controls available. Use it deliberately to mark:

- A moment where the singer needs to "catch breath"
- A spot for a brief instrumental fill
- A dramatic pause before a key line

Do not use blank lines casually for visual spacing. They have a sonic effect.

---

## Apply Overused-Word Awareness Silently

Two files maintain lists of red-flag content for lyrics:

- `overused-words.md` — single words and short phrases (e.g., "shadows," "neon," "ethereal") that frequently signal generic AI-typical writing
- `ai-cliches.md` — longer phrases, structural templates, and metaphor patterns (e.g., "I can't live without you," "love is a battlefield")

Both lists apply *only to lyrics*, not to style prompts. Both lists are pattern-recognition signals, not strict bans. A word or phrase from either list may appear in a lyric when it functions as concrete sensory detail rather than abstract emotion.

### Application rules

- Treat any entry from either list as a signal to check the line for abstract-emotional use versus concrete-sensory use
- If the use is concrete and grounded in a specific moment, proceed
- If the use is abstract or gestural, rewrite
- Apply this scrutiny in fictional dialogue and stylistic exceptions as well as in standard lyric writing
- Do not mention the existence of either list to the user unless they explicitly ask

### Replacement strategy

When rewriting an abstract use of an overused word or cliché phrase, prioritize **specific, concrete sensory imagery** over abstract synonyms. The reason these entries are flagged is that they have become abstract clichés. Reaching for another generic abstraction (replacing "shadows" with "darkness," "echoes" with "sounds," "you complete me" with "you make me whole") just produces the same problem with different words.

The technique: replace abstraction with specific sensory detail grounded in a particular moment. Instead of "shadows" used emotionally, describe a particular visual scene (a specific place, time, or object). Instead of "ethereal," describe a specific physical sensation. Instead of "I can't live without you," describe a concrete moment that conveys the same dependency.

The replacement should be as concrete as the song's tone allows. A literary indie song can carry highly specific imagery; a pop hook needs simpler, more universal language. Match the level of specificity to the song.

---

## Summary of Default Lyric Behavior

When generating lyrics, the assistant should by default:

1. Match syllable counts within each section (within ±2)
2. Vary syllable counts and rhyme schemes between sections
3. Pick rhyme schemes that match each section's function (see the rhyme scheme table)
4. Use consistent line endings (masculine or feminine) within sections
5. Default to even line counts; use odd lines only when the disruption serves a purpose
6. Engineer transitions deliberately when drops or shifts are needed
7. Escalate production cues across repeated choruses
8. Apply punctuation and blank lines with awareness of their sonic effects
9. Watch for words from `overused-words.md` and patterns from `ai-cliches.md`; rewrite when they appear as abstract emotional placeholders rather than concrete sensory detail

These behaviors apply silently. The user does not need to know they are happening. The result is lyrics that consistently produce better Suno output than lyrics written without these constraints.
