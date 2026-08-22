# Ezafe (ـِ) — marking strategy for TTS

The ezafe is the short `-e` sound that links words in noun phrases. In normal Persian writing, it's almost never written out — the reader infers it. TTS engines often guess wrong.

The skill's job is to mark ezafe **selectively** — only where the engine is likely to drop it, never globally.

---

## What ezafe does

| Construction | With ezafe | Pronunciation |
|---|---|---|
| Noun + adjective | `کتابِ خوب` | `ketâb-e khub` |
| Noun + noun (possessive) | `کتابِ من` | `ketâb-e man` |
| Noun + noun (descriptive) | `صدای باران` | `sedâ-ye bârân` (note: `صدا` ends in vowel, so `ـی` written explicit) |
| Multiple chained | `کتابِ خوبِ من` | `ketâb-e khub-e man` |

Without ezafe, the engine reads them as disjoint words and the prosody breaks.

---

## Marking rules by register

### Preserve register (default)

Mark ezafe only on high-risk phrases. Skip when context makes it obvious.

**Mark when:**
- Two consecutive nouns with no preposition (`کتاب من` → `کتابِ من`)
- Noun + clearly attributive adjective (`کتاب خوب` → `کتابِ خوب`)
- Noun + name (`شهر تهران` → `شهرِ تهران`)
- Title + name (`دکتر علی` → `دکترِ علی`)

**Don't mark when:**
- The word is followed by a preposition (`کتاب در میز` — no ezafe; `در` is a preposition)
- The two words are in a list (`کتاب و دفتر` — no ezafe)
- Context already disambiguates (when ezafe is implicit by structure)
- It's a fixed compound (`دستِ‌کم`, `بازی‌گر` — leave as written)

### Fluent-formal register

Mark ezafe more aggressively, including in:
- Technical compound terms (`الگوریتمِ مرتب‌سازی`)
- Government / institutional names (`وزارتِ امور خارجه`)
- Long noun chains where the engine is likely to break the rhythm

### Spoken register

Mark ezafe in the spoken-form rewrite:
- `خونه‌ی بزرگ` (with the `ی` form for post-`ه` ezafe)
- `اسمِ تو`
- `دستِ من` (formal `دست من` → spoken `دستِ من`)

---

## The post-`ه` special case

When a noun ends in `ه` (silent or non-silent), the ezafe gets a special form:

| Construction | Form | Why |
|---|---|---|
| Noun ending in silent `ه` + word | `خانه‌ی خوب` (with ZWNJ + `ی`) | Joins phonetically; ensures the `-ye` sound |
| Same | `خانهٔ خوب` (with hamza-ye) | Traditional written form — but less reliable for some TTS engines |
| Same | `خانه خوب` (no ezafe mark) | Most common in modern writing — engine guesses |

**Preferred for TTS: `خانه‌ی خوب`** (ZWNJ + `ی`). The `هٔ` form (with hamza) is correct traditionally, but some tokenisers don't parse the hamza-ye sequence consistently.

### Decision

| Input | Convert to |
|---|---|
| `خانه خوب` | `خانه‌ی خوب` |
| `خانهٔ خوب` | `خانه‌ی خوب` (normalise the hamza-ye to ZWNJ-ye) |
| `خانه‌ی خوب` | leave (already correct) |

---

## Long-vowel-ending words

When a noun ends in a long vowel (`ا`, `و`, `ی`), the ezafe is `-ye`:

| Word | + something | Form |
|---|---|---|
| `صدا` (ends in `ا`) | `+ تو` | `صدای تو` (the `ی` is the ezafe, written explicit) |
| `بازو` (ends in `و`) | `+ راست` | `بازوی راست` |
| `بستنی` (ends in `ی`) | `+ شکلاتی` | `بستنیِ شکلاتی` (mark with `ـِ`) — or sometimes written `بستنی شکلاتی` |

For long-vowel-final words, the explicit `ی` form is the most reliable. The skill should preserve it when present and add it when missing in clearly attributive contexts.

---

## Ezafe chains

Persian allows long chains: `کتابِ خوبِ نویسنده‌ی معروفِ ایرانی` (the famous Iranian author's good book).

**Marking strategy:**
- Mark the **first ezafe** of a chain.
- Let context handle the rest if the chain is short (2–3 elements).
- Mark **every** ezafe in chains of 4+ to prevent the engine from misreading mid-chain.

| Chain length | Mark |
|---|---|
| 2 elements | First ezafe |
| 3 elements | First and middle (or all) |
| 4+ elements | All ezafes |

---

## The decision tree

```
For each noun phrase in the input:
  Is there a preposition or connector between the words?
  ├── Yes → don't mark ezafe
  └── No → continue
       Is the second word clearly attributive (adjective, noun, name)?
       ├── No → don't mark
       └── Yes → continue
            Is the first word ending in ه?
            ├── Yes → use noun-ZWNJ-ی form (خانه‌ی)
            └── No → continue
                 Is the first word ending in a long vowel (ا, و, ی)?
                 ├── Yes → use explicit ی form (صدای) — most are already written this way
                 └── No → add ـِ to the first word (کتابِ)
```

---

## What NOT to do

- **Don't mark every possible ezafe.** Over-marking makes the text read like a Persian-language textbook for foreigners.
- **Don't mark inside quoted titles or names.** `«کتابِ خانه‌ی مادربزرگ»` — leave the inner title alone if it's already-published material.
- **Don't mark in religious phrases or fixed expressions.** `بسم الله الرحمن الرحیم` — never modify.
- **Don't mark across a punctuation boundary.** `کتاب من، رفتم` — no ezafe between `من` and `رفتم`; they're separate clauses.

---

## Verification

After marking, read the output aloud (in your head or actually). For each ezafe:

- Does it sound natural in Persian?
- Could it be ambiguous in any way?
- Is it grammatically required, or is it stylistic?

If it sounds forced or over-precise, remove it. The skill should err on the side of *under-marking* rather than over-marking. The engine usually does fine; we're only fixing the cases it's known to break.

---

## Quick reference

| Pattern | Mark | Don't mark |
|---|---|---|
| Noun + adj | ✓ | |
| Noun + noun | ✓ | when preposition between |
| Noun + name | ✓ | |
| Verb + word | | ✗ |
| Word + preposition + word | | ✗ |
| List items | | ✗ |
| Inside fixed compound | | ✗ |
| Religious phrase | | ✗ |
| Inside quoted title | | ✗ |
| Across `،` or `.` | | ✗ |
