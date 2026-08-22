---
name: Persian Poetry Composer
description: Use when the user gives a subject, story, or text and asks for a Persian / Farsi poem. Produces a poem in a chosen classical style (Saadi, Hafez, Rumi, Ferdowsi, Khayyam, modern) with meter and rhyme.
dependencies: []

category: content-creation
subcategory: long-form-writing
tags: [persian, farsi, poetry, ghazal, rubai, mathnavi, classical, songwriting]
author:
  name: Nima Aksoy
  url: https://nimaaksoy.com
  github: nimaaksoy
license: CC-BY-4.0
version: 0.1.0
created: 2026-05-15
updated: 2026-05-15
---

# Persian Poetry Composer

## Overview

Turn a subject, a story, an emotion, or a few rough sentences into a Persian poem in a chosen classical style — Saadi (سعدی), Hafez (حافظ), Rumi (مولانا), Ferdowsi (فردوسی), Khayyam (خیام), or modern lyric. The skill handles meter (وزن), rhyme (قافیه), redif (ردیف), form (غزل / رباعی / مثنوی / ترانه), and the stylistic signatures of each voice — not just rhyming words on a page.

The output is a complete poem in Persian script, with optional transliteration, scansion, and a short note on stylistic choices and song-adaptation potential.

## When to use this skill

- The user provides a subject, story, sentence, or emotion (in Farsi or English) and asks for a Persian poem.
- The user names a classical poet ("write like Hafez", "in the style of Khayyam") or a form (غزل، رباعی، مثنوی، ترانه).
- The user asks to convert prose, a song lyric, or a translation into a Persian classical poem.
- The user wants a poem that could later be set to music (combine with the *Suno Persian Songwriter* skill for the production brief).

Do **not** use when:

- The user wants song production, vocal direction, or Suno prompts — use *Suno Persian Songwriter* instead.
- The user wants a poem in a non-Persian language — use a language-specific skill.
- The user wants a literal translation of an existing poem — translate, don't recompose.

## Instructions

Work in this order. Skipping the early steps produces poems that rhyme but feel hollow.

### 1. Clarify the brief in one sentence

Before composing, confirm three things in one short message back to the user:

- **Subject.** What is the poem about? Quote the user's words.
- **Style or form.** Which classical voice or which form? If unstated, propose one and offer two alternatives.
- **Length.** How many couplets / lines / quatrains? Default: غزل = 5 beyt, رباعی = 4 mesra, مثنوی = 8–14 beyt, modern = 12–24 lines.

If any of the three is genuinely ambiguous, ask one focused question. Don't ask three.

### 2. Pick the style and form

Use `resources/styles.md` to match intent → style:

| Intent                             | Default style       | Default form    |
|------------------------------------|---------------------|-----------------|
| Romantic, fluent, conversational   | Saadi (سعدی)        | غزل             |
| Mystical, layered, multi-meaning   | Hafez (حافظ)        | غزل             |
| Ecstatic, spiritual, urgent        | Rumi (مولانا)       | غزل / مثنوی     |
| Heroic, narrative, civic virtue    | Ferdowsi (فردوسی)   | مثنوی متقارب    |
| Philosophical, brief, existential  | Khayyam (خیام)      | رباعی           |
| Wisdom-driven, conceptual          | Farabi-ish (فارابی-وار) | قطعه / رباعی |
| Modern, song-ready                 | Modern lyric        | ترانه           |

The user's stated preference always overrides the default.

### 3. Build a small word and image bank

Pull from `resources/word-image-banks.md`. For each style there's a vocabulary signature — Hafez leans on جام، آینه، صبح، رند، زلف؛ Ferdowsi on اسب، خرد، داد، نیزه، کوه؛ Rumi on رقص، نی، آتش، راه، دریا. Listing 6–10 words *before* drafting prevents drift into generic Persian lyric.

### 4. Pick the meter (وزن)

Use `resources/persian-prosody.md` for the cheat-sheet. Defaults:

- **Saadi غزل** — varied; pick one of the common اوزان (رمل مثمن مخبون محذوف is safe).
- **Hafez غزل** — رمل مثمن مخبون محذوف، مجتث مثمن مخبون محذوف، مضارع مثمن اخرب مکفوف محذوف.
- **Rumi مثنوی** — فاعلاتن فاعلاتن فاعلن.
- **Ferdowsi مثنوی** — فعولن فعولن فعولن فعل (متقارب مثمن محذوف).
- **Khayyam رباعی** — اوزان رباعی (هزج مسدس / هزج مثمن in their accepted variants).
- **Modern lyric** — free pulse; prioritise stress + line length over classical scansion.

