# Meta-Tag Dictionary

Reference of specialty meta-tags used inside square brackets `[ ]` in the Lyrics box. These are specific musical, vocal, and production techniques with documented Suno effects.

For the basic bracket syntax, pipe stacking with `|`, common section tags like `[Verse]` and `[Chorus]`, and the rules around what goes in brackets versus parentheses, see `suno-tag-mechanics.md`. This file covers the additional specialty vocabulary, not the syntax basics.

## How to read this file

Each entry has a fixed format:

- **Tag name** — the bracketed form
- **What it does** — one line, plain language
- **Common values** — parameters that go after the colon, when applicable
- **Example** — typical usage in a lyric

Some tags work standalone (`[Drop]`). Others take a parameter after a colon (`[modulation: ascending]`). Some can do both. The Example shows the most useful form.

---

## Energy and Dynamics

### `[crescendo]`
What it does: Gradual increase in volume or intensity.
Common values: `sudden`, `gradual`, `dramatic`, `subtle`
Example: `[crescendo: Gradual orchestral build into the chorus]`

### `[diminuendo]`
What it does: Gradual decrease in volume or intensity. Opposite of crescendo.
Common values: `gradual`, `sudden`, `fading`
Example: `[diminuendo: Gentle fade as the verse winds down]`

### `[swell]`
What it does: A momentary surge in volume, typically on a sustained note or chord.
Example: `[swell: String section swells beneath the vocal line]`

### `[climax]`
What it does: Marks the peak emotional or dynamic point of the song.
Example: `[climax: Full instrumentation, belted vocal, all elements peaking]`

### `[tension-release]`
What it does: A deliberate buildup of tension followed by resolution.
Common values: `gradual`, `sudden`, `sustained`, `layered`
Example: `[tension-release: Sustained dissonant chord resolving to major]`

### `[big finish]`
What it does: A dramatic, full-energy ending.
Example: `[big finish: Final chord held with full band and choir]`

### `[power-off drop]`
What it does: A dramatic, abrupt silence — like an electronic system cutting out.
Common values: `sudden`, `glitchy`, `resonant`, `percussive`
Example: `[power-off drop: Sudden glitchy silence after the build]`

### `[fade]`
What it does: Gradual fade-in or fade-out of the section.
Common values: `in`, `out`, `slow`, `quick`
Example: `[fade: Slow fade out over final chorus]`

### `[silence]`
What it does: A brief pause with no sound.
Common values: `1s`, `2s`, `3s` (duration in seconds)
Example: `[silence: 2s]`

---

## Tempo and Rhythm Modifiers

### `[accelerando]`
What it does: Gradual tempo increase.
Common values: `gradual`, `sudden`, `subtle`
Example: `[accelerando: Tempo builds gradually into the final chorus]`

### `[ritardando]`
What it does: Gradual tempo decrease. Opposite of accelerando.
Common values: `gradual`, `dramatic`, `subtle`
Example: `[ritardando: Slows dramatically before the bridge]`

### `[beat-switch]`
What it does: A mid-song change in rhythm, tempo, or beat structure.
Example: `[beat-switch: Switches from boom-bap to half-time trap]`

### `[half-time breakdown]`
What it does: Drops the tempo to half-time while maintaining the same key and mood.
Example: `[half-time breakdown: Drums halve, vocals stretch out]`

### `[syncopation]`
What it does: Off-beat rhythmic emphasis.
Common values: `light`, `heavy`, `complex`
Example: `[syncopation: Heavy syncopation in the bassline]`

### `[fermata]`
What it does: A note or chord held longer than its usual duration. Creates suspense or emphasis.
Common values: `dramatic`, `subtle`, `sustained`
Example: `[fermata: Dramatic hold on final chord before resolution]`

---

## Vocal Direction (Beyond the Basics)

### `[ad-lib]`
What it does: Improvised vocal flourishes, typically as backing or fills.
Example: `[ad-lib: Soulful runs over the chorus]`

### `[call-and-response]`
What it does: Lead vocal sings a line, backing vocals respond.
Example: `[call-and-response: Lead phrase answered by group vocals]`

### `[duet]`
What it does: Two vocalists alternating or harmonizing.
Common values: `male/female`, `harmonized`, `alternating`, `unison`
Example: `[duet: Male/female alternating verses]`

### `[choir]`
What it does: A group vocal section, typically harmonized.
Common values: `gospel`, `cinematic`, `orchestral`, `soft`, `powerful`
Example: `[choir: Powerful gospel choir on the final chorus]`

### `[chant]` / `[chant-loop]`
What it does: Repeated rhythmic vocal phrase, often crowd-style.
Example: `[chant: Crowd-style chant on the hook]`

