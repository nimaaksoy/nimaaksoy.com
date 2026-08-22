# Persian pronunciation tips for Suno

Persian poetry on paper does not sing the same as conversational Persian. Suno's vocal engine handles short, spoken-register Persian better than dense literary lines.

## Convert literary → singable

| Literary (avoid)                  | Singable (use)                       |
|-----------------------------------|--------------------------------------|
| `میخواهم بدانم چرا رفتی`         | `میخوام بدونم...`<br>`چرا رفتی؟`     |
| `در این شبِ تاریک غمگین`         | `توی این شبِ تاریک...`               |
| `قلب من از فراق تو سوخت`         | `دلم سوخت...`<br>`بی تو`             |
| `هرگز فراموش نخواهم کرد`         | `یادم نمیره...`<br>`هیچوقت`          |
| `بازگشت تو را آرزو میکنم`        | `کاش برگردی...`                      |

## Techniques

**Pauses.** Use `...` between half-thoughts. Suno reads them as breath room.

**Stretched vowels.** `خووووب`, `بمووون` — adds emotional weight to a single word.

**Emphasis.** `!` after a single short word lands like a vocal hit.

**Short lines.** 3–6 syllables per line is the comfort zone. Long literary lines break Suno's phrasing.

**Conversational endings.** `میدونم` over `میدانم`. `چرا` over `چرایی`. `دلم` over `قلبم`.

**Avoid heavy consonant clusters** at the start of chorus lines. They're hard for the vocal model to land.

## Vowel quality for choruses

Open vowels (`ا`, `و`, `ای`) carry better than closed vowels (`ـِ`, `ـُ`). When the chorus needs to soar, end lines on open vowels:

- `بمووون...` (good)
- `بمیر...` (harder for Suno to sustain)

## Romanisation: don't

Always use Persian script in the Lyrics field. Romanised Persian ("`bargard khoone`") tells Suno to sing English-phonetics-of-Persian, which sounds like a tourist reading.

If you need to give the user a transliteration for reference, put it in a comment or a separate block — keep the Lyrics field Persian-script only.
