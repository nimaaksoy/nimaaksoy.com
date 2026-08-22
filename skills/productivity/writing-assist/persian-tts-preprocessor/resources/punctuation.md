# Persian punctuation for TTS

Punctuation controls prosody. Persian TTS engines use it to decide where to breathe, where to raise pitch, where to drop. Missing punctuation produces run-on, monotone, ambiguous-intonation output.

---

## The Persian punctuation set

| Mark | Use | Latin equivalent | Effect on TTS |
|---|---|---|---|
| `،` (Persian comma, U+060C) | Clause boundary, list separator | `,` | Short pause (~ ¼ beat), no pitch reset |
| `؛` (Persian semicolon, U+061B) | Strong clause boundary | `;` | Medium pause |
| `:` | Introduce list, quote, explanation | `:` | Medium pause |
| `.` | Sentence end | `.` | Long pause + full pitch reset |
| `؟` (Persian question mark, U+061F) | Question | `?` | Rising intonation (yes/no), context-driven for wh-questions |
| `!` | Exclamation | `!` | Emphasis / shout — use sparingly |
| `«»` (Persian quotation marks) | Quoted speech, titles | `""` | Some engines render a brief pause inside |
| `—` (em dash) | Parenthetical, long pause | `—` | Longer pause than comma, no full reset |
| `...` (ellipsis) | Trailing thought, pause | `...` | Sustained pause, soft trail |
| `(  )` (parens) | Aside / disambiguation | `(  )` | Some engines lower volume / brief pause |

---

## When to add (punctuation restoration)

Trigger this step if the input looks like it came from ASR / OCR / LLM output — text without `،`, `.`, or `؟` despite obvious clause boundaries.

### Where to add `،`

Between clauses joined by these connectors when they mark a real clause boundary:

| Connector | Add `،` before? |
|---|---|
| `و` (and) | Sometimes — only between two complete clauses (`رفتم، و دیدم`). Within a list (`سیب و موز`), don't add. |
| `اما`, `ولی` (but) | Yes, always |
| `چون`, `چرا که`, `زیرا` (because) | Yes |
| `اگر` (if, at the start of a conditional) | Add after the conditional clause: `اگر بیایی، بهت میگم` |
| `که` (that, who, which) | Sometimes — add when it introduces a non-restrictive clause |
| `پس` (so, then) | Yes |
| `وقتی`, `وقتی که`, `هنگامی که` (when) | Yes, at the end of the temporal clause |
| `بعد از اینکه`, `قبل از اینکه` | Yes |
| Lists of 3+ items | Between every item |
| Direct address (vocative) | Around the vocative: `سلام، علی، خوبی؟` |

### Where to add `.`

At the end of every grammatical sentence. The simplest heuristic: if the next word starts a new subject + verb structure, the previous one should end with `.`.

For long Persian sentences with multiple clauses, prefer to split into shorter sentences. TTS reads short sentences better than long ones.

### Where to add `؟`

After any sentence containing:

- Yes/no markers: `آیا` (rare in spoken), rising intonation implied
- Wh-words: `چرا`, `چه`, `چی`, `کی`, `کجا`, `چطور`, `کدام`, `چند`, `چقدر`
- Tag questions: ending in `نه؟`, `مگه نه؟`
- Direct questions in dialogue: any sentence the speaker intends as a question

**Don't** add `؟` to a rhetorical statement that just sounds like a question.

### Where to add `!`

Sparingly. Only for:

- Interjections: `وای!`, `آخ!`, `بلند شو!`
- Direct commands at a high register: `بایست!`, `بزن!`
- Genuine exclamations: `چه قشنگ!`

**Overusing `!` can trigger shouted/distorted output on some engines.** One per paragraph is plenty.

---

## Latin → Persian conversion

In Persian-only text, convert Latin punctuation to Persian equivalents:

| Latin | Persian |
|---|---|
| `,` | `،` |
| `;` | `؛` |
| `?` | `؟` |
| `"..."` | `«...»` |
| `'...'` (single quotes) | `«...»` or leave |
| `--` (double hyphen) | `—` (em dash) |

**Don't** convert in mixed-language text (e.g. when Persian is quoting English: `گفت: "Hello"` — leave the English-style quotes around the English text).

---

## What NOT to add

- **Don't add a comma at every breath spot.** Over-comma'd Persian sounds like a child reading slowly.
- **Don't add a period mid-sentence.** Use `،` for breath, `.` for closure.
- **Don't add `؟` to embedded questions** that are syntactically statements: `نمی‌دانم کجا رفت` is a statement, not a question — no `؟`.
- **Don't add `!` for emphasis** — use it only for genuine exclamations.

---

## Engine-specific punctuation behaviour

### Azure Speech (fa-IR)

Respects `،`, `.`, `؟`, `!` well. Pause length is determined automatically; SSML `<break time="..."/>` overrides.

### Google Gemini-TTS

Respects all standard Persian punctuation. SSML `<break>` works for fine control.

### MMS-TTS

**Strips punctuation entirely.** Use punctuation in your master text for human readability, but split into separate synthesis calls and add silence externally. Don't expect commas to translate to breath.

### XTTS-v2 / fine-tuned community models

Variable behaviour. Test on each model.

### ElevenLabs

Persian support is good and responds to punctuation. Some long-text generations benefit from explicit `<break>` SSML.

---

## Pause-duration reference (for engines that support SSML breaks)

| Punctuation | Equivalent break |
|---|---|
| `،` | `<break time="200ms"/>` |
| `؛` | `<break time="400ms"/>` |
| `:` | `<break time="300ms"/>` |
| `.` | `<break time="500ms"/>` |
| `؟` / `!` | `<break time="500ms"/>` (intonation handled by `?` / `!` shape) |
| `—` | `<break time="350ms"/>` |
| `...` | `<break time="600ms"/>` |
| Paragraph break | `<break time="800ms"/>` |

Tune per voice and content. News reading uses shorter pauses; storytelling and audiobook use longer ones.

---

## Common ASR/OCR/LLM patterns to fix

| Source pattern | Likely issue | Fix |
|---|---|---|
| Long Persian sentence with no `،` | ASR doesn't insert commas | Add commas at clause boundaries per the rules above |
| Question without `؟` | ASR rarely punctuates questions correctly | Detect wh-words and add `؟` |
| Two paragraphs run together (no `.` between sentences) | LLM output | Add `.` between sentences, restore paragraph breaks |
| Mixed Latin / Persian punctuation | OCR or copy-paste | Convert to Persian-script punctuation throughout |
| `?` or `,` Latin style | OCR or copy-paste | Convert to `؟` / `،` |
| Capitalised words mid-sentence | OCR of mixed text | Leave alone — Persian doesn't have case |
