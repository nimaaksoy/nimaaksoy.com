# Persian poetic forms — strict rules

Each form has hard structural constraints. Break them only on purpose.

---

## غزل (Ghazal)

- **Length**: typically 5–15 beyt (couplets). 5–7 is the modern sweet spot.
- **Rhyme scheme**: aa, ba, ca, da, ea …
  - The two مصراع of the **مطلع** (opening beyt) both rhyme.
  - In every subsequent beyt, only the second مصراع carries the rhyme.
- **ردیف** (optional but common): a fixed word or phrase repeated immediately after the rhyme in every rhyming مصراع. If used, it locks in early — the مطلع sets it.
- **Vazn**: one meter throughout. Do not switch.
- **Beyt independence**: each beyt should stand alone as a complete idea (a hallmark of classical غزل). Through-narrative is allowed but not required.
- **مقطع** (final beyt): often contains the poet's takhallus (تخلص — pen name). Optional in modern usage; if you include one, use the user's stated name only with permission.

**Anatomy example**:

```
مطلع     ──── مصراع ──── A (rhyme)
         ──── مصراع ──── A
beyt 2   ──── مصراع
         ──── مصراع ──── A
beyt 3   ──── مصراع
         ──── مصراع ──── A
…
مقطع    ──── مصراع
         ──── مصراع ──── A   (often contains تخلص)
```

---

## رباعی (Rubai / quatrain)

- **Length**: exactly 4 مصراع (= 2 beyt).
- **Rhyme scheme**: a, a, b, a (most common). Sometimes a, a, a, a (more conservative).
- **Vazn**: special rubai meters — variations on هزج. The two safe choices:
  - مفعول مفاعیل مفاعیل فعل
  - مفعول مفاعلن مفاعیل فعل
- **Internal architecture (Khayyam pattern)**:
  - مصراع 1: image / situation
  - مصراع 2: question or doubt
  - مصراع 3: paradox or pivot
  - مصراع 4: landing — both surprising and inevitable; never moralising, never explanatory.

**Test**: cover مصراع 4. If a reader who has only seen 1–3 can guess what 4 says, the رباعی fails. Rewrite 1–3 first; the landing usually reveals the problem.

---

## مثنوی (Mathnavi)

- **Length**: open-ended. 8–14 beyt for a standalone piece; full مثنوی-ها are book-length.
- **Rhyme scheme**: aa, bb, cc, dd …
  - Every beyt has its own internal rhyme.
- **Vazn**: one meter throughout.
  - **Rumi-style** (mystical / didactic): فاعلاتن فاعلاتن فاعلن.
  - **Ferdowsi-style** (epic): فعولن فعولن فعولن فعل.
  - **Romance** (e.g. Khusraw o Shirin): مفاعیلن مفاعیلن فعولن.
- **Use case**: narrative, didactic, allegorical. The looser rhyme structure (each beyt rhymes only to itself) makes long-form viable.
- **Ferdowsi rule**: every beyt must do one of three things — advance plot, sharpen a scene, or name a virtue.
- **Rumi rule**: every beyt must move energy forward — through verb, repetition, paradox, or call.

---

## قطعه (Qit'a)

- **Length**: 2–8 beyt typically.
- **Rhyme scheme**: same as غزل (aa, ba, ca, …) **except** the first beyt's two مصراع do *not* rhyme.
- **Vazn**: one meter throughout.
- **Use case**: epigrammatic, occasional, didactic, satirical. Lighter than غزل. Good for Farabi-style wisdom poems.

---

## ترانه (Modern song lyric)

Not a classical form, but it's how this skill bridges to the *Suno Persian Songwriter*. Standard contemporary structure:

```
[Intro]               (optional — atmosphere only, no lyrics needed)
[Verse 1]             story / setup, 4–6 lines
[Pre-Chorus]          tension lift, 2–4 lines
[Chorus]              hook, 4–6 lines, repeatable
[Verse 2]             deeper story, 4–6 lines
[Pre-Chorus]
[Chorus]
[Bridge]              emotional or musical contrast, 2–4 lines
[Final Chorus]        same chorus or expanded
[Outro]               (optional — fade or coda)
```

- **Hook word in chorus**: pick one sustained-vowel word and repeat it (بیا، هنوز، چراغ، نمون). It anchors memory.
- **Verse vs chorus diction**: verses can be specific and narrative; chorus must be universal and singable.
- **Rhyme**: tight in chorus (clear, memorable). Verses can use slant rhyme or assonance.
- **Vazn**: prefer a steady pulse over strict عروض. The line-length consistency matters more than syllable-perfect scansion.
- **Hand-off**: when the user wants the song produced, deliver this structure to the *Suno Persian Songwriter* skill, which adds the Style prompt, vocal direction, negative prompt, and slider settings.
