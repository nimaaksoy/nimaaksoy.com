# Persian prosody — vazn, qafiye, radif

A working cheat-sheet, not a full عروض textbook. Enough to scan a line and pick a meter without falling into the most common errors.

---

## Syllable types in Persian scansion

Persian عروض recognises three syllable types:

| Symbol | Type            | Pronounced as                | Example                  |
|--------|------------------|------------------------------|--------------------------|
| `U`    | کوتاه (short)    | one short vowel + consonant   | به /be/, که /ke/        |
| `–`    | بلند (long)      | long vowel, or short + 2 consonants | با /bā/, دل /del/   |
| `–U`   | کشیده (extended) | long + 1 consonant + short, or short + 3 consonants | راست /rāst/ |

**Rule of thumb when in doubt**: any syllable ending in two consonants or containing a long vowel (ا، و، ی) is `–`.

---

## The major meters (بحور) used in this skill

Each meter is given as the repeated افاعیل (foot pattern) and a one-line description.

| Meter shorthand                              | Foot pattern (one line)                      | Common use                                  |
|----------------------------------------------|----------------------------------------------|---------------------------------------------|
| **رمل مثمن مخبون محذوف**                    | فاعلاتُ فعلاتُ فعلاتُ فعلن                    | Hafez غزل, common general-purpose غزل meter |
| **مجتث مثمن مخبون محذوف**                    | مفاعلن فعلاتن مفاعلن فعلن                    | Hafez غزل (lyrical, narrow rhythm)          |
| **مضارع مثمن اخرب مکفوف محذوف**             | مفعولُ فاعلاتُ مفاعیلُ فاعلن                  | Hafez غزل (more sonorous)                   |
| **هزج مسدس محذوف**                          | مفاعیلن مفاعیلن فعولن                         | Romance مثنوی (Nezami's Khosrow o Shirin)   |
| **هزج (رباعی variants)**                    | مفعول مفاعیل مفاعیل فعل / مفاعلن فعلن        | رباعی                                        |
| **متقارب مثمن محذوف**                        | فعولن فعولن فعولن فعل                         | Ferdowsi مثنوی (epic)                       |
| **رمل مسدس محذوف**                          | فاعلاتن فاعلاتن فاعلن                         | Rumi مثنوی                                   |

If you're unsure which to pick, default by style:

- **Ferdowsi مثنوی** → فعولن فعولن فعولن فعل
- **Rumi مثنوی** → فاعلاتن فاعلاتن فاعلن
- **Hafez / Saadi غزل** → رمل مثمن مخبون محذوف
- **Khayyam رباعی** → one of the رباعی variants above
- **Modern lyric** → free pulse; line-length consistency over classical scansion

---

## Scansion shorthand

Mark stressed (long) and unstressed (short) syllables under the line. Example using رمل مسدس محذوف (`فاعلاتن فاعلاتن فاعلن` = `– U – – | – U – – | – U –`):

```
بشنو این نی   چون شکایت    می‌کند
–   U  –   – | –   U  –  – | –  U  –
```

If the count breaks, the line breaks. The fix: change a word for one of equivalent meaning but different syllable shape. Common substitutions:

- یک‌هجایی ↔ دوهجایی: «دل» ↔ «جان»، «شب» ↔ «امشب».
- Drop the ezafe (ـِ) where syntax allows.
- Use shortened forms in modern register: «می‌خواهم» → «می‌خوام» (only in modern lyric, never in classical غزل).

---

## قافیه (Rhyme)

The قافیه is the **rhyme cluster** — usually the last vowel + the consonant(s) following it, plus any consonants that immediately precede if they recur.

Examples:

- نگاه / گناه / گاه — قافیه = `-āh`
- شنید / دوید / رمید — قافیه = `-īd`

Rules:

- **Identical word doesn't count as rhyme.** «راه» and «راه» is repetition (radif), not قافیه. Use a different قافیه root.
- **Visual ≠ aural rhyme.** Pick rhymes by ear, not by spelling. «خوب» and «طوب» rhyme; «خوب» and «شب» do not.
- **Once chosen in the مطلع, locked.** All subsequent قافیه words must follow the same pattern.

---

## ردیف (Radif)

The radif is a **fixed word or short phrase repeated immediately after the قافیه** in every rhyming مصراع.

Example (with radif `است`):

```
دلم گرفته است
هوا شکسته است
صدا نشسته است
```

Here the قافیه is `-aste` (گرفته، شکسته، نشسته) and the radif is `است`.

Rules:

- The radif is **identical** every time. Word, ezafe, even pronunciation must match.
- Once introduced in the مطلع, it must appear in every following rhyming مصراع.
- A good radif acts as the poem's emotional anchor. A weak radif is a verbal tic.

If the user gives a key word in their brief, consider lifting it as the radif — it makes the poem feel commissioned, not generic.

---

## Common scansion errors (and the fix)

| Error                                                | Fix                                                         |
|------------------------------------------------------|-------------------------------------------------------------|
| Line is one syllable too long                         | Drop an ezafe, contract a word, or pick a shorter synonym.  |
| Line is one syllable too short                        | Add an ezafe, lengthen a word, or insert "ای" or "که".     |
| First foot is right but the rest drift                | Re-scan the whole line; mid-line consonant clusters are the usual culprit. |
| Two long syllables where one short is needed          | Replace a long-vowel word (e.g. «بود») with a short one (e.g. «شد»). |
| Rhyme is visual but not aural                         | Read aloud. If the vowels don't match, the rhyme is broken. |
| Modern colloquial breaks classical meter              | Either go fully modern (شعر نو) or restore the classical form throughout. Don't mix mid-poem. |
