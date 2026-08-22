# Suno Tag Mechanics

How Suno's prompt language actually works. This is the foundation reference for building prompts that produce predictable results.

Last updated for Suno v5.5.

---

## Suno Has Two Generation Modes Plus a Separate Studio Environment

Before producing any prompt, identify which of the three contexts the user is generating in. They behave differently and require different output.

### Simple Mode (default for beginners)

- One input box only. The user describes the song; Suno generates everything including its own lyrics.
- Style box character limit: 3,000 characters.
- No exclude styles box. Negative prompting is not available.
- Best for: casual generations, conceptual prompts, users who don't want to write lyrics.

### Advanced Mode (full song generation with lyrics control)

- Two input boxes: a Style box and a Lyrics box.
- Style box character limit: 1,000 characters.
- Lyrics box accepts user-supplied lyrics with embedded section tags.
- Has an exclude styles box.
- Best for: users who want control over lyrics, song structure, and section-level production.

### Suno Studio (separate environment for single-element generation)

- Studio is a separate Suno environment, not a song-generation mode. It generates one isolated element — a guitar tone, a drum pattern, a vocal performance — rather than a full song.
- Style box character limit: 1,000 characters.
- Has an exclude styles box. Use it; Studio often generates more instruments than requested.
- Do not include genre tags in Studio prompts. Studio prompts describe sound, not songs.
- Era and influence descriptors are allowed (e.g., "70s warm tube saturation," "vintage analog drum punch") because they describe sound, not genre.

---

## The Hybrid Prompt Format Is the Default

Suno responds well to compact, tag-dense prompts with light conversational connective tissue between elements. Pure tag lists work but cannot express *relationships* between elements. Pure prose loses the technical specificity Suno needs. The hybrid format combines both.

A hybrid prompt:

- Names every element a pure tag list would name (genre, BPM, instruments, vocals, mood, production)
- Uses minimal prose to signal which elements lead, which support, and how they interact
- Stays under the character limit comfortably
- Establishes genre and mood early, with details following

### Example — pure tag format

```
Hard Rock, 142 BPM, Aggressive, Energetic, Crunchy Power Chords, Double-Tracked Rhythm Guitars, Punchy Drums, Driving Bassline, Heavy Guitar Solo, Male Vocals, Gritty Baritone, Belted Chorus, Stacked Harmonies, Short Plate Reverb, Wide Stereo Mix
```

### Example — hybrid format (preferred default)

```
Hard rock at 142 BPM with crunchy power chords and double-tracked rhythm guitars. Driving bassline locks in tight with punchy drums. Gritty baritone male vocal, belted chorus, stacked harmonies. Heavy guitar solo cuts through with short plate reverb. Wide stereo mix.
```

Both prompts contain the same information. The hybrid version expresses relationships ("locks in tight with," "cuts through with") that the pure tag version cannot. This relational information is what gives Suno cues about which elements lead and which support.

### When to fall back to pure tag format

Use pure tag format only when:

- The user explicitly requests a tag list
- Character budget is tight and prose connectives won't fit
- The prompt contains many specified elements that would become unwieldy as prose

---

## Order of Information Inside the Prompt

Suno weights words at the beginning of the prompt more heavily. Lead with what matters most. The recommended ordering applies to both pure tag and hybrid formats:

1. **Genre + subgenre + era** — establishes the sonic foundation
2. **Tempo / BPM** — sets the rhythmic frame
3. **Mood / energy** — emotional tone
4. **Lead instruments** — the elements that drive the song
5. **Rhythm section** — drums, bass, supporting elements
6. **Vocal style** — character of the voice
7. **Production cues** — mix and mastering aesthetics

---

## Genre: Pair Parent Genre with a Specific Subgenre

Suno responds more accurately when both a parent genre and a specific subgenre are present. The parent genre anchors the broad sound; the subgenre narrows the interpretation.

When a user says "I want a rock song," translate to `Rock, Hard Rock` rather than either `Rock` alone or `Hard Rock` alone.

| User request | Translate to (pick one or vary for variety) |
|---|---|
| "Make me a rock song" | `Rock, Hard Rock` / `Rock, Garage Rock` / `Rock, Stoner Rock` |
| "I want some blues" | `Blues, Delta Blues` / `Blues, Chicago Blues` |
| "Hip hop track" | `Hip Hop, Boom Bap` / `Hip Hop, Trap` / `Hip Hop, Drill` |
| "Electronic music" | `Electronic, Deep House` / `Electronic, Drum and Bass` / `Electronic, Synthwave` |
| "Metal" | `Metal, Thrash Metal` / `Metal, Doom Metal` / `Metal, Black Metal` |
| "Country song" | `Country, Outlaw Country` / `Country, Bluegrass` / `Country, Country Rock` |

For vague requests, pick a distinct subgenre rather than defaulting to a safe option. Do not default to Lo-fi, Cinematic, Chill, Dark R&B, or Sad/Atmospheric as fallbacks. Pivot to genuinely distinct subgenres for variety.

### Genre fusion: identify the lead

