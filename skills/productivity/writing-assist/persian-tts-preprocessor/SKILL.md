---
name: Persian TTS Preprocessor
description: Use when preparing Persian / Farsi text for any TTS engine. Returns the same text with normalisation, half-spaces, punctuation, Ezafe marks, exception fixes, and optional spoken-style rewrite.
dependencies: []

category: productivity
subcategory: writing-assist
tags: [persian, farsi, tts, text-to-speech, preprocessing, normalization, ezafe, ssml]
author:
  name: Nima Aksoy
  url: https://nimaaksoy.com
  github: nimaaksoy
license: CC-BY-4.0
version: 0.3.0
created: 2026-05-17
updated: 2026-05-17
---

# Persian TTS Preprocessor

## Overview

Persian TTS engines (Azure, Google, MMS, XTTS, ElevenLabs) usually fail not because the model is bad, but because the **input text is ambiguous**. Persian doesn't write short vowels, often omits the ezafe (`ـِ`), uses elision in spoken form, and is sensitive to punctuation and syntax for prosody. Hand a raw paragraph to any engine and you'll get a stiff, book-like read with mispronunciations.

This skill takes a Persian text in, applies the minimum set of changes that make it read correctly, and returns the **same text** — same content, same paragraph structure, same line breaks — just TTS-ready.

## When to use this skill

- The user has Persian text and wants to feed it to a TTS engine (Azure, Google Gemini-TTS, MMS-TTS, XTTS, ElevenLabs, Coqui).
- The user is producing voiceovers, audiobooks, podcasts, IVR, or accessibility output in Persian.
- The user's previous TTS output was stiff, mispronounced, run-on, or read numbers as digits.
- The user has text that came from ASR / OCR / LLM and needs punctuation restored before TTS.

Do **not** use when:

- The user wants to translate Persian to another language — that's a translation skill.
- The user wants to write *new* Persian text (a poem, a song, marketing copy) — that's a writing skill.
- The text is non-Persian — apply a language-specific preprocessor.

## Tag legend

- `[Rule]` — always apply; safe in every register.
- `[Conditional]` — apply only when the input contains the trigger pattern.
- `[Register-dependent]` — apply only when the user asks for the *Fluent-formal* or *Spoken* register.
- `[Engine-specific]` — apply only when the target engine is known to need it.

## Instructions

### Step 0 — Pick the register

Ask the user **once**, then hold it for the whole text:

| Register | When to use | What changes |
|---|---|---|
| **Preserve** *(default)* | The user wants minimal interference — formal writing, news, audiobooks of literary work, legal/academic text | Only safe, mechanical fixes |
| **Fluent-formal** | The user wants formal but smooth reading — explainer videos, professional voiceover, e-learning narration | Above + selective Ezafe + number expansion + heavier punctuation repair |
| **Spoken** | The user wants natural conversational reading — chat assistants, social-media voiceover, drama | Above + colloquial rewrite (می‌خواهم → می‌خوام, این را → اینو) |

**If the register is unclear, default to Preserve and tell the user.** Don't aggressively rewrite by default — the user can always ask for Spoken.

### Step 1 — Character & whitespace normalisation `[Rule]`

Always safe. Apply to every input.

| Replace | With | Why |
|---|---|---|
| Arabic `ي` (U+064A) | Persian `ی` (U+06CC) | Many TTS engines mispronounce Arabic ي in Persian context |
| Arabic `ك` (U+0643) | Persian `ک` (U+06A9) | Same as above |
| Arabic digits `٠١٢٣...` | Persian digits `۰۱۲۳...` | Consistency; some engines tokenise differently |
| Tatweel `ـ` (U+0640) | (remove) | Decorative; tokenisers choke |
| Decorative diacritics (`ـٓ ـٔ` etc. on regular text) | (remove unless meaningful) | Causes noise |
| Multiple spaces | Single space | Tokeniser hygiene |
| Space *before* `،`, `؛`, `:`, `.`, `!`, `؟` | (remove) | Punctuation pattern |
| Missing space *after* punctuation (mid-text) | (add) | Same |
| Non-breaking space | Normal space | Sometimes mis-tokenised |
| Zero-width chars except ZWNJ (U+200C) | (remove) | Junk |

### Step 2 — Half-space (ZWNJ) restoration `[Rule]`

ZWNJ (`U+200C`, نیم‌فاصله) joins morphologically related parts as one token. Critical for correct tokenisation and Ezafe handling.

Apply these patterns (regex-friendly):

| Pattern | Replace with | Examples |
|---|---|---|
| `می ` + verb stem | `می‌` + verb | `می روم` → `می‌روم` |
| `نمی ` + verb stem | `نمی‌` + verb | `نمی توانم` → `نمی‌توانم` |
| `بی ` + word (when prefix, not preposition) | `بی‌` + word | `بی هوش` → `بی‌هوش` |
| noun + ` ها` (plural) | noun + `‌ها` | `کتاب ها` → `کتاب‌ها` |
| noun + ` های` (plural+Ezafe) | noun + `‌های` | `کتاب های من` → `کتاب‌های من` |
| adj + ` تر` / ` ترین` | adj + `‌تر` / `‌ترین` | `بزرگ تر` → `بزرگ‌تر`, `بهترین` ← already joined |
| word + ` ام/ات/اش/امان/اتان/اشان` (clitic possessive) | word + `‌ام` etc. | `کتاب ام` → `کتاب‌ام` |
| word + ` ای` (indefinite/vocative `ای`) | word + `‌ای` | `مردی` ← already joined |

