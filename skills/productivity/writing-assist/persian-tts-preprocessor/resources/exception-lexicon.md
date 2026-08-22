# Exception lexicon — words where standard letter-to-sound fails

These are not rules. They're memorised exceptions where Persian's standard orthography doesn't produce the correct pronunciation. Hand them to the engine as-is and you get a wrong reading.

The skill handles these by either marking them in the text or warning the user that the engine may need help.

> **Read this first.** The two highest-impact failure classes are **(a) closed consonant-cluster monosyllables** (`کفش`, `چتر`, `قفل`, `شکل` …) where the engine inserts a phantom vowel mid-cluster, and **(b) ambiguous short-vowel words** (`شِن` vs `شَن`, `مِزه` vs `مَزه`) where the engine guesses the wrong vowel. These two classes are far more common than the واو معدوله issue and are the #1 source of "obvious" TTS mispronunciation in Persian. **Always diacritize words from sections 1A and 1B below — this is a `[Rule]`, not a heuristic.**

---

## 1A. Closed consonant-cluster monosyllables — diacritize them every time `[Rule]`

When a Persian word is a single syllable ending in a two-consonant cluster (CVCC), the engine often inserts a **phantom epenthetic vowel** between the two final consonants to make it pronounceable. Persian writes the short vowel implicit, so the engine has no way to know whether the vowel is `a`, `e`, or `o` — and it usually guesses wrong.

**Real failure examples (from production):**

| Bare written | What the engine read | What was correct |
|---|---|---|
| `کفش` | `kefesh` (extra `e` inserted) | `kafsh` |
| `چتر` | `chetre` (treated as `chetr` + ezafe) | `chatr` |
| `قفل` | `qofel` | `qofl` |
| `شکل` | `shekel` | `shekl` |
| `قبر` | `qabar` | `qabr` |
| `نبض` | `nabaz` | `nabz` |
| `مشت` | `moshat` | `mosht` |
| `پست` | `posat` | `post` |

**Fix:** add the explicit short-vowel diacritic on the first consonant of the cluster.

| Bare | Diacritized | Vowel | Reading |
|---|---|---|---|
| کفش | `کَفش` | fatha | kafsh |
| چتر | `چَتر` | fatha | chatr |
| قبر | `قَبر` | fatha | qabr |
| شکل | `شِکل` | kasra | shekl |
| نبض | `نَبض` | fatha | nabz |
| قفل | `قُفل` | damma | qofl |
| مشت | `مُشت` | damma | mosht |
| پست | `پُست` | damma | post |
| نطق | `نُطق` | damma | notq |
| خشم | `خَشم` | fatha | khashm |
| دست | `دَست` | fatha | dast |
| تخت | `تَخت` | fatha | takht |
| سخت | `سَخت` | fatha | sakht |
| مشک | `مُشک` | damma | moshk |
| شخص | `شَخص` | fatha | shakhs |
| نفس | `نَفَس` | fatha+fatha | nafas |
| شغل | `شُغل` | damma | shoghl |
| قدر | `قَدر` | fatha | qadr |
| قلب | `قَلب` | fatha | qalb |
| فکر | `فِکر` | kasra | fekr |
| ذکر | `ذِکر` | kasra | zekr |
| صبر | `صَبر` | fatha | sabr |
| عمق | `عُمق` | damma | omq |
| سکر | `سُکر` | damma | sokr |
| لطف | `لُطف` | damma | lotf |
| عشق | `عِشق` | kasra | eshq |
| لمس | `لَمس` | fatha | lams |
| حبس | `حَبس` | fatha | habs |
| مژه | `مِژه` | kasra | mezhe |
| پخش | `پَخش` | fatha | pakhsh |
| خشک | `خُشک` | damma | khoshk |

**Scan rule for the preprocessor**: any time a single-syllable Persian word has the shape `CC...C` (consonant + consonant cluster at the end) and is **not** in the safe list below, add the diacritic. Don't wait for the user to flag it.

**Safe list (single-syllable cluster words that almost always read correctly):**

