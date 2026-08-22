# Pre-delivery checklist

Walk this list before sending the lyric back. Content checks first (Steps 0–2 + 7 of the skill), prosody checks second.

---

## Concept (the song-worthy gate)

- [ ] **The One Line exists.** I have a single chorus line that, alone, would make a listener stop.
- [ ] **The persona is specific.** Could not be swapped for "any sad/happy/lonely person".
- [ ] **The angle is fresh.** This isn't the chorus version of 1,000 other Persian songs.
- [ ] **If artist named:** I worked from a specific mental model of that artist's signature, or I told the user I was guessing.

## Red Team (run after drafting, before delivering)

- [ ] **Brilliant-line test passes** — at least one line earns its place purely as a line.
- [ ] **Predictability test passes** — covering the second half of each chorus line doesn't let me guess it.
- [ ] **Wikipedia test passes** — this lyric could not have been generated without the persona.
- [ ] **Image ratio** — concrete images outnumber abstract concepts ~2:1.
- [ ] **Originality** — three other Persian songs don't share this chorus.

## Cliché budget

- [ ] **Maximum 1 cliché** from `resources/persian-cliches.md` across the whole song.
- [ ] **If 1 cliché used**, it's anchored to a specific image in the same line or the next.
- [ ] **No placeholder words**: همه چی، یه جوری، یه چیزی، همه جا.
- [ ] **No cliché image pair** (شب + باران، دل + شکسته، چشم + اشک، etc.) appears twice.

## Brief alignment

- [ ] Style matches the user's request (or the assumed default).
- [ ] The persona reflects the user's named situation/character.
- [ ] Length matches user's ask (or the style's default).

## Register lock

- [ ] One register chosen and applied to **every** verb form.
- [ ] No mixed «می‌روم» / «میرم» / «میرَم» combinations.
- [ ] Pronouns consistent: «این/آن» (formal) or «این/اون» (colloquial), not both.
- [ ] No formal noun ↔ colloquial verb mismatches mid-line.

## Orthography

- [ ] No doubled vowels («توو», «دوو»).
- [ ] No Arabic «ك» or «ي» — replaced with Persian «ک» / «ی».
- [ ] No Arabic numerals — spelled out.
- [ ] No Latin punctuation in Persian lines (or intentional and consistent).
- [ ] Half-spaces (نیم‌فاصله) used or omitted consistently.

## Per-line prosody

- [ ] No line exceeds the style's max syllable count.
- [ ] No line has more than 2 ezafes.
- [ ] No clitic on a strong beat where it would distort word stress.
- [ ] Verb stress falls on the verb's stem syllable, not on a clitic or suffix.

## Chorus

- [ ] Hook word identified.
- [ ] Hook word starts with a safe consonant (not ع، ح، ق، خ، غ).
- [ ] Hook word ends with an open vowel (â / i / u) for sustain.
- [ ] All chorus lines have the same syllable count (or match a strict 2-pattern).
- [ ] Chorus rhymes work **by ear**, not by spelling.
- [ ] No hard consonant cluster on a held note.

## Hard sounds

- [ ] No long-held «عشق», «صبر», «سخت», «گفت», «رفت» — pre-padded or moved to short notes.
- [ ] No melisma on closed syllables — moved to nearest open vowel.
- [ ] No melisma on hook words starting with ع، ح، ق، خ، غ.

## Section structure

- [ ] Section tags in English brackets: `[Verse]`, `[Pre-Chorus]`, `[Chorus]`, `[Bridge]`, `[Outro]`.
- [ ] Verses, pre-chorus, chorus, bridge each have distinct character (don't all sound the same).
- [ ] Repeats of the chorus are identical (or intentional variations are marked).

## Performance notes

- [ ] **یادداشت‌های اجرایی** block included — register, syllable count per chorus line, stress map, hook word, melisma points.
- [ ] If using regional flavour, معیار version is the lyric and dialect notes go in performance notes.
- [ ] If user is non-Persian-reading, transliteration block is included.

## Honesty

- [ ] If a part of the lyric had to compromise (e.g. couldn't avoid a hard cluster), it's flagged in **Performance notes**.
- [ ] **If the Step 0 One Line wouldn't come from the brief alone, you asked the user one focused question rather than ship a generic lyric.** One question beats a mediocre re-roll.
- [ ] If you couldn't make the chosen style work for the requested theme, you said so and proposed an alternative — you didn't ship a forced lyric.
- [ ] If the user named an artist and you couldn't honestly say you imitated *their* signature (vs. a generic version of the style), you said so.

## Hand-off

- [ ] If the user wants the full Suno production brief, you handed off to *Suno Persian Songwriter* with the finished lyric.

If any box is unchecked, fix it. The user will hear the difference at generation time.
