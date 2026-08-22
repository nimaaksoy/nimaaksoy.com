# Test cases — the 12-slice evaluation suite

Use these test cases to verify that the preprocessor and the target TTS engine produce correct output. Test slice-by-slice, not as one big MOS score — that way you know exactly where the system fails.

For each slice:

1. Run the input through the preprocessor.
2. Verify the preprocessed text matches the expected output.
3. Send to the target engine.
4. Listen and rate: ✓ correct / ⚠ partially correct / ✗ wrong.

A system passing all 12 slices is production-ready. A system failing 3+ slices needs work before deployment.

---

## Slice 1 — Simple Ezafe

| Input | Expected after preprocessing | Expected audio |
|---|---|---|
| `کتاب خوب` | `کتابِ خوب` | `ketâb-e khub` (with `-e` linker) |
| `صدای باران` | `صدای باران` (already explicit) | `sedâ-ye bârân` |
| `مرد دانا` | `مردِ دانا` | `mard-e dânâ` |

**Failure modes:**
- Engine drops the `-e` (reads as two words with a gap)
- Engine over-stresses both words equally

---

## Slice 2 — Post-`ه` Ezafe

| Input | Expected | Expected audio |
|---|---|---|
| `خانه بزرگ` | `خانه‌ی بزرگ` | `khâne-ye bozorg` |
| `بچه خوب` | `بچه‌ی خوب` | `bachche-ye khub` |
| `قهوه داغ` | `قهوه‌ی داغ` | `ghahve-ye dâgh` |
| `بسته جدید` | `بسته‌ی جدید` | `baste-ye jadid` |

**Failure modes:**
- Engine reads as two words: `khâne` ... `bozorg` with a pause
- Engine reads the `ی` as a separate syllable (`khâne-y-e bozorg` — wrong)

---

## Slice 3 — Homograph disambiguation