`اسم` (esm), `عمل` (amal — 2 syllables), `قلم` (qalam — 2 syllables). When in doubt, mark anyway — over-marking is harmless; under-marking is the failure mode.

---

## 1B. Ambiguous short-vowel monosyllables — disambiguate every time `[Rule]`

These are single-syllable words where the short vowel could plausibly be `a`, `e`, or `o`, and the meaning depends on which one. The engine guesses the most-frequent reading, which is often wrong for the user's context.

**Real failure examples:**

| Bare | Engine read | User meant |
|---|---|---|
| `شن` | `shan` | `shen` (sand) |
| `لنگ` (in `لنگم`) | `lang` (lame) | `leng` (pair, leg) |

**Fix:** always add the explicit short vowel.

| Word | Diacritized | Meaning |
|---|---|---|
| شن | `شِن` | sand |
| شن (other) | `شَن` | (less common) |
| لنگ | `لِنگ` | leg, half of a pair |
| لنگ | `لَنگ` | lame |
| سر | `سَر` | head |
| سر | `سِرّ` | secret (note: tashdid on r) |
| کرم | `کِرم` | worm |
| کرم | `کِرِم` | cream (with extra kasra) |
| کرم | `کَرَم` | generosity |
| مرد | `مَرد` | man |
| مرد | `مُرد` | died (past verb) |
| مزه | `مَزه` | taste |
| مزه | `مِزه` | (regional) |
| شکر | `شِکَر` | sugar |
| شکر | `شُکر` | thanks |
| پر | `پَر` | feather |
| پر | `پُر` | full |
| نم | `نَم` | moisture |
| نم | `نِم` | (in some contexts) |
| بد | `بَد` | bad |
| بدن | `بَدَن` | body |
| سم | `سَم` | poison |
| سم | `سُم` | hoof |
| خم | `خَم` | bent |
| خم | `خُم` | jar |
| ده | `دَه` | ten |
| ده | `دِه` | village |
| رد | `رَد` | trace, reject |
| سد | `سَدّ` | dam |
| فر | `فِر` | curl, oven |
| فر | `فَرّ` | royal glory |
| نخ | `نَخ` | thread |
| نخ | `نُخ` | (in compounds) |
| پز | `پَز` | cooking/showing-off |
| تن | `تَن` | body / ton |

**Scan rule for the preprocessor**: any single-syllable Persian word from this list — always diacritize. Pick the reading from context (if the surrounding sentence makes the meaning clear, use that vowel; if ambiguous, ask the user once).

---

## 1C. Clitic chains that produce phantom syllables `[Rule]`

When a noun ending in a consonant takes the plural `ها` and a possessive clitic (`ت`, `ش`, etc.), the chain `noun + ‌ + ها + clitic` can confuse some engines, which insert an extra `ه` syllable.

**Real failure example:**

| Bare | Engine read | Correct |
|---|---|---|
| `قدم‌هات` | `qadame-hât` (extra `e` before `هات`) | `qadam-hât` |

**Fix:** use one of these forms (in order of preference):

| Form | Use when |
|---|---|
| `قَدَم‌هات` (diacritized) | Default — adding fatha on the noun stabilises the boundary |
| `قدم‌های‌ت` (expanded clitic) | Formal context; more explicit |
| `قدماتو` (contracted, spoken register) | Spoken register, when followed by `را`/`رو` |
| `قدم‌های تو` (fully separated) | Last resort — loses the clitic relationship |

**Class of words affected:**

Any consonant-final noun + `‌ها` + possessive clitic:

| Noun + suffix chain | Risky bare form | Safer diacritized | Safer expanded |
|---|---|---|---|
| قدم + ها + ت | قدم‌هات | قَدَم‌هات | قدم‌های‌ت |
| دست + ها + ش | دست‌هاش | دَست‌هاش | دست‌های‌ش |
| چشم + ها + م | چشم‌هام | چِشم‌هام | چشم‌های‌م |
| حرف + ها + ت | حرف‌هات | حَرف‌هات | حرف‌های‌ت |
| کتاب + ها + ش | کتاب‌هاش | کتاب‌هاش (no diacritic needed; 2 syllables) | کتاب‌های‌ش |