### 5. Pick the rhyme (قافیه) and redif (ردیف)

- **غزل** — same قافیه across مصراع‌های زوج; مطلع also rhymes; optional ردیف (a fixed word/phrase repeated after the rhyme).
- **رباعی** — first, second, fourth مصراع rhyme; the third often does not (آزاد).
- **مثنوی** — every beyt has its own internal rhyme between its two مصراع.
- **ترانه** — rhyme matters most in the chorus; verses can be looser.

If the user gave a key word or sentence, try to derive قافیه or ردیف from it — anchors the poem to the user's intent.

### 6. Draft

Write the first pass straight through. Don't optimise yet. Goals per style:

- **Saadi** — clean syntax, restrained imagery, one syntactic surprise per beyt. Avoid heavy vocabulary.
- **Hafez** — engineer the ambiguity. Pick a دو-پهلو word (آینه، جام، خرابات، زلف، صبح) and write the beyt so two interpretations both work.
- **Rumi** — start with a verb (بیا، بزن، برخیز، بنوش)؛ use تکرار, ندا, پرسش. Imagery moves, dances, breaks.
- **Ferdowsi** — every beyt advances narrative or sharpens scene. Use simple, vivid similes. No ornamentation that doesn't carry weight.
- **Khayyam** — image, then question, then paradox, then a fourth-line landing that is both surprising and inevitable.
- **Modern lyric** — short lines, conversational, repeatable hook. Plan verse / pre-chorus / chorus / bridge.

### 7. Read aloud (in your head) and refine

Before delivering, run the read-aloud check from `resources/checklist.md`:

- Does each line scan? Mark stressed syllables and confirm they fit the chosen وزن.
- Do the rhymes work *by mouth*, not just *by eye*?
- Are there ugly consonant clusters at line breaks?
- For رباعی: does the fourth مصراع land as both surprising and inevitable?
- For غزل: is each beyt independently strong? (Classical غزل beyts can stand alone.)

Rewrite anything that fails. It is normal to throw out half the first draft.

### 8. Deliver

Return four labelled blocks:

1. **شعر (Poem)** — the poem in Persian script, beyts on separate lines, مصراع‌ها separated by a pipe `|` or line break.
2. **توضیح سبکی (Style notes)** — 2–4 sentences: which style, which وزن, which قافیه/ردیف, what the signature move is.
3. **ترانویسی (Transliteration)** — optional, only if user asked or appears to be a non-Persian reader. Use Persian-academic transliteration, not casual romanisation.
4. **یادداشت آهنگ‌گذاری (Song-adaptation note)** — optional 1–2 sentences on whether and how the poem could be set to music. If the user already wants a song, hand off to *Suno Persian Songwriter*.

## Examples

### Example 1 — short subject → Hafez-style ghazal couplet

**Input:**

> "بنویس درباره‌ی صبحی که با تو نگاهم به آینه افتاد. سبک حافظ. ۲ بیت کافیه."

**Expected behaviour:**

Confirm: subject = morning + mirror with the beloved, style = Hafez, length = 2 beyt. Pick دو-پهلو word: آینه (mirror = both literal and شناخت/recognition). Vazn: رمل مثمن مخبون محذوف. قافیه built around the user's "آینه".

**شعر**

```
صبح آمد و در آینه‌ام چهره‌ی تو دید
گویی که از خرابِ شب، ستاره روی نگاه دمید

یک رند به افسونِ تو، در جامِ سحر گم شد
این آینه را گفتم و خود از سخن خود هزار بار خمید
```

**توضیح سبکی**

غزلواره در سبک حافظ. وزن نزدیک به رمل مخبون است. آینه و جام به‌عمد دو-پهلو به‌کار رفته‌اند: آینه هم آینه‌ی حقیقی صبح است، هم آینه‌ی شناخت. قافیه بر «-ید» با ردیف ضمنی «نگاه/سخن».

**یادداشت آهنگ‌گذاری**

برای آواز سنتی یا تلفیقی مناسب است؛ اگر آهنگ می‌خواهید، با مهارت Suno Persian Songwriter ادامه دهید.