### `[scat break]`
What it does: A jazz-style improvised vocal section using nonsense syllables.
Example: `[scat break: Eight bars of bebop scat over the chord changes]`

### `[aria-rise]`
What it does: An operatic, rising vocal phrase — dramatic and soaring.
Common values: `solo`, `choral`, `orchestral`
Example: `[aria-rise: Soprano vocals climb as strings swell]`

### `[vulnerable vocals]`
What it does: Intimate, exposed vocal delivery. Stripped, fragile, emotional.
Example: `[vulnerable vocals: Whispered confession over solo piano]`

### `[laughter]`
What it does: Audible laughter mixed into the vocal track.
Common values: `light`, `nervous`, `joyful`, `manic`
Example: `[laughter: Light laughter at the end of the line]`

### `[shout]`
What it does: A shouted vocal moment, usually as accent or punctuation.
Common values: `single`, `group`, `gang`
Example: `[shout: Gang shout on the final word of each chorus line]`

---

## Harmonic and Compositional Techniques

### `[modulation]`
What it does: A change in key or tonal center.
Common values: `sudden`, `gradual`, `ascending`, `descending`, `chromatic`
Example: `[modulation: Sudden shift up a whole step for the final chorus]`

### `[counterpoint]`
What it does: Two or more independent melodic lines played simultaneously.
Common values: `simple`, `complex`, `imitative`, `dissonant`
Example: `[counterpoint: Lead vocal against a counter-melody in the strings]`

### `[pedal-point]`
What it does: A sustained or repeated bass note that stays constant while harmonies change above it.
Common values: `low`, `high`, `dissonant`, `resolved`
Example: `[pedal-point: Low organ drone under shifting chord progression]`

### `[inversion]`
What it does: A chord or melody played with notes rearranged from their root position.
Common values: `first`, `second`, `melodic`
Example: `[inversion: First-inversion chords throughout the verse]`

### `[fragmentation]`
What it does: A theme broken into smaller motifs that repeat or develop.
Common values: `melodic`, `rhythmic`, `staggered`
Example: `[fragmentation: Staggered melodic fragments across different instruments]`

### `[variation]`
What it does: A modified return of a previously stated theme.
Common values: `melodic`, `rhythmic`, `harmonic`
Example: `[variation: Verse melody returns with altered rhythm in the bridge]`

### `[recapitulation]`
What it does: A return to an earlier section, often the opening theme. Common in classical structures.
Example: `[recapitulation: Returns to the opening theme in full orchestration]`

---

## Production and Effects (Specialty)

These descriptors also work as plain words in the Style box (e.g., "wide stereo," "tube distortion"). The entries below cover their use as *bracketed lyric-section instructions* — applying the effect to a specific section rather than the whole song.

### `[reverb]`
What it does: Adds spatial depth via reflected sound to the section.
Common values: `short plate`, `hall`, `room`, `cavernous`, `gated`
Example: `[Bridge | reverb: gated]`

### `[echo]`
What it does: Distinct repeated reflections of sound applied to the section.
Common values: `slapback`, `tape`, `dub`, `ping-pong`
Example: `[Bridge | echo: tape]`

### `[distortion]`
What it does: Harmonic saturation or clipping applied to the section.
Common values: `tube`, `fuzz`, `overdrive`, `bitcrush`, `tape`
Example: `[Verse | distortion: fuzz on the rhythm guitar]`

### `[glitch]`
What it does: Digital artifacts, stutters, or fragmentation effects.
Common values: `subtle`, `heavy`, `rhythmic`, `random`
Example: `[Breakdown | glitch: rhythmic stutter on the vocal]`

### `[layering]`
What it does: Stacking multiple instances of the same element for thickness within a section.
Common values: `vocal`, `instrument`, `harmonic`
Example: `[Chorus | layering: four-part vocal stack]`

### `[stereo]`
What it does: Spatial placement in the stereo field for the section.
Common values: `wide`, `narrow`, `mono center`, `panned`
Example: `[Solo | stereo: wide]`

---

## Track-Level Control

### `[control]`
What it does: Sets global parameters for the track. Multiple values can be combined inside the colon.
Common values: `instrumental`, `acapella`, `looped`, `no-repeat`, `dynamic`
Example: `[control: instrumental, no-repeat]`

### `[no-repeat]`
What it does: Standalone form of the `no-repeat` value. Tells Suno not to repeat sections verbatim. Useful for preventing loop-style outputs. Equivalent to using `no-repeat` inside `[control]`; either form works.
Example: `[no-repeat]`

### `[sequence]`
What it does: Defines the order of sections explicitly.
Example: `[sequence: intro, verse, chorus, verse, chorus, bridge, chorus, outro]`