The pattern: 2+ syllable nouns rarely fail. **Single-syllable nouns with cluster endings (`قَدَم`, `دَست`, `چِشم`) need diacritization** to prevent the engine from misreading the boundary.

---

## 1E. Context-dependent homographs — disambiguate by surrounding context `[Rule]`

The biggest cause of "wrong but not obviously wrong" TTS errors. The word is spelled normally, the engine picks the most-frequent reading, the user's intended meaning is the less-frequent one. Always diacritize based on the sentence context.

### Common offenders

| Bare | Reading A (often default) | Reading B (often intended) | How to disambiguate |
|---|---|---|---|
| دور | `dur` (far) | `dor / dowr` (around, period, cycle) | When meaning "around"/"surrounding" → write `دَوْرِ` (e.g. `دَوْرِ چراغ` — around the lamp) |
| دوره | `dowre` (period, era, course) | `dur ast` (it is far — contracted) | When meaning "it is far" → expand to `دور است` or write `دورْه` with explicit sukun; never leave bare |
| نت | `nat` (negation particle, rare) | `not` (music note, from English) | Music context → `نُت` |
| درام | `derâm / dirâm` (drum) | `derâm` (drama, theatre) | Music context → `دِرام`; theatre context → `دْرام` |
| بهونه | `behune` (engine guess, wrong) | `bahune` (colloquial of بهانه — excuse) | Always → `بَهونه` |
| رو | `ru` (face) | `ro` (object marker, suffixed to vowel-final word) | When object marker after vowel → write `رُ` (e.g. `من رُ`); when face → leave `رو` |
| حرفت | `harfat` (formal "your speech") | `harfet` (spoken "your speech") | Spoken/colloquial context → `حرفِت`; formal context → `حرفَت` |
| پر | `par` (feather, wing) | `por` (full) | Always diacritize: `پَر` or `پُر` based on meaning |
| سر | `sar` (head) | `serr` (secret) | Always diacritize: `سَر` or `سِرّ` |
| مرد | `mard` (man) | `mord` (died) | Always diacritize: `مَرد` or `مُرد` |
| کرم | `kerm` (worm) / `kerem` (cream) / `karam` (generosity) | varies | Always diacritize per meaning |
| شکر | `shekar` (sugar) | `shokr` (thanks) | Always diacritize: `شِکَر` or `شُکر` |
| نشست | `neshast` (sat / sitting / session) | `nashast` (didn't sit — rare) | Usually leave as `نشست` (standard reading); rare alt needs marking |
| دست | `dast` (hand) | `dest` (rare poetic) | `دَست` for safety |
| می‌برد | `mi-barad` (he/she takes) | `mi-bord` (was taking, past continuous) | Add prefix `می‌` context or diacritic to disambiguate |
| خوش | `khosh` (happy, good) | `khash` (rare) | `خُوش` |
| خوب | `khub` (good) | — | safe |

### Procedure

For every Persian word in the input:

1. Is the word in the homograph list above?
2. If yes — read the surrounding sentence and pick the meaning.
3. Write the explicit diacritic form. **Never leave a homograph un-diacritized when the lexicon flags it.**

### Real failure example from production

Input lyric:

```
دود می‌پیچه دورِ چراغ        ← `دور` here = "around" (dor), not "far" (dur)
درام آرومه                  ← `درام` here = "drum" (music context), not "drama"
کافه خوابه، شهر دوره        ← `دوره` here = "the city is far" (dur-e), not "era"
به هر نت خیره می‌مونم        ← `نت` = "note" (music), not "negation"
```

Without disambiguation, the engine picked the wrong reading for every one of these. With disambiguation:

```
دود می‌پیچه دَوْرِ چراغ
دِرام آرومه
کافه خوابه، شهر دور است
به هر نُت خیره می‌مونم
```

This class is the source of the **subtlest** failures because the reading sounds Persian and the listener doesn't realise it's wrong until they hear the meaning shift.

---

## 1F. Foreign loans with internal consonant clusters — diacritize the cluster `[Rule]`

Foreign loanwords (especially music, technology, and modern vocabulary) often have consonant clusters that Persian doesn't natively allow. The engine inserts a phantom vowel mid-cluster — same failure mode as §1A but in loanwords.

### Common loan-word failures

| Bare | Wrong reading | Diacritized | Correct reading |
|---|---|---|---|
| ساکسیفون | `sâkesifoni` (extra `e` + ezafe) | `ساکْسیفُون` | `sâksifun` (sax-i-fun) |
| پیانو | `piyâno` (literal Persian) | `پِیانو` | `pyâno` (closer to English) |
| ساندویچ | `sândevich` | `ساندْویچ` | `sandvich` |
| ترانسفر | `terâmsfer` | `ترانْسفِر` | `trânsfer` |
| ترانزیستور | `terânzistur` | `ترانْزیستور` | `trânzistor` |
| تکنولوژی | `teknolozhi` (usually correct) | `تِکْنُولُوژی` | `teknolozhi` |
| الکترونیک | `elekteronik` | `اِلِکْتْرونیک` | `elektronik` |
| اسپانیا | `espâniyâ` | `اِسْپانیا` | `espâniyâ` (usually safe) |
| اسپرت | `esporet` | `اِسْپُورْت` | `esport` |
| اسپریدر | `esperider` | `اِسْپْرِیدِر` | `espreyder` |

### Procedure

1. Identify foreign loanwords (look for spellings unusual in native Persian: consecutive consonants, English-origin spellings, sport/tech/music vocabulary).
2. If the word has 2+ consonants between vowels, add explicit sukun (`ـْ`) on the first consonant of the cluster and explicit vowel marks on the rest.
3. **Same word, same diacritics, every time** — don't mark `ساکْسیفُون` in one verse and leave `ساکسیفون` bare in the next. Consistency is required.

### Often-safe loanwords (still verify)

These usually read correctly on common engines:

`کامپیوتر`, `تلویزیون`, `اینترنت`, `موبایل`, `رادیو`, `سینما`, `اتوبوس`, `موسیقی`, `پلیس`, `بانک`

The dividing line is roughly: 3+ syllables = usually safe; 2-syllable with internal cluster = usually fails.

---

## 1D. Ezafe on cluster-ending words — diacritize the host before the ezafe `[Rule]`

When a single-syllable cluster word takes an ezafe, the ezafe gets read but the host word's internal vowel may still be guessed wrong.

**Real failure:**

| Bare | Engine read | Correct |
|---|---|---|
| `لنگه‌کفشِ` | `lange-kefeshe` (kafsh→kefesh, then ezafe) | `lange-ye kafsh-e` |

**Fix:** diacritize the cluster word *before* applying the ezafe.

| Pattern | Bare | Fix |
|---|---|---|
| `noun ezafe-cluster-word` | `صدای کفش` | `صدای کَفش` |
| `cluster-word ezafe-something` | `کفشِ کوچک` | `کَفشِ کوچک` |
| `compound noun with cluster` | `لنگه‌کفش` | `لنگه‌کَفش` |

Always: **diacritize first, then mark ezafe.** Order matters — if ezafe is added first, the LLM/engine may not return to fix the cluster reading.

---

## 1. واو معدوله (silent `و`) — the `خوا-` family

Persian words written with `خوا` historically had a long `o-â` sound. Modern Tehran-standard Persian dropped the `o`, but the spelling kept the `و`. The `و` is silent.

| Word | Wrong reading | Correct |
|---|---|---|
| خواهر | xa-vâ-har | khâ-har |
| خواب | xa-vâb | khâb |
| خواندن | xa-vân-dan | khân-dan |
| خواستن | xa-vâs-tan | khâs-tan |
| خواهان | xa-vâ-hân | khâ-hân |
| خواهش | xa-vâ-hesh | khâ-hesh |
| خواب‌آلود | xa-vâb-âlud | khâb-âlud |
| خوابیدن | xa-vâ-bi-dan | khâ-bi-dan |
| خواستار | xa-vâs-târ | khâs-târ |
| خواندنی | xa-vân-da-ni | khân-da-ni |
| خوانده | xa-vân-de | khân-de |
| خوانندگان | xa-vâ-nan-de-gân | khâ-nan-de-gân |
| خواستن | xa-vâs-tan | khâs-tan |
| خوارزم (proper) | xa-vâ-razm | khâ-razm |

**Rule:** any word starting with `خوا` is in the silent-`و` family. The `و` is not pronounced.

**Engine behaviour:**
- Some Persian-trained TTS engines (ParsVoice, ManaTTS) handle this correctly.
- General multilingual engines (Azure, Google) often get this wrong.

**Fix for engines that don't support custom lexicon:**
- The skill flags the word but can't directly fix it in plain text (you can't remove the `و` without changing spelling).
- If the engine consistently mispronounces, switch to phonetic notation (some engines accept `[xahar]` or IPA in tags).