See `resources/half-space.md` for the full pattern list and edge cases.

### Step 3 — Punctuation restoration `[Conditional]`

Trigger: text appears to come from ASR / OCR / LLM (long run-on sentences, missing `،` and `.`, or no `؟` on obvious questions).

Apply:

| Action | Why |
|---|---|
| Add `،` between clauses joined by `و`, `اما`, `ولی`, `چون`, `اگر`, `که` (when grammatically a clause boundary) | Mid-sentence breath, prevents run-on prosody |
| Add `.` at sentence ends | Engine resets pitch |
| Add `؟` after interrogatives (`آیا`, `چرا`, `چطور`, `کی`, `کجا`, `چی`, `چه`, `کدام`) or rising-intonation lines | Engine produces question contour, not statement |
| Add `!` for clear exclamations (interjections, commands) | Sparingly — overuse can cause shouted/distorted output on some engines |
| Convert Latin `?` → Persian `؟` | Persian-script consistency |
| Convert Latin `,` → Persian `،` in Persian-only sentences | Same |
| Convert Latin `;` → Persian `؛` in Persian-only sentences | Same |
| Keep paragraph breaks as-is | Don't merge paragraphs |

If the original text already has good punctuation, **don't change it.** This step is only for repair.

### Step 4 — Number / date / time / URL / unit expansion `[Conditional]`

Trigger: input contains digits, dates, times, URLs, units, currency, or symbols.

Apply expansion table:

| Pattern | Read as |
|---|---|
| `۱۲۳۴` (cardinal) | `هزار و دویست و سی و چهار` |
| `۲۰۲۶/۰۵/۱۷` or `1405/02/27` (Persian date) | `بیست و هفتم اردیبهشتِ هزار و چهارصد و پنج` |
| `2026-05-17` (Gregorian) | `هفدهم می دو هزار و بیست و شش` |
| `۱۰:۳۰` (time) | `ساعتِ ده و نیم` or `ده و سی دقیقه` |
| `۲۵٪` | `بیست و پنج درصد` |
| `$25` / `۲۵$` | `بیست و پنج دلار` |
| `https://example.com` | `سایتِ اگزمپل دات کام` (or skip the URL entirely if it's not meant to be read) |
| `2.5kg` | `دو و نیم کیلوگرم` |
| `№3` / `#3` | `شمارهٔ سه` |
| `1st`, `2nd`, `3rd` | `اولین`, `دومین`, `سومین` |
| `&` | `و` |
| `@username` | `اَت یوزرنیم` (or omit if not meant to be read) |
| `*`, `_`, `~`, ``` ` ``` (Markdown) | (remove — they're formatting, not content) |

Keep ordinals, fractions, and large numbers in **spelled-out Persian**, not digits.

For currency: name the currency. For units: name the unit (don't use abbreviations like `kg`).

### Step 5 — Ezafe marking — selective, not global `[Conditional]` `[Register-dependent]`

The ezafe (`ـِ`) is the unstressed `-e` that links noun phrases: `کتابِ من` (my book). In normal Persian, ezafe is rarely written; the reader infers it. TTS engines guess wrong on ambiguous noun groups.

**Selective rule** (Preserve register):

- Mark ezafe only on **noun-noun** or **noun-adjective** groups where the engine is likely to drop it.
- Mark on the **first ezafe** of a chain, then let context handle the rest.
- Do NOT mark ezafe globally — over-marked text reads like a textbook.

| Pattern | Mark |
|---|---|
| `noun + space + adjective` (clearly attributive) | `nounِ adjective` — *e.g.* `کتاب خوب` → `کتابِ خوب` |
| `noun + space + noun` (clearly possessive) | `nounِ noun` — *e.g.* `صدای تو` (already explicit via ـی) → leave |
| Noun ending in `ه` + space + word | `noun‌ی + word` — *e.g.* `خانه بزرگ` → `خانه‌ی بزرگ` |
| Noun ending in long vowel `ا/و/ی` + space + word | `noun + ی + word` — *e.g.* `پای من` ← already explicit |
| Names (proper nouns) + space + descriptor | `نامِ کامل` — only mark when ambiguous |

**Fluent-formal register**: mark ezafe more aggressively, including in compound technical phrases.

**Spoken register**: mark ezafe in the *spoken-form* rewrite (`خونه‌ی بزرگ`, `اسمِ تو`).

See `resources/ezafe.md` for the full decision tree and edge cases.

### Step 6 — Exception lexicon — scan and diacritize aggressively `[Rule]`

This is the step that catches "obviously wrong" TTS readings. **Do not treat this as optional.** Scan every word in the text against the four classes below and apply the fix every time the pattern matches.

The previous version of this skill was too conservative here — it deferred to "engine usually handles it" and let through known-bad cases like `کفش → kefesh` and `چتر → chetre`. The correct posture is: **if a word is in the lexicon, always diacritize, even in Preserve register.**

#### 6.1 — Closed consonant-cluster monosyllables (CVCC, CVCC...)

Single-syllable Persian words with a final consonant cluster. The engine inserts a phantom vowel mid-cluster because Persian doesn't write short vowels. **Always add the explicit short vowel.**

| Bare | Diacritized | Reading |
|---|---|---|
| کفش | `کَفش` | kafsh |
| چتر | `چَتر` | chatr |
| قبر | `قَبر` | qabr |
| قفل | `قُفل` | qofl |
| شکل | `شِکل` | shekl |
| مشت | `مُشت` | mosht |
| دست | `دَست` | dast |
| تخت | `تَخت` | takht |
| سخت | `سَخت` | sakht |
| نفس | `نَفَس` | nafas |
| فکر | `فِکر` | fekr |
| ذکر | `ذِکر` | zekr |
| صبر | `صَبر` | sabr |
| لطف | `لُطف` | lotf |
| عشق | `عِشق` | eshq |
| قلب | `قَلب` | qalb |
| قدر | `قَدر` | qadr |
| پست | `پُست` | post |
| نطق | `نُطق` | notq |
| شخص | `شَخص` | shakhs |
| نبض | `نَبض` | nabz |
| خشک | `خُشک` | khoshk |
| پخش | `پَخش` | pakhsh |

See `resources/exception-lexicon.md` §1A for the full list (~50+ entries). **When in doubt, mark it.** Over-diacritising a single-syllable word is harmless; under-marking is the failure mode.

#### 6.2 — Ambiguous short-vowel monosyllables

Words where the short vowel determines the meaning. Always diacritize based on context.

| Word | When meaning … | Mark as |
|---|---|---|
| شن | sand | `شِن` |
| لنگ | leg / pair | `لِنگ` |
| لنگ | lame | `لَنگ` |
| سر | head | `سَر` |
| سر | secret | `سِرّ` |
| مرد | man | `مَرد` |
| مرد | died | `مُرد` |
| کرم | worm | `کِرم` |
| کرم | cream | `کِرِم` |
| کرم | generosity | `کَرَم` |
| شکر | sugar | `شِکَر` |
| شکر | thanks | `شُکر` |
| پر | feather | `پَر` |
| پر | full | `پُر` |
| ده | ten | `دَه` |
| ده | village | `دِه` |
| سم | poison | `سَم` |
| سم | hoof | `سُم` |

See `resources/exception-lexicon.md` §1B for the extended list. **Always diacritize words from this class** — engine guesses are roughly 50/50 and frequently wrong.

#### 6.3 — Clitic chains: `noun + ‌ها + clitic` on cluster nouns

When a consonant-final cluster noun takes `‌ها` + a possessive clitic (`ت`, `ش`, `م`), some engines insert a phantom `ه`.

**Real failure:** `قدم‌هات` read as `qadame-hât` (extra `e`).

**Fix:** diacritize the host noun *before* the clitic chain.

| Bare | Diacritized fix |
|---|---|
| قدم‌هات | `قَدَم‌هات` |
| دست‌هاش | `دَست‌هاش` |
| چشم‌هام | `چِشم‌هام` |
| حرف‌هات | `حَرف‌هات` |

Multi-syllable nouns rarely fail (`کتاب‌هاش` is usually correct). The single-syllable cluster nouns are the high-risk class.

#### 6.4 — واو معدوله and other historical exceptions

Words written with `خوا` where the `و` is silent — handle by lexicon (the spelling can't be fixed in plain text, so flag for the user or use phonetic notation if the engine supports it):

| Pattern | Examples | Reading |
|---|---|---|
| `خوا-` family | `خواهر`, `خواب`, `خواندن`, `خواستن`, `خواهان`, `خواهش` | `khâ-` (silent `و`) |
| Religious phrases | `الله`, `الرحمن`, `الرحیم` | preserve as-is |
| Foreign loans | `کامپیوتر`, `تلویزیون`, `اینترنت` | usually safe — leave alone |
| Proper names with phantom-ezafe risk | `نازلی`, `سارا`, `لیلا`, `ندا`, `رضا` | wrap in `« »` or use possessive form |

See `resources/exception-lexicon.md` §1, §2, §3, §4 for the full lists.

#### 6.5 — Context-dependent homographs `[Rule]`

Words spelled normally but meaning different things depending on the short vowel. The engine picks the most-frequent reading; the user's intended reading is often the less-frequent one.

| Bare | When meaning | Mark as |
|---|---|---|
| دور | far | leave as `دور` (`dur`) |
| دور | around / surrounding | `دَوْرِ` (`dor`) — e.g. `دَوْرِ چراغ` "around the lamp" |
| دوره | era / period / course | leave as `دوره` (`dowre`) |
| دوره | "it is far" (contracted) | rewrite as `دور است` or write `دورْه` |
| نت | music note | `نُت` (`not`) |
| درام | drum (music context) | `دِرام` (`derâm`) |
| درام | drama (theatre) | leave as `درام` (`derâm` standard) |
| بهونه | excuse (colloquial of بهانه) | `بَهونه` (`bahune`) — always |
| رو | object marker after a vowel | `رُ` (`ro`) — e.g. `من رُ` |
| رو | face | leave as `رو` (`ru`) |
| حرفت | your speech (spoken) | `حرفِت` (`harfet`) |
| حرفت | your speech (formal) | `حرفَت` (`harfat`) |
| پر | full | `پُر` (`por`) |
| پر | feather | `پَر` (`par`) |
| شکر | thanks | `شُکر` (`shokr`) |
| شکر | sugar | `شِکَر` (`shekar`) |

See `resources/exception-lexicon.md` §1E for the full list. **For every word in the input, ask: is this a homograph? If yes, what's the meaning here? Then mark.**

#### 6.6 — Foreign loans with internal consonant clusters `[Rule]`

Foreign loanwords (music, tech, modern vocabulary) with 2+ consonants between vowels get a phantom vowel from the engine. Same failure as §1A but in loanwords.

| Bare | Diacritized | Reading |
|---|---|---|
| ساکسیفون | `ساکْسیفُون` | `sâksifun` |
| پیانو | `پِیانو` | `pyâno` |
| ساندویچ | `ساندْویچ` | `sandvich` |
| اسپرت | `اِسْپُورْت` | `esport` |
| الکترونیک | `اِلِکْتْرونیک` | `elektronik` |

**Often-safe** (usually correct without marking): `کامپیوتر`, `تلویزیون`, `اینترنت`, `موبایل`, `رادیو`, `سینما`, `اتوبوس`, `موسیقی`, `بانک`, `پلیس`. The dividing line: 3+ syllables usually OK; 2-syllable with internal cluster usually fails.

See `resources/exception-lexicon.md` §1F.

#### 6.7 — Scan procedure (do this for every word in every text)

Walk every word through this 7-step check:

1. **Single-syllable cluster word?** (§1A) → diacritize.
2. **Ambiguous short-vowel monosyllable?** (§1B) → diacritize per context.
3. **Clitic chain on cluster noun?** (§1C) → diacritize the host.
4. **Cluster word taking ezafe?** (§1D) → diacritize the cluster, then mark ezafe.
5. **Context-dependent homograph?** (§1E) → diacritize per meaning.
6. **Foreign loan with internal cluster?** (§1F) → diacritize the cluster.
7. **`خوا-` family / religious / proper-name phantom-ezafe?** (§1, §2, §3, §4) → handle per section.

The v0.2 leak was that the LLM scanned §1A–§1D but not §1E–§1F. v0.3 adds those classes and the visible audit (Step 8) that forces the scan to happen on every word.

#### 6.8 — Consistency rule `[Rule]`

**Same word, same diacritisation, every time it appears in the text.** No exceptions.

If you marked `ساکسیفون` as `ساکْسیفُون` in verse 1, every occurrence in verses 2, 3, the chorus, and the bridge must also be `ساکْسیفُون`. Inconsistent marking is *worse* than no marking — the engine produces correct reading on one line and wrong on the next, which sounds random and unprofessional.

To enforce: after diacritizing, search for each diacritized word's bare form in the text and confirm zero matches remain. If a bare form survives anywhere, mark it.

### Step 7 — Spoken-style rewrite `[Register-dependent]`

Apply **only** if register = *Spoken*. Otherwise skip.

Conversion table (the safe core):

| Formal | Spoken |
|---|---|
| می‌روم | میرم |
| می‌رود | میره |
| می‌رویم | میریم |
| می‌خواهم | می‌خوام |
| نمی‌خواهم | نمی‌خوام |
| می‌خواهی | می‌خوای |
| می‌خواهد | می‌خواد |
| می‌گویم | میگم |
| می‌گوید | میگه |
| است | -ـه (suffixed: `خوبه` for `خوب است`) / hast |
| این است | اینه |
| آن | اون |
| آنها | اونا |
| این را | اینو |
| را (after consonant) | -و / رو |
| خانه | خونه |
| نان | نون |
| می‌دانم | میدونم |
| نمی‌دانم | نمیدونم |
| می‌توانم | می‌تونم |
| یک | یه |
| دیگر | دیگه |
| اکنون | الان |
| همین‌طور | همینطور |

**Do not** rewrite proper names, technical terms, religious phrases, fixed expressions, or quoted material.

**Do not** mix registers — once a word is rewritten to spoken, all instances of that word in the text should match.

See `resources/spoken-rewrite.md` for the extended table and "don't rewrite" list.

### Step 8 — Preserve the structure on output

Return the text with the **same paragraph structure, line breaks, and overall layout** as the input. Only the content of each line changes.

| Preserve | Reason |
|---|---|
| Paragraph breaks | TTS engines reset prosody at paragraph boundaries |
| Line breaks within stanzas (poetry, lyrics) | Sometimes structurally meaningful |
| Headings and section markers | User may chunk by section |
| List bullets / numbering | User's formatting choice |
| Quoted passages | Keep quote marks as-is |
| Markdown bold/italic | Remove if asked, but flag — TTS doesn't render markdown |

After the preprocessed text, append a **mandatory Word Audit** showing the lexicon-scan decisions. This is what forces the scan to actually happen — without the visible audit, the LLM tends to mark a few obvious words and skip the rest.

### Word Audit (required) `[Rule]`

For every word in the text that was a candidate for the lexicon (§6.1 through §6.7), produce one row:

```
Word audit
─────────────────────────────────────────────────────────────────
Word (bare) | Lexicon class | Decision | Marked form | Count
─────────────────────────────────────────────────────────────────
کفش         | §1A cluster   | mark     | کَفش         | 2
چتر         | §1A cluster   | mark     | چَتر         | 1
شن          | §1B short-vowel | mark per context | شِن (sand) | 1
لنگه‌م       | §1B short-vowel | mark per context | لِنگه‌م (pair) | 1
قدم‌هات     | §1C clitic-chain | mark host | قَدَم‌هات   | 1
دور         | §1E homograph | mark per context | دَوْرِ (around) | 1
درام        | §1E homograph | mark per context (music) | دِرام | 3
دوره        | §1E homograph | rewrite (means "is far") | دور است | 1
نت          | §1E homograph | mark per context (music note) | نُت | 1
بهونه       | §1E always   | mark | بَهونه | 1
حرفت        | §1E homograph | mark per register (spoken) | حرفِت | 2
ساکسیفون     | §1F foreign-loan cluster | mark | ساکْسیفُون | 6
پیانو       | §1F foreign-loan cluster | mark | پِیانو | 1
─────────────────────────────────────────────────────────────────
Consistency check: ✓ every bare form replaced everywhere it appears
```

This is non-negotiable. The audit must include:
- Every word that matched a lexicon class
- The class (§1A through §1F)
- The decision (mark / mark-per-context / rewrite / leave)
- The marked form
- The count (how many times it appears in the text)
- An explicit consistency-check line at the bottom

The audit is what the user reads to verify nothing was left to chance. If the audit is missing or incomplete, the work is not done.

### Change summary (still include)

```
Changes applied:
- Register: <preserve / fluent-formal / spoken>
- Character normalisation: <count> replacements
- Half-spaces restored: <count>
- Punctuation: <count> additions
- Numbers/dates/symbols expanded: <count>
- Ezafe marks added: <count>
- Lexicon diacritisations: <count> (see Word Audit above)
- Spoken rewrites: <count> (Spoken register only)
- Structure: paragraph breaks preserved
```

### Step 9 — Engine-specific adapter (optional) `[Engine-specific]`

If the user names the target engine, also add the engine-specific layer at the end:

| Engine | Add |
|---|---|
| **Azure Speech (fa-IR)** | Add SSML `<break>` tags at paragraph breaks (`<break time="500ms"/>`). Note: Azure does NOT support phoneme / custom lexicon for fa-IR voices, so all pronunciation fixes must be in the text. |
| **Google Gemini-TTS (fa-IR)** | Add SSML `<break>` similarly. Currently Preview — expect some variance. |
| **MMS-TTS Persian** | **Strip all punctuation** before sending. MMS removes it anyway. Instead, **split into short sentences** and synthesise separately with controlled silence between (~ 400ms). |
| **XTTS-v2 / ElevenLabs** | XTTS-v2 doesn't officially support fa — use only fine-tuned community checkpoints. ElevenLabs handles Persian; punctuation works as expected. |
| **Unknown engine** | Skip this step. Deliver the text without engine-specific markup. |

See `resources/engine-adapters.md` for the full per-engine notes.

## Examples

### Example 1 — minimal (Preserve register)

**Input:**

```
این کتاب خوب رو که دیروز خریدم همون کتابیه که بهت گفته بودم
```

**Output (Preserve):**

```
این کتابِ خوب رو که دیروز خریدم، همون کتابیه که بهت گفته بودم.
```

**Changes:**
- Added ezafe on `کتابِ خوب` (was missing).
- Added `،` before `همون` (clause boundary).
- Added `.` at sentence end.
- (No character normalisation needed — input was clean.)

### Example 2 — full pipeline (Fluent-formal register)

**Input:**

```
سال 1405/02/01 ساعت 10:30 جلسه با مدير شركت داريم نميتونم بيام
```

**Output (Fluent-formal):**

```
سالِ یکم اردیبهشتِ هزار و چهارصد و پنج، ساعتِ ده و نیم، جلسه با مدیرِ شرکت داریم. نمی‌تونم بیام.
```

**Changes:**
- Arabic `ي`/`ك` → Persian `ی`/`ک` (4 replacements).
- Date `1405/02/01` → `یکم اردیبهشتِ هزار و چهارصد و پنج`.
- Time `10:30` → `ساعتِ ده و نیم`.
- Ezafe on `سالِ`, `ساعتِ`, `مدیرِ شرکت`.
- Half-space restored on `نمی‌تونم`.
- Added `،` between clauses.
- Added `.` to split the run-on into two sentences.

### Example 3 — Spoken rewrite

**Input:**

```
من می‌خواهم این کتاب را به تو بدهم چون آن را دوست داری
```

**Output (Spoken):**

```
من می‌خوام این کتابو بهت بدم، چون اونو دوست داری.
```

**Changes:**
- `می‌خواهم` → `می‌خوام` (spoken).
- `این کتاب را` → `این کتابو` (spoken; را → -و).
- `به تو بدهم` → `بهت بدم` (spoken contractions).
- `آن را` → `اونو` (spoken).
- Added `،` before `چون` and `.` at end.

### Example 4 — engine-specific (MMS-TTS adapter)

**Input + register chosen + engine = MMS-TTS:**

```
اگر دیر رسیدی، شروع کن. ولی عجله نکن.
```

**Output for MMS:**

```
[Chunk 1, send to MMS, insert 400ms silence after]
اگر دیر رسیدی شروع کن

[Chunk 2, send to MMS, insert 400ms silence after]
ولی عجله نکن
```

MMS strips punctuation, so the text is delivered as two separate synthesis calls with explicit silence between.

### Example 5 — diacritising single-syllable cluster words (the v0.2 fix)

These are the exact failures reported on v0.1 of the skill. Each was a "ordinary-looking" word that the engine mispronounced because the short vowel was implicit. v0.2 catches them via the lexicon scan in Step 6.

| Input | What v0.1 produced (bad) | What v0.2 should produce (good) | What the engine then reads |
|---|---|---|---|
| `لنگه‌کفش` | `لنگه‌کفش` (no fix) — engine read `lange-kefesh` | `لنگه‌کَفش` | `lange-kafsh` ✓ |
| `چتر خریدی` | `چتر خریدی` (no fix) — engine read `chetre kharidi` | `چَتر خریدی` | `chatr kharidi` ✓ |
| `شن نشست` | `شن نشست` (no fix) — engine read `shan neshast` | `شِن نشست` | `shen neshast` ✓ |
| `لنگه‌م` | `لنگه‌م` (no fix) — engine read `lang-am` | `لِنگه‌م` | `leng-am` ✓ |
| `قدم‌هات` | `قدم‌هات` (no fix) — engine read `qadame-hât` | `قَدَم‌هات` | `qadam-hât` ✓ |

The v0.2 instruction: **scan every word against `resources/exception-lexicon.md` §1A, §1B, §1C, §1D before delivery**. If a word matches a pattern, diacritize it. Don't second-guess; over-marking is harmless.

**Worked example** — Input:

```
من حافظِ قدم‌هات هستم. لنگه‌کفش رو پیدا کردم. چتر خریدی؟ شن نشست رو پاکم.
```

**Output (Preserve + Step 6 applied):**

```
من حافظِ قَدَم‌هات هستم. لنگه‌کَفش رو پیدا کردم. چَتر خریدی؟ شِن نشست رو پاکم.
```

**Changes per word:**
- `قدم‌هات` → `قَدَم‌هات` (cluster noun + clitic — §1C)
- `لنگه‌کفش` → `لنگه‌کَفش` (cluster word inside a compound — §1D)
- `چتر` → `چَتر` (CVCC cluster — §1A)
- `شن` → `شِن` (ambiguous short vowel — §1B; meaning "sand" from context)

Nothing else in the text changes. The structure, the formal register, the other words — all preserved.

### Example 6 — full song lyric (the v0.3 fix — homographs + foreign loans + visible Word Audit)

The exact failure case the user reported on v0.2: a song lyric that passed v0.2's cluster-monosyllable check but still mispronounced homographs (`دور`, `درام`, `دوره`, `نت`), foreign loans (`ساکسیفون`, `پیانو`), and inconsistent words (some occurrences fixed, others left bare).

**Input (excerpt, Spoken-leaning register):**

```
[Intro | smoky jazz club | brushed drums | upright bass]
دود می‌پیچه دورِ چراغ
شب نشسته روی شونه‌هام
میزِ چوبی، لیوانِ سرد
اسمِ تو مونده روی لب‌هام

[Verse 1]
درام آرومه...
مثلِ بارون روی شیشه
کافه خوابه، شهر دوره
دل هنوز از تو می‌نویسه

سایه‌ات رد می‌شه از ذهنم
مثلِ فیلمی بی‌صدا
من به هر نت خیره می‌مونم
تو به هر خاطره، جدا

[Pre-Chorus]
هیچ‌کس اینجا
جایِ تو حرف نمی‌زنه
جز ساکسیفونی که انگار
اسمِ من رو پس می‌زنه

[Chorus]
بمون امشب
بمون یه کم
بذار ساکسیفون
حرفت رو بزنه
```

**Output (preprocessed):**

```
[Intro | smoky jazz club | brushed drums | upright bass]
دود می‌پیچه دَوْرِ چراغ
شب نشسته روی شونه‌هام
میزِ چوبی، لیوانِ سرد
اسمِ تو مونده روی لب‌هام

[Verse 1]
دِرام آرومه...
مثلِ بارون روی شیشه
کافه خوابه، شهرْ دور است
دل هنوز از تو می‌نویسه

سایه‌ات رد می‌شه از ذهنم
مثلِ فیلمی بی‌صدا
من به هر نُت خیره می‌مونم
تو به هر خاطره، جدا

[Pre-Chorus]
هیچ‌کس اینجا
جایِ تو حرف نمی‌زنه
جز ساکْسیفُونی که انگار
اسمِ من رُ پس می‌زنه

[Chorus]
بمون امشب
بمون یه کم
بذار ساکْسیفُون
حرفِت رو بزنه
```

**Word Audit:**

```
Word audit
────────────────────────────────────────────────────────────────────────
Word (bare) | Class | Decision | Marked form        | Count
────────────────────────────────────────────────────────────────────────
دورِ        | §1E homograph | mark per context (around)   | دَوْرِ      | 1
درام        | §1E homograph | mark per context (drum/music) | دِرام    | 3 (verse 1, chorus, outro)
دوره        | §1E homograph | rewrite ("is far")           | دور است   | 1
نت          | §1E homograph | mark per context (music)    | نُت        | 1
ساکسیفون     | §1F foreign-loan cluster | mark         | ساکْسیفُون  | 6
ساکسیفونی    | §1F foreign-loan cluster + suffix | mark | ساکْسیفُونی | 1
رو (object after vowel) | §1E homograph | mark    | رُ          | 1 (in `من رُ`)
حرفت         | §1E homograph | mark per register (spoken) | حرفِت     | 2
بهونه        | §1E always   | mark                       | بَهونه    | 1 (in outro/bridge)
پیانو        | §1F foreign-loan cluster | mark        | پِیانو      | 1 (in verse 2)
کفش (in لنگه‌کفش) | §1A cluster | mark inside compound | لنگه‌کَفش | (only if appears)
چتر          | §1A cluster   | mark                       | چَتر       | (only if appears)
شن           | §1B short-vowel | mark per context (sand) | شِن        | (only if appears)
قدم‌هات      | §1C clitic-chain | mark host              | قَدَم‌هات | (if appears)
────────────────────────────────────────────────────────────────────────
Consistency check: ✓ every occurrence of ساکسیفون marked as ساکْسیفُون;
                  ✓ every occurrence of درام marked as دِرام;
                  ✓ every occurrence of حرفت marked as حرفِت
```

**Performance notes:**

- Register: Spoken-leaning (song lyric, conversational tone).
- Music-context homographs (`درام`, `نت`, `ساکسیفون`) all resolved to music readings.
- `دور` resolved as "around" (Intro) and rewritten as "دور است" when meaning "is far" (verse 1) — different word, different fix.
- `پیانو` consistently marked across all verses.
- Section tags preserved exactly. Line breaks preserved.

### Example 7 — when to refuse a change

**Input:**

```
داستان «خانهٔ مادربزرگ» نوشتهٔ صادق هدایت — یکی از مهم‌ترین آثار ادبیات معاصر
```

**Output (Preserve, do NOT rewrite):**

```
داستانِ «خانهٔ مادربزرگ» نوشته‌ی صادق هدایت — یکی از مهم‌ترین آثارِ ادبیاتِ معاصر.
```

**Changes:**
- Ezafe on `داستانِ`, `آثارِ`, `ادبیاتِ`.
- `نوشتهٔ` → `نوشته‌ی` (preferred form for tokenisation).
- Added `.` at sentence end.

**Do NOT** rewrite:
- The book title `خانهٔ مادربزرگ` (quoted — preserve).
- The author name `صادق هدایت`.
- The literary register — this is formal writing about literature, even in Spoken mode the title and author would stay formal.

## Resources

- `resources/half-space.md` — full ZWNJ pattern list, edge cases, and false-positive guards.
- `resources/punctuation.md` — Persian punctuation conventions, repair heuristics for ASR/OCR/LLM-sourced text, when to add vs leave.
- `resources/ezafe.md` — when to mark Ezafe per register, the decision tree, and the post-`ه` special case.
- `resources/numbers-and-symbols.md` — number expansion (Persian + Arabic + Roman digits), dates (Gregorian + Persian + Hijri), times, currencies, units, URLs, common symbols.
- `resources/exception-lexicon.md` — the `خوا-` family, religious terms, common foreign loans, proper-name handling for phantom-ezafe risk.
- `resources/spoken-rewrite.md` — extended formal-to-colloquial table, register transitions, "do not rewrite" list (proper names, technical terms, religious phrases, fixed expressions, quotes).
- `resources/engine-adapters.md` — per-engine quirks: Azure (no custom lexicon), Google Gemini (SSML break support), MMS (strips punctuation), XTTS / ElevenLabs / Coqui notes, SSML break duration recommendations.
- `resources/test-cases.md` — the 12-slice test suite (Ezafe, post-`ه` Ezafe, homograph, واو معدوله, half-space verbs, suffixes, yes/no questions, clause boundaries, numbers/dates, mild colloquial, clitics, long text). Use to verify the preprocessor's output on each engine.

## Notes & limitations

- **Persian TTS is front-end-limited, not model-limited.** The preprocessor matters more than the engine choice. Even a great model produces stiff output on raw text; a moderate model produces natural output on preprocessed text.
- **Preserve mode is the default.** Don't aggressively rewrite to Spoken unless the user explicitly asks. Rewriting formal text into colloquial form can break tone (academic, legal, literary, religious).
- **Ezafe marking is selective, not global.** Marking every possible ezafe makes the output read like a school textbook. Only mark where the engine is likely to drop it.
- **But short-vowel diacritization on cluster monosyllables is NOT selective — always mark.** Single-syllable Persian words with closed consonant clusters (`کفش`, `چتر`, `قفل`, `شکل`, …) and ambiguous-short-vowel monosyllables (`شن`, `لنگ`, `سر`, …) must be diacritized every time. Skipping these is the #1 source of "obvious" TTS mispronunciation. See Step 6.1–6.3 and `resources/exception-lexicon.md` §1A–§1D.
- **"Selective" applies to Ezafe, not to the exception lexicon.** v0.1 of this skill conflated the two — the LLM read "selective diacritization" as a global posture and let through known-bad cluster words. v0.2 corrects the framing: Ezafe is selective; lexicon entries are always applied.
- **The visible Word Audit is non-negotiable.** v0.2 made the lexicon `[Rule]` but the LLM still scanned incompletely — fixing some occurrences of a word and leaving others bare. v0.3 fixes this by requiring a visible per-word audit table in the output (Step 8). If the audit is missing or incomplete, the work is not done. The forcing function is the same idea the *Persian Suno Lyrics* skill uses with its Content Brief: making the LLM *show* its scan prevents the "I marked the easy ones and skipped the rest" failure mode.
- **Consistency is mandatory.** Same word, same diacritisation, every occurrence. The Word Audit ends with an explicit consistency-check line confirming zero bare forms of marked words remain anywhere in the text.
- **Context-dependent homographs are the most subtle failure class.** Words like `دور`, `درام`, `دوره`, `نت`, `حرفت` are spelled normally — the failure isn't a missing diacritic on a weird word, it's the engine picking the wrong reading of a normal word. These need *contextual* diacritisation: read the sentence, pick the meaning, mark accordingly. See §6.5 and `resources/exception-lexicon.md` §1E.
- **Foreign loanwords with internal clusters need the same treatment as native cluster monosyllables.** `ساکسیفون`, `پیانو`, `ساندویچ` — all have the same phantom-vowel-insertion failure as `کفش` or `چتر`. Mark them. See §6.6 and `resources/exception-lexicon.md` §1F.
- **Engine support for Persian varies wildly.** Azure has two voices but no custom lexicon. MMS strips punctuation. XTTS-v2 doesn't officially support Persian. ElevenLabs and Google Gemini-TTS are currently the safer English-speaker-friendly defaults for high-quality Persian; specialised Persian-trained models (ManaTTS, ParsVoice fine-tunes) are stronger for native quality but require infrastructure. See `resources/engine-adapters.md`.
- **Some Persian sounds remain AI-hard even with clean text.** `ع`, `ح`, `ق`, `ء` are inconsistently rendered. Proper names ending in `-li`, `-ra`, `-ma` (نازلی, سارا, نیما) often get a phantom ezafe inserted (`nâz-LI` → `nâz-EH-li`). The skill flags these but the engine may still mispronounce. Re-roll 2–3 times and pick.
- **Regional dialects (Khorasani, Lori, Kurdish, Bandari) are out of scope.** Default register is Tehran-standard Persian (`fa-IR` معیار). If the user wants regional flavour, write the معیار form and use post-processing in the audio.
- **Don't try to mark every Ezafe perfectly.** Mark the high-risk ones, let context handle the rest. The goal is "good enough that TTS reads naturally", not "every linguistic relationship encoded".
- **The skill output should be reversible.** A user should be able to compare input vs output and understand every change. If a change isn't explainable in one line, it's probably wrong.

## Changelog

- `0.3.0` — second round of fixes after v0.2 live testing. v0.2 added the lexicon classes but the LLM was still scanning incompletely — some occurrences of a word got diacritized, others didn't (the "leaving it to chance" problem the user flagged). v0.3 adds two new lexicon classes that v0.2 missed entirely (§1E context-dependent homographs covering `دور`/`دوره`/`نت`/`درام`/`بهونه`/`رو`/`حرفت`/`شکر`/`پر`/`سر`/`مرد`/etc., and §1F foreign loans with internal consonant clusters covering `ساکسیفون`/`پیانو`/`ساندویچ`/`اسپرت`/`الکترونیک`/etc.). More importantly, v0.3 adds a **mandatory visible Word Audit** to the output (Step 8) — a table listing every lexicon-class word, its decision, marked form, and count, with an explicit consistency-check line. This is the forcing mechanism: the LLM has to *show* the per-word scan, which makes "I'll fix some of them" impossible. Added §6.8 explicit consistency rule. Added Example 6 walking through the user's actual song lyric end-to-end with the full Word Audit. Renumbered the previous Example 6 to Example 7.
- `0.2.0` — major fix to Step 6 (exception lexicon) after live testing revealed the v0.1 was too conservative and let through known-bad cases like `کفش → kefesh`, `چتر → chetre`, `شن → shan`, `لنگ → lang`, and clitic chains like `قدم‌هات → qadame-hât`. The root cause: v0.1's exception lexicon was scoped to the `خوا-` family + proper names, and the LLM interpreted "selective diacritization" in Step 5 as "minimise diacritics". v0.2 expands the lexicon into four new sub-sections (§1A closed consonant-cluster monosyllables, §1B ambiguous short-vowel monosyllables, §1C clitic chains on cluster nouns, §1D Ezafe on cluster words) covering ~80+ high-frequency words, and rewrites Step 6 as a mandatory scan-and-diacritize procedure (`[Rule]`, not heuristic) that applies in every register including Preserve. Added a new Example 5 walking through the exact failures the user reported. Step 6 now has an explicit 6-priority scan procedure; over-marking is harmless, under-marking is the failure mode.
- `0.1.0` — initial version. Distilled from a comprehensive research brief on Persian TTS preprocessing covering phonetic basics, normalisation, half-space restoration, punctuation repair, Ezafe marking, exception lexicon, spoken-style rewrite, engine-specific adapters, and a 12-slice evaluation framework.