### `[length]`
What it does: Target duration in seconds.
Common values: `120`, `180`, `210`, `360`
Example: `[length: 210]`

### `[language]`
What it does: Sets the language of the lyrics.
Common values: any language name (`English`, `Spanish`, `French`, `Japanese`, etc.)
Example: `[language: Spanish]`

### `[start]` / `[end]`
What it does: Explicit markers for the very beginning and very end of the track. Use `[start]` as the first line, `[end]` as the last line.
Example: `[start]` at the top of the lyrics, `[end]` at the bottom.

---

## Advanced and Classical-Style Tags

These tags apply mostly to classical, art rock, prog rock, opera, and composer-style work. They will rarely come up in pop, hip-hop, or modern genre prompts, but they add real capability when the user is going for a specific compositional style.

### `[fugue]`
What it does: A contrapuntal compositional structure where a theme is introduced and then imitated in successive voices.
Example: `[fugue: Theme introduced in soprano, imitated in alto, then bass]`

### `[stretto]`
What it does: Overlapping entries of a theme in close succession, typically in fugal writing.
Common values: `tight`, `dense`, `ascending`, `descending`
Example: `[stretto: Tight ascending theme entries increasing tension]`

### `[retrograde]`
What it does: A melodic line played backwards.
Example: `[retrograde: The opening theme played in reverse for the coda]`

### `[scherzo]`
What it does: A fast, light, often playful instrumental section.
Common values: `playful`, `frantic`, `mischievous`
Example: `[scherzo: Playful 6/8 section between verses]`

### `[minuet]`
What it does: A graceful 3/4 dance form, traditionally classical.
Example: `[minuet: Stately 3/4 instrumental break]`

### `[rondo]`
What it does: A repeating-theme structure where a main theme alternates with contrasting episodes (ABACA).
Example: `[rondo: Main theme returns between contrasting B and C sections]`

### `[exposition]`
What it does: The opening section of a sonata-form piece, presenting the main themes.
Example: `[exposition: First and second themes introduced in opening section]`

### `[development]`
What it does: A section that takes themes from the exposition and modifies, fragments, or reharmonizes them.
Example: `[development: Verse melody fragmented and reharmonized in minor]`

### `[coda]`
What it does: A concluding section that wraps up the piece, distinct from a simple outro.
Example: `[coda: Restatement of the main theme with full orchestration]`

### `[prelude]` / `[interlude]` / `[intermezzo]` / `[finale]`
What they do: Named sections from classical tradition. `[prelude]` opens, `[interlude]` connects, `[intermezzo]` is a brief contrasting middle section, `[finale]` is the dramatic close.
Example: `[finale: Triumphant orchestral close with timpani and brass]`

### `[pizzicato]`
What it does: Plucked-string articulation (rather than bowed).
Common values: `light`, `sharp`, `bouncy`, `dark`
Example: `[pizzicato: Bouncy plucked strings under the verse]`

### `[legato]`
What it does: Smooth, connected articulation between notes.
Example: `[legato: Smooth legato strings throughout the bridge]`

### `[staccato]`
What it does: Short, detached articulation. Opposite of legato.
Example: `[staccato: Sharp staccato brass hits on the off-beats]`

### `[marcato]`
What it does: Forceful, accented articulation.
Common values: `sharp`, `percussive`, `syncopated`
Example: `[marcato: Sharp orchestral brass accents on the downbeat]`

### `[glissando]`
What it does: A continuous slide between two pitches.
Example: `[glissando: Harp glissando into the chorus]`

### `[tremolo]`
What it does: Rapid repetition of a single note or rapid alternation between two notes.
Common values: `string`, `vocal`, `guitar`
Example: `[tremolo: String tremolo building tension under the bridge]`

### `[chromatic]`
What it does: Movement using semitones rather than diatonic intervals.
Example: `[chromatic: Chromatic descending bassline through the verse]`

### `[dissonance]` / `[consonance]`
What they do: Harmonic tension (dissonance) versus harmonic stability (consonance). Pair them to engineer tension and release.
Example: `[dissonance: Sustained dissonant chord]` followed by `[consonance: Resolves to major triad]`

### `[polyphony]`
What it does: Multiple independent melodic lines sounding simultaneously.
Common values: `dense`, `sparse`, `imitative`
Example: `[polyphony: Three independent vocal lines in the bridge]`

### `[orchestration]`
What it does: How the instruments are arranged and assigned across the ensemble.
Common values: `full`, `chamber`, `minimal`, `cinematic`
Example: `[orchestration: Full cinematic orchestration on the final chorus]`