**Don't apply outside the `خوا-` family.** `خوب` (`khub`) is NOT in this class — the `و` here is the `u` sound, pronounced.

---

## 2. Words with rare Arabic spellings

| Word | Note |
|---|---|
| الله (`allâh`) | Standard religious. Always preserve as-is. |
| الرحمن (`ar-rahmân`) | Religious. Preserve. |
| الرحیم (`ar-rahim`) | Religious. Preserve. |
| لـ (in fixed expressions like `لاحول`) | Religious / archaic. Leave alone. |
| صلوة, زکوة | Archaic Arabic spellings of `salât` and `zakât`. Persian usually writes صلات, زکات. If you see these in text, leave alone unless you're sure of the modern intent. |
| ـٰ (dagger alif, e.g. `الله` , `هذا`) | Quranic / classical. Preserve. |

Don't try to modernise religious or classical Arabic terms. They're written in fixed forms.

---

## 3. Common foreign loans — leave as-is

Persian has absorbed many foreign words with phonetic-Persian spellings that engines usually handle correctly:

| Word | Reading |
|---|---|
| کامپیوتر | computer |
| تلویزیون | television |
| اینترنت | internet |
| موبایل | mobile |
| رادیو | radio |
| موسیقی | musiqi (Arabic) |
| اتوبوس | otobus |
| اتومبیل | otomobil |
| سینما | sinemâ |
| تئاتر | te'âtr |