| Input | Context | Expected reading |
|---|---|---|
| `مرد` | as a noun ("man") | `mard` |
| `مرد` | as a verb past tense ("died") | `mord` |
| `می‌برد` | as "he/she takes" | `mi-barad` (formal) / `mi-bare` (spoken) |
| `می‌برد` | as past "he/she took" | `bord` (but with `می` it's `mi-bord`) — context-dependent |
| `کرم` | as "cream" | `kerem` |
| `کرم` | as "worm" | `kerm` |
| `سر` | as "head" | `sar` |
| `سر` | as "secret" | `serr` |

**Failure modes:**
- Engine picks the wrong reading based on default frequency
- Engine ignores context entirely

**Fix:** add Ezafe or short context word to bias the reading. For ambiguous cases, the preprocessor cannot always resolve — flag to user.

---

## Slice 4 — واو معدوله (silent `و`)

| Input | Expected reading |
|---|---|
| `خواهر` | `khâhar` (not `xa-vâ-har`) |
| `خواب` | `khâb` |
| `خواندن` | `khândan` |
| `خواستن` | `khâstan` |
| `خواهر من` | `khâhar-e man` (with Ezafe added) |
| `می‌خواب` | this isn't a valid form; check input |
| `خوابیدم` | `khâbidam` |

**Failure modes:**
- Engine reads the `و` as a vowel (extra syllable)
- Most multilingual engines (Azure, Google) get this wrong on uncommon words

**Fix in preprocessor:** flag the word in `یادداشت` / output notes. Cannot fix in plain text without changing spelling.

---

## Slice 5 — Verb half-space (`می`, `نمی`)

| Input (raw) | Expected after preprocessing |
|---|---|
| `می روم` | `می‌روم` |
| `می گویم` | `می‌گویم` |
| `نمی توانم` | `نمی‌توانم` |
| `می آید` | `می‌آید` |
| `می فهمم` | `می‌فهمم` |

**Failure modes:**
- Engine reads `می` and the verb as two separate words
- Stress falls on the wrong syllable

---

## Slice 6 — Plural and superlative suffixes

| Input (raw) | Expected after preprocessing |
|---|---|
| `کتاب ها` | `کتاب‌ها` |
| `کتاب های من` | `کتاب‌های من` |
| `بزرگ تر` | `بزرگ‌تر` |
| `بهترين` | `بهترین` (Arabic ي → Persian ی) |
| `خانه ها` | `خانه‌ها` |

**Failure modes:**
- Tokeniser splits the suffix as a separate word
- Engine pauses between the noun and the suffix

---

## Slice 7 — Yes/no question intonation

| Input | Expected |
|---|---|
| `می‌ری؟` | `می‌ری؟` (preserve question mark) |
| `می‌ری` (no `؟`) | preprocessor should add `؟` if context implies question |
| `آیا می‌آیی؟` | `آیا می‌آیی؟` |
| `خوبه؟` | `خوبه؟` |

**Failure modes:**
- Engine reads as statement (falling intonation) when it should be rising
- Engine ignores the `؟` (especially MMS — chunking compensates)

**Fix:** ensure `؟` is present in input. For MMS, the chunking strategy creates implicit pauses but doesn't fix intonation — accept this limitation.

---

## Slice 8 — Clause boundaries (`،` and `.`)

| Input (raw) | Expected after preprocessing |
|---|---|
| `اگر دیر رسیدی شروع کن` | `اگر دیر رسیدی، شروع کن.` |
| `رفتم و دیدم که خانه خالی است` | `رفتم و دیدم که خانه‌ی خالی است.` (Ezafe + period) |
| `خوب است که اینجا هستی اما باید بروم` | `خوب است که اینجا هستی، اما باید بروم.` |

**Failure modes:**
- Engine reads run-on with no breath
- Long single sentence sounds rushed and unnatural

---

## Slice 9 — Numbers, dates, times

| Input | Expected after preprocessing |
|---|---|
| `سال ۱۴۰۵` | `سالِ هزار و چهارصد و پنج` |
| `۱۴۰۵/۰۲/۰۱` | `یکم اردیبهشتِ هزار و چهارصد و پنج` |
| `۱۰:۳۰` | `ساعتِ ده و نیم` |
| `۲۰۲۶-۰۵-۱۷` | `هفدهم می دو هزار و بیست و شش` |
| `۲۵٪` | `بیست و پنج درصد` |
| `$25` | `بیست و پنج دلار` |

**Failure modes:**
- Engine reads digits one by one: "یک چهار صفر پنج"
- Engine pronounces `/` literally as "اسلش"
- Engine misreads month numbers in dates

---

## Slice 10 — Mild colloquial (Spoken register)

| Input (Formal) | Expected after Spoken rewrite |
|---|---|
| `می‌خواهم بروم` | `می‌خوام برم` |
| `این کتاب را می‌خواهم` | `این کتابو می‌خوام` |
| `این چیست؟` | `این چیه؟` |
| `می‌توانم کمک کنم؟` | `می‌تونم کمک کنم؟` |
| `می‌بینم تو را در خانه` | `می‌بینمت تو خونه` |

**Failure modes:**
- Engine still reads formal version (preprocessor didn't apply)
- Engine reads spoken form but in a stiff tone (engine limitation)

---

## Slice 11 — Clitics and complex word forms

| Input | Expected reading |
|---|---|
| `کتاب‌هامون` | `ketâb-hâ-mun` (our books) |
| `دیدمش` | `didam-esh` (I saw him/her) |
| `بهت میگم` | `behet migam` (I'm telling you) |
| `ازش پرسیدم` | `azesh porsidam` (I asked him/her) |
| `می‌بینمت` | `mi-binamet` (I see you) |

**Failure modes:**
- Engine misreads clitic boundary
- Engine puts stress on the clitic (it should be unstressed)

---

## Slice 12 — Long text (paragraph, multi-clause)

Test input (formal):

```
هوا امروز سرد و باد می‌وزید. وقتی از خانه بیرون آمدم، باران شروع به باریدن کرد. کاپشن خود را پوشیدم و به سمت ایستگاه اتوبوس راه افتادم. آنجا منتظر اتوبوس شدم اما اتوبوس دیر کرده بود. در نهایت تصمیم گرفتم پیاده بروم.
```

Expected after preprocessing (Preserve):

```
هوا امروز سرد و باد می‌وزید. وقتی از خانه بیرون آمدم، باران شروع به باریدن کرد. کاپشنِ خود را پوشیدم و به سمتِ ایستگاهِ اتوبوس راه افتادم. آنجا منتظرِ اتوبوس شدم، اما اتوبوس دیر کرده بود. در نهایت تصمیم گرفتم پیاده بروم.
```

Changes: Ezafe added on `کاپشنِ خود`, `سمتِ ایستگاهِ اتوبوس`, `منتظرِ اتوبوس`; comma added before `اما`.

**Failure modes:**
- Engine reads with no pause variation (monotone)
- Engine pauses oddly (mid-clause)
- Pitch doesn't reset at paragraph boundary
- Stress falls wrong in 1+ noun phrases

---

## Reporting template

For each engine + slice combination:

```
Engine: [Azure / Google / MMS / ElevenLabs / ManaTTS / ParsVoice]
Slice: [1–12, name]
Input: [text]
Preprocessed: [text]
Audio rating: [✓ correct / ⚠ partial / ✗ wrong]
Notes: [what went wrong, if anything]
Fix tried: [if any]
```

Aggregate the results into a slice × engine matrix. The best engine for your project is the one with the most ✓s on the slices that matter for your content.

---

## What "production-ready" means

| Slice score | Status |
|---|---|
| 12 / 12 ✓ | Production-ready for any Persian content |
| 10–11 / 12 ✓ | Production-ready with known limitations (document the failing slices) |
| 7–9 / 12 ✓ | Beta-ready; suitable for some content types |
| ≤ 6 / 12 ✓ | Not ready; needs more preprocessing work or a different engine |

A common pattern: most engines get 8–11 ✓ when paired with this preprocessor. The remaining 1–4 failures are usually in slices 3 (homograph), 4 (`خوا-` family), and 11 (clitics) — places where text-only fixes can't fully overcome engine limitations.