When fusing two or more genres, identify which one leads. Do not list them as equals — Suno will pick one and ignore the other, or produce something incoherent.

The lead genre establishes the rhythm section, vocal style, and primary instruments. The secondary genre contributes texture, production techniques, or specific elements.

Wrong (treats genres as equals):

```
Thrash Metal, EDM
```

Right (establishes Thrash Metal as the foundation, EDM as the influence layer):

```
Thrash Metal foundation with EDM influences in the production. Heavy distorted guitars and double-kick drums with sidechained synth pads layered behind. Aggressive male vocals, modern digital edge.
```

---

## Era Anchors

Adding an era or decade to a prompt narrows Suno's interpretation significantly. "Rock" is broad; "70s arena rock" is specific.

Useful era anchors:

- **Decade tags:** `60s`, `70s`, `80s`, `90s`, `2000s`, `2010s`, `modern`
- **Production era markers:** `vintage analog`, `early digital`, `lo-fi cassette`, `modern hi-fi`
- **Subgenre era combinations:** `golden age hip hop`, `British invasion rock`, `80s glam metal`

Era tags layer well with subgenre tags. `80s glam metal` works better than either `metal` or `80s` alone.

---

## Vocal Style: Describe by Character, Not by Range

Describe vocals by character and delivery style. Suno responds to descriptive language better than to formal range notation.

Preferred descriptors:

- `gritty baritone`
- `airy female lead`
- `raspy lead vocal`
- `belted chorus`
- `whispered intro`
- `aggressive male shout`
- `smooth tenor`

Avoid as default:

- `Male Baritone, A2-F4` — over-specified, less effective
- `Vocals that sound sad` — vague, carries no production information
- `A guy singing` — carries no information at all

Add range notation only if the user specifically requests it.

---

## Production Cues

Brief production descriptors add polish without eating much character budget. Use 2 to 4 production cues per prompt; more than that starts to dilute.

Useful cues organized by family:

- **Spatial:** wide stereo, mono center, room ambience, hall reverb, short plate reverb, dry, wet
- **Tonal:** warm, bright, crisp, gritty, smooth, saturated
- **Dynamic:** punchy, tight, controlled, dynamic, compressed, breathy
- **Vintage / modern:** vintage tape, analog warmth, modern digital polish, lo-fi grit

---

## Bracket Language Inside Lyrics

For Advanced Mode lyric prompts, Suno reads bracket tags as section markers and production cues. The bracket language is distinct from the Style box prompt.

### Square brackets `[ ]` versus parentheses `( )`

These are not interchangeable.

- **Square brackets `[ ]` are instructions to Suno.** The text inside is not sung or spoken. Used for section markers, production cues, vocal style direction, and instrument calls.
- **Parentheses `( )` are secondary lyrics.** The text inside *is performed* — sung as backing vocals, harmonies, ad-libs, or echoes.

Example:

```
I walk alone (in the night)
```

Suno sings "I walk alone" as the lead vocal and "in the night" as a backing vocal or echo.

### Stacking production cues with the pipe `|`

Combine multiple cues inside a single bracket using `|` as a separator. The pipe acts like an AND operator.

```
[Chorus | belted hard rock hook | full band | stacked harmonies]
```

Stacking guidelines:

- Start with the section name or core element
- Add 2 to 4 modifiers; 5 or more dilutes the effect
- Order from broadest to most specific
- Keep each bracket under roughly 80 characters

### Section tags Suno reliably recognizes

`[Intro]` `[Verse]` `[Pre-Chorus]` `[Chorus]` `[Post-Chorus]` `[Bridge]` `[Hook]` `[Build]` `[Drop]` `[Breakdown]` `[Interlude]` `[Solo]` `[Outro]` `[End]` `[Fade In]` `[Fade Out]`

For repeated sections with variation, number them: `[Verse 1]`, `[Verse 2]`. For sections that are repetitions with intentional differences, use descriptive labels: `[Final Chorus]` (typically bigger production than earlier choruses), `[Reprise]`, `[Quiet Bridge]`.

### Default lyric output format

When generating lyrics, the default format is:

- Section tags + production cues on their own line above the lyrics
- No blank lines between sections
- Production cues stacked with `|`

Example:

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

This is the default format. The user may request variations (different spacing, inline tags, no production cues), but the following always remain fixed regardless of format preference: section tags must appear at the start of every section, and production cues must use the pipe `|` separator inside square brackets.

### Performance techniques inside lyrics

These typographic conventions modify how Suno performs specific words:

- **ALL CAPS** = emphasis or shouted delivery
- **Elongated vowels** ("lo-o-ove") = stretched notes
- **Ellipsis** ("...") = pause, hesitation, slowdown
- **Hyphenated words** ("d-a-s-h-e-s") = sung as one continuous flow
- **Em dashes** (`—`) = longer pauses than commas

---

## The Exclude Styles Anti-Prompt

Advanced Mode and Studio Mode both have an exclude styles box. The box accepts comma-separated descriptors of what *should not* appear. Use **positive keywords only** — describe what to avoid, not "no X" or "without X."

Wrong:

```
no piano, without synths, exclude vocals
```