**Don't try to fix these.** Most engines pronounce them correctly. Modifying the spelling can break the pronunciation.

---

## 4. Proper-name phantom-ezafe risk

Two-syllable Persian names ending in `-i`, `-â`, `-u`, or `-a` are commonly mispronounced by TTS engines that insert a phantom ezafe inside:

| Name | Wrong reading | Correct |
|---|---|---|
| نازلی | nâz-EH-li | nâz-li |
| سارا | sâ-RAH | SÂ-râ |
| لیلا | ley-LAH | LEY-lâ |
| ندا | ne-DAH | ne-DÂ |
| رضا | re-ZÂ-a | re-ZÂ |
| علی | a-LI | a-LI (usually correct, but watch in long names) |
| نیما | ni-MAH | nimâ |
| سینا | si-NAH | si-nâ |
| رویا | ru-YAH | ru-yâ |
| شیما | shi-MAH | shi-mâ |
| نگار | ne-GÂR-r | ne-GÂR |
| ساغر | sâ-GAR | sâ-ghar |

### Fix techniques

Pick one based on the situation:

1. **Wrap in Persian quotation marks**: `«نازلی»` — many engines treat quoted spans as proper nouns and resist ezafe insertion.
2. **Use the possessive form**: `نازلیِ من` (literally "my Nazli"). The explicit ezafe locks the rhythm and prevents Suno from inventing one.
3. **Anchor in a full clause**: `اسمت نازلیه` instead of bare `نازلی، بیا`. The surrounding context gives the engine enough cue.
4. **Spell out in transliteration alongside**: `نازلی (Nazli)` — last resort; visually noisy.

