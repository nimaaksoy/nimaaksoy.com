# Half-space (ZWNJ) restoration patterns

ZWNJ (`U+200C`, نیم‌فاصله) joins morphologically related parts as one tokenisation unit. Critical for Persian TTS — without it, tokenisers split things they shouldn't, and engines drop or mispronounce affixes.

---

## Apply these patterns (in order)

| # | Pattern | Replace with | Examples |
|---|---|---|---|
| 1 | `می` + space + verb stem (any tense) | `می` + ZWNJ + verb | `می روم` → `می‌روم`; `می آید` → `می‌آید` |
| 2 | `نمی` + space + verb stem | `نمی` + ZWNJ + verb | `نمی توانم` → `نمی‌توانم` |
| 3 | `بی` + space + adj/noun (when prefix) | `بی` + ZWNJ + word | `بی هوش` → `بی‌هوش`; `بی خانمان` → `بی‌خانمان` |
| 4 | `با` + space + adj/noun (when prefix, less common) | `با` + ZWNJ + word | `با شعور` → `با‌شعور` (only when context confirms it's a prefix) |
| 5 | noun + space + `ها` (plural marker) | noun + ZWNJ + `ها` | `کتاب ها` → `کتاب‌ها` |
| 6 | noun + space + `های` (plural + Ezafe) | noun + ZWNJ + `های` | `کتاب های من` → `کتاب‌های من` |
| 7 | noun + space + `هایی` (plural indefinite) | noun + ZWNJ + `هایی` | `کتاب هایی` → `کتاب‌هایی` |
| 8 | adj + space + `تر` (comparative) | adj + ZWNJ + `تر` | `بزرگ تر` → `بزرگ‌تر` |
| 9 | adj + space + `ترین` (superlative) | adj + ZWNJ + `ترین` | `بزرگ ترین` → `بزرگ‌ترین` |
| 10 | word + space + clitic possessive (`ام`, `ات`, `اش`, `امان`, `اتان`, `اشان`) | word + ZWNJ + clitic | `کتاب ام` → `کتاب‌ام` |
| 11 | word + space + `ای` (indefinite/vocative, when phonetically merged) | word + ZWNJ + `ای` | `مرد ای رهگذر` → `مردای رهگذر` (only when it's vocative) |
| 12 | word ending in `ه` + space + `ی` + space + word (Ezafe form) | word + ZWNJ + `ی` + space + word | `خانه ی من` → `خانه‌ی من` |

---

## False-positive guards

These look like ZWNJ candidates but aren't:

| Pattern | Looks like | Actually is |
|---|---|---|
| `می` + space + non-verb (e.g. proper noun) | might join | don't join — `می` here is a different word (e.g. `می گفت` is fine; `می سعید` is a proper name) |
| `بی` + space + proper noun | might join | don't — `بی` is here the preposition "without" not a prefix |
| `با` + space + most words | usually NOT a prefix | leave as separate words; `با` is the preposition "with" |
| `که` / `چه` + space + word | almost never joined | leave separate |
| Standalone `می`, `بی`, `با` at sentence start | might attach mistakenly | check context — only join when the next word is morphologically the attached element |

---

## Order matters

Apply patterns from longest match first. Otherwise `نمی‌توانم` (نمی + توانم) could be wrongly split if `می` (pattern 1) runs before `نمی` (pattern 2).

Recommended order:

1. Pattern 2 (`نمی`)
2. Pattern 1 (`می`)
3. Patterns 6, 7 (`های`, `هایی`) before pattern 5 (`ها`)
4. Pattern 9 (`ترین`) before pattern 8 (`تر`)
5. Patterns 3, 4, 10–12 in any order

---

## Edge cases

### When the verb stem starts with a vowel-letter (`ا`, `آ`)

`می` + `ایست` (verb stem of "to stand"): `می ایستم` → `می‌ایستم`. The ZWNJ joins them; pronunciation is `mi-istam`.

But: `می امام` is wrong — this is `می + امام` where امام is a noun, not a verb.

### When `می` is a noun (= "wine")

`می ناب` ("pure wine") — don't join. `می` here is a noun.

Disambiguate by context: if the next word is a clear verb stem, join. Otherwise leave.

### When `بی` is the preposition "without"

`بی من` ("without me") — don't join. `بی` is a preposition here, not a prefix.

The prefix form attaches to nouns/adjectives that become compound: `بی‌خبر`, `بی‌نظیر`, `بی‌جان`. The preposition form attaches to standalone words: `بی من`, `بی خبر` (the latter could be either — context decides).

### Already-joined forms

If the input already has the ZWNJ, leave it. Don't double-join. Don't remove and re-apply.

---

## What ZWNJ does NOT do

- It's not a space. It joins for tokenisation but doesn't add a visible glyph.
- It doesn't change pronunciation directly — it changes how tokenisers/engines see the word boundary.
- It's not a hyphen.

In monospace or text-mode displays, ZWNJ can look like an extra space or nothing at all. Use UTF-8 text editors that show invisible characters when proofing.

---

## Engine notes

- **Azure / Google**: respect ZWNJ correctly. Use it.
- **MMS-TTS**: ignores ZWNJ as part of its tokeniser stripping. Use the joined form anyway — it doesn't hurt and helps other downstream tools.
- **XTTS / ElevenLabs**: handle ZWNJ correctly in most cases. Use it.

When in doubt, prefer the joined form. The risk of false-join is lower than the risk of mis-tokenisation.