### Example 2 — story → Khayyam-style rubai

**Input:**

> "Quick rubai please — about a man who sees an old photo of himself and doesn't recognize who he was."

**Expected behaviour:**

Confirm in one line: rubai (4 lines), Khayyam style, subject = stranger in the old photo. Vazn: وزن رباعی. Build the four-card pattern (image → question → paradox → landing).

**شعر**

```
آن کس که در این قاب، نگاهش زرد است
گویا که ز خاطراتِ من بیگانه‌ی خرد است
دیروز چه بودم که نمی‌بینمش امروز؟
این صورت بی‌نام، کدامین نفر است؟
```

**توضیح سبکی**

رباعی در سبک خیامی. تصویر در مصرع اول (قاب و نگاه زرد)، پرسش در دوم، پارادوکس در سوم، فرود و ضربه در مصرع چهارم با تبدیل «خود» به «نفری دیگر». قافیه: زرد / خرد / نفر است.

### Example 3 — emotion → Rumi-style mathnavi excerpt

**Input:**

> "حس میکنم باید برم، اما نمیدونم کجا. مولانایی بنویس، ۶ بیت."

**Expected behaviour:**

Subject = the urge to depart with no destination. Style = Rumi. Form = مثنوی. Vazn = فاعلاتن فاعلاتن فاعلن. Plan: open with imperative, use تکرار, motion imagery, end with paradox.

**شعر**

```
برخیز ای جان! گفت آوازِ نهان
ره ببین در ره ‌نبستن، در زبان

برخیز و از این خانه‌ی تنگم برو
هرچه می‌بندد به پایم، بشکن و رو

ره مرا گفتی کدامین در نشان؟
گفت: آن دری که در تو می‌خواند جان

از کجا آمد؟ کجا می‌خواندَم؟
هر سؤالم را، خود او پاسخ زدم

پس چرا این پای ساکن، لرزه دارد؟
هر کجا گویم، دلم را تازه دارد

برخیز و رو، رفتن نخواهد مقصدی
رفتنت خود، باز گشتن از خودی
```

**توضیح سبکی**

شش بیت در وزن فاعلاتن فاعلاتن فاعلن (وزن مثنوی مولوی). تکرار «برخیز» و «رو» جنبش مولوی‌وار را می‌سازد. هر بیت یک ندا، یک حرکت، یک پرسش یا یک پارادوکس دارد. بیت پایانی، فرود معناییِ مولوی‌وار: «رفتن خود بازگشت است».

## Resources

- `resources/styles.md` — full reference card per classical style: signature moves, common vazn, voice, do / don't.
- `resources/forms.md` — strict rules for غزل، رباعی، مثنوی، قطعه، and modern ترانه structure.
- `resources/persian-prosody.md` — vazn (meter) cheat sheet, qafiye + radif rules, scansion shorthand.
- `resources/word-image-banks.md` — vocabulary and imagery signatures for each classical voice.
- `resources/checklist.md` — pre-delivery checklist (read-aloud, vazn, qafiye, fourth-line landing for rubai, etc.).

## Notes & limitations

- **Persian script is required for the poem itself.** Do not deliver the main poem in romanised form. Transliteration is a *supplement*, only if asked.
- **AI-generated classical Persian is rarely indistinguishable from a great original.** Be honest with the user about this. A workable Hafez-flavoured beyt is achievable; Hafez himself is not.
- **Vazn errors are the most common failure.** When in doubt, prefer شعر نو (free-verse) framing over a broken classical meter — that is, if you can't scan it cleanly, say so.
- **Don't pad with archaic words** to "sound classical". Saadi himself avoided this; archaism for its own sake is the most common bad-tradition trap.
- **For رباعی, the fourth مصراع is everything.** If you don't have a strong fourth, scrap the rubai and start again. Don't deliver weak rubais.
- **Two-style hybrid requests** ("Hafez but modern") tend to fail — pick one as the spine and let the other inflect. Tell the user which is which.
- **For song output**, hand off to the *Suno Persian Songwriter* skill once the poem is done. This skill stops at the page.
- **Faux-Hafez ambiguity** is the second most common failure: don't write deliberately gnomic lines without two specific interpretations in mind. Murky ≠ deep.

## Changelog

- `0.1.0` — initial version. Distilled from the deep-research brief on Persian classical poetry and song.