### Three+ syllable names are usually safer

| Name | Usually correct |
|---|---|
| محمدرضا | mohammad-rezâ |
| علیرضا | ali-rezâ |
| فریماه | fari-mâh |
| پرستو | pa-ras-tu |
| نگارین | ne-gâ-rin |

Don't apply the fix techniques to these unless you observe a real problem.

### City and place names

| Name | Note |
|---|---|
| تهران | Usually correct |
| اصفهان | Sometimes mispronounced (es-fa-hân vs es-fâ-hân) |
| قم | Usually correct |
| مشهد | Usually correct |
| تبریز | Usually correct |
| شیراز | Usually correct |
| یزد | Usually correct |
| بوشهر | Usually correct |

Most major city names are common enough that engines handle them. Smaller / less-known cities may need wrapping.

---

## 5. Honorifics and titles

| Title | Reading |
|---|---|
| دکتر | dok-tor |
| مهندس | mo-han-des |
| استاد | os-tâd |
| آقای | â-ghâ-ye |
| خانم | khâ-nom |
| سرکار خانم | sar-kâr khâ-nom |
| جناب | je-nâb |
| حاج | hâj |
| سید | sey-yed |
| سیده | sey-ye-de |

Engines usually handle these. The combination of title + name (`دکترِ علی`) sometimes drops the ezafe — see `ezafe.md`.

---

## 6. Abbreviations to expand

| Abbreviation | Expansion |
|---|---|
| م.ا (Mr.) | "آقایِ" |
| خ. (Mrs.) | "خانمِ" |
| دکتر = د. | "دکتر" (don't use abbreviation form) |
| م.ا.ا (= معاون اول) | "معاونِ اول" |
| ج.ا.ا (= جمهوری اسلامی ایران) | "جمهوریِ اسلامیِ ایران" |
| س.ل.ل (= ساعت / ل/ل) | usually skip — too rare |
| ه.ش (Solar Hijri) | "هجری شمسی" |
| ه.ق (Lunar Hijri) | "هجری قمری" |
| ه.م (= هجری میلادی) | "هجری میلادی" or "میلادی" |
| ع. (after a name = peace be upon him) | "علیه‌السلام" |
| ص. (after Muhammad) | "صلی‌الله‌علیه‌و‌آله" — but most TTS engines don't render this well; consider expanding or skipping |

---

## 7. Common mispronunciation patterns (engine-dependent)

These are not always wrong, but worth flagging:

| Word | Sometimes wrong | Correct |
|---|---|---|
| ای (vocative) | uy (closed) | ey (open) |
| است | as-t | ast (one syllable) |
| می‌تواند | mi-tu-vâ-nad | mi-tavâ-nad |
| پنج (5) | pen-j | panj (one syllable) |
| تخت | tax-t | takht (one syllable) |
| سخت | sax-t | sakht (one syllable) |

The fix is usually engine-dependent. For Azure / Google / ElevenLabs, the standard Persian-script form should work. For MMS or older models, you may need to add hint markers (some engines accept `[say: takht]` or similar).

---

## 8. What this skill should NOT try to fix

Don't try to fix every Persian word's pronunciation. Most are correct on most engines.

**Out of scope:**
- General mispronunciations that vary by engine
- Regional dialect pronunciations
- Old-style poetic readings (`میم` for `می‌ام`, etc.)
- Highly specialised vocabulary (medical, legal, scientific terminology)
- Foreign words that the engine handles correctly

**In scope for this lexicon:**
- The `خوا-` family (high-frequency, always wrong without intervention)
- Proper-name phantom-ezafe (common failure mode with a known fix)
- Religious / classical Arabic phrases (preserve as-is)
- Common abbreviations (expand)

If the user reports a specific word being mispronounced and it's not in this list, add it to a project-specific lexicon. Don't bloat this skill's exception list with every observed mispronunciation.