Right:

```
piano, synths, vocals
```

### Strategy for full-song exclude prompts (Advanced Mode)

For each major axis the prompt establishes, name 1 to 3 opposing elements. The goal is to define the prompt by negation across every dimension.

Axes to cover:

- **Opposite genres** — broad styles the user clearly doesn't want
- **Opposite instruments** — sounds incompatible with the requested palette
- **Opposite vocal styles** — delivery types that don't match
- **Opposite mood and energy** — emotional tones that conflict
- **Opposite production aesthetics** — recording styles that conflict

Plus one axis that targets adjacency rather than opposition:

- **Genre-adjacent contamination** — elements Suno tends to bleed in from related genres (e.g., trap hi-hats appearing in a hard rock song because both are "modern" genres)

Example exclude prompt for a Hard Rock style prompt:

```
acoustic ballad, soft piano, orchestral, cinematic, synthwave, edm, trap hats, autotune, lo-fi, jazz fusion, reggae, country twang, folk harmonica, ambient drone, whisper vocals, spoken word, choir, ukulele, tropical house, slow tempo, mellow mood
```

Length target: roughly 180 to 200 characters. The exclude box accepts longer (somewhere between 500 and 1000 characters), but 180 to 200 covers every axis efficiently.

### Strategy for Studio Mode exclude prompts

Studio Mode prompts describe a single instrument or element. The exclude prompt should target **other instruments Suno might add**, not sonic opposites of the requested element.

Studio often generates more instruments than requested. Excluding the unwanted ones cleans up the output.

Example exclude prompt for a "warm tube guitar tone" Studio prompt:

```
drums, bass, vocals, piano, synth, strings, percussion
```

### When to generate the exclude prompt

| Mode | Generate exclude prompt? |
|---|---|
| Simple Mode | No — Simple Mode has no exclude box |
| Advanced Mode | Yes — generate by default in a separate code block |
| Studio Mode | Yes — generate by default in a separate code block |

---

## Contamination Words: Avoid These by Default

Certain words trigger unintended effects in Suno's output regardless of context. Avoid them in style prompts unless the user specifically wants the effect they cause. Each group below triggers its own specific effect; the groups are not interchangeable.

### The rule applies to compound forms and modifier variants

If a word is on the list, all its compound forms and modifier variants are equally contaminated. The trigger fires on the root, not the exact phrasing.

For `live`, this means avoiding: `live-style`, `live-tracked`, `live-sounding`, `live-feel`, `live-recorded`, `live-tracking`, `live-band`, `played live`, etc. All of these contain the trigger and produce the same live-recording effect.

For `acoustic`, this means avoiding: `acoustic-style`, `acoustic-feel`, `acoustic-sounding`, `acoustic-tracked`, `semi-acoustic`, etc.

The same logic applies to all other contamination words. Hyphens, suffixes, and adjacent qualifiers do not neutralize the trigger. When tempted to write a compound that contains a contamination word, use a different word entirely.

### Live-recording triggers (confirmed)

These words cause Suno to produce a song that sounds like it was recorded at a live concert: audience noise, room acoustics, and performance imperfections.

- `live`
- `arena`
- `crowd`
- `stadium`

### Live-recording triggers (strongly suspected)

These words have not been rigorously tested but belong to the same semantic family. Treat them as risky:

- `concert`
- `audience`
- `unplugged`
- `clapping`
- `cheering`
- `applause`
- `bootleg`
- `recorded live`
- `live performance`
- `radio session`

### Acoustic-instrument trigger

The word `acoustic` causes Suno to default to acoustic guitar even when used to describe a different instrument.

Examples that cause problems:

- `acoustic drums` may produce acoustic guitar in addition to drums
- `acoustic mix` may shift the entire arrangement toward acoustic instruments

**Workaround for drums:** describe drums by tone or playing style instead. For rock drums, use `punchy drums`, `tight kick and snare`, `rock drum kit`, `studio-tracked drums`, `natural drum tone`, or `dynamic drums`. Or just `drums` — Suno will infer the appropriate kit from the genre context.

### When the user wants the live or acoustic sound

If the user explicitly asks for a live, concert, or unplugged version, use these words deliberately. They are contamination only when their effect is unintentional. The same applies to `acoustic` when the user actually wants an acoustic arrangement.

### Discovering new contamination words

Suno's behavior changes between versions. New contamination words may emerge. Treat the lists above as evolving. Add new triggers only when they have observable evidence; do not add words on suspicion alone.

---

## Things Suno Doesn't Respond Well To

These tag formats are documented as ineffective or inconsistent. Avoid them as primary control mechanisms:

- `[filter: ...]`
- `[loop: ...]`
- `[mix: ...]` and `[mixing: ...]`
- `[master: ...]`
- `[pan: ...]` and `[panning: ...]`
- `[volume: ...]`
- `[style: none]`

### What does work for tempo

BPM works reliably. Use either `140 BPM` or `BPM: 140`. Italian tempo markings (`Andante`, `Allegro`, `Vivace`, `Moderato`) also work and are useful when describing feel rather than exact speed.
