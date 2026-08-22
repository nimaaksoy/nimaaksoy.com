# Number, date, time, currency, symbol, URL expansion

TTS engines read digits as digits ("یک دو سه چهار" for `1234`). For natural reading, expand numbers to spelled-out Persian.

---

## Cardinal numbers

| Digit | Persian |
|---|---|
| 0 | صفر |
| 1 | یک |
| 2 | دو |
| 3 | سه |
| 4 | چهار |
| 5 | پنج |
| 6 | شش |
| 7 | هفت |
| 8 | هشت |
| 9 | نه |
| 10 | ده |
| 11 | یازده |
| 12 | دوازده |
| 13 | سیزده |
| 14 | چهارده |
| 15 | پانزده |
| 16 | شانزده |
| 17 | هفده |
| 18 | هجده |
| 19 | نوزده |
| 20 | بیست |
| 30 | سی |
| 40 | چهل |
| 50 | پنجاه |
| 60 | شصت |
| 70 | هفتاد |
| 80 | هشتاد |
| 90 | نود |
| 100 | صد |
| 1000 | هزار |
| 1,000,000 | میلیون |
| 1,000,000,000 | میلیارد |
| 1,000,000,000,000 | تریلیون |

### Compound construction

Persian compounds with `و` (and):

- `25` → `بیست و پنج`
- `123` → `صد و بیست و سه`
- `1234` → `هزار و دویست و سی و چهار`
- `12345` → `دوازده هزار و سیصد و چهل و پنج`
- `1234567` → `یک میلیون و دویست و سی و چهار هزار و پانصد و شصت و هفت`

### Hundreds

- 100 = صد
- 200 = دویست
- 300 = سیصد
- 400 = چهارصد
- 500 = پانصد
- 600 = ششصد
- 700 = هفتصد
- 800 = هشتصد
- 900 = نهصد

---

## Ordinals

| Pattern | Persian | Example |
|---|---|---|
| `1st`, `اول`, `یکم`, `اولین` | اول / یکم / اولین | `1st` → `اولین` or `یکم` |
| `2nd`, `دوم`, `دومین` | دوم / دومین | `2nd` → `دومین` or `دوم` |
| `3rd`, `سوم`, `سومین` | سوم / سومین | `3rd` → `سومین` |
| `Nth`, `Nم`, `Nمین` | append `ـُم` or `ـُمین` to the cardinal | `4th` → `چهارم` / `چهارمین` |

Special cases:

- `1st` for a date: `یکم` (e.g. `یکم اردیبهشت`)
- `1st` for a ranking: `اولین` or `اول`
- The skill should pick based on context — "1st place" → `اول`, "1st of May" → `یکم`

---

## Fractions and decimals

| Pattern | Persian |
|---|---|
| `½`, `1/2`, `0.5` | یک‌دوم / نصف |
| `¼`, `1/4`, `0.25` | یک‌چهارم |
| `¾`, `3/4`, `0.75` | سه‌چهارم |
| `2/3` | دو سوم |
| `2.5` | دو و نیم |
| `3.14` | سه ممیز چهارده / سه نقطه یک چهار |
| `1.5kg` | یک و نیم کیلوگرم |

Decimals: prefer `ممیز` for technical content, `نقطه` for casual.

---

## Dates

### Persian / Solar Hijri (Shamsi)

Format: `YYYY/MM/DD`

| Input | Output |
|---|---|
| `1405/02/01` | `یکم اردیبهشتِ هزار و چهارصد و پنج` |
| `1404/12/29` | `بیست و نهم اسفندِ هزار و چهارصد و چهار` |
| `1405/01/01` | `اولِ فروردینِ هزار و چهارصد و پنج` (or `نوروزِ هزار و چهارصد و پنج` if context is New Year) |

Persian months (in order):

| # | Month |
|---|---|
| 1 | فروردین |
| 2 | اردیبهشت |
| 3 | خرداد |
| 4 | تیر |
| 5 | مرداد |
| 6 | شهریور |
| 7 | مهر |
| 8 | آبان |
| 9 | آذر |
| 10 | دی |
| 11 | بهمن |
| 12 | اسفند |

### Gregorian (Miladi)

Format: `YYYY-MM-DD` or `DD/MM/YYYY` (varies)

| Input | Output |
|---|---|
| `2026-05-17` | `هفدهم می دو هزار و بیست و شش` |
| `17/05/2026` | same |
| `May 17, 2026` | same (recognise the month name) |

Gregorian months:

| English | Persian |
|---|---|
| January | ژانویه |
| February | فوریه |
| March | مارس |
| April | آوریل |
| May | می |
| June | ژوئن |
| July | ژوئیه |
| August | اوت / آگوست |
| September | سپتامبر |
| October | اکتبر |
| November | نوامبر |
| December | دسامبر |

### Hijri / Lunar (Qamari)

| Input | Output |
|---|---|
| `1447 هـ.ق` | `هزار و چهارصد و چهل و هفت هجری قمری` |

Months:

| English | Persian |
|---|---|
| Muharram | محرم |
| Safar | صفر |
| Rabi al-Awwal | ربیع‌الاول |
| Rabi al-Thani | ربیع‌الثانی |
| Jumada al-Awwal | جمادی‌الاول |
| Jumada al-Thani | جمادی‌الثانی |
| Rajab | رجب |
| Sha'ban | شعبان |
| Ramadan | رمضان |
| Shawwal | شوال |
| Dhu al-Qi'dah | ذی‌القعده |
| Dhu al-Hijjah | ذی‌الحجه |

### Inferring calendar from context

If the date is in the range 1300–1500 → likely Shamsi.
If 1400–1500 in Hijri context (mentioned with هـ.ق) → Qamari.
If 1900–2100 → likely Miladi.

When ambiguous, ask or default to Shamsi (the most common in Persian text).

---

## Times

| Input | Output |
|---|---|
| `10:30` | `ساعتِ ده و نیم` or `ده و سی دقیقه` |
| `10:45` | `ده و چهل و پنج دقیقه` or `یک ربع به یازده` |
| `15:00` | `ساعتِ پانزده` or `ساعتِ سه بعدازظهر` |
| `00:00` / `24:00` | `نیمه‌شب` |
| `12:00` | `ظهر` |
| `06:00 AM` | `ساعتِ شش صبح` |
| `06:00 PM` | `ساعتِ شش بعدازظهر` |

For 12-hour vs 24-hour: in spoken Persian, 12-hour with `صبح` / `بعدازظهر` / `شب` is more natural than 24-hour.

---

## Currency

| Pattern | Output |
|---|---|
| `$25` | `بیست و پنج دلار` |
| `€100` | `صد یورو` |
| `£50` | `پنجاه پوند` |
| `25 تومان` | `بیست و پنج تومان` |
| `100,000 ریال` | `صد هزار ریال` |
| `1.5 میلیون تومان` | `یک و نیم میلیون تومان` |

Always spell out the currency name.

---

## Units

| Abbreviation | Full Persian |
|---|---|
| `kg` | کیلوگرم |
| `g` | گرم |
| `mg` | میلی‌گرم |
| `km` | کیلومتر |
| `m` | متر |
| `cm` | سانتی‌متر |
| `mm` | میلی‌متر |
| `L`, `lt` | لیتر |
| `ml` | میلی‌لیتر |
| `°C` | درجه سانتی‌گراد |
| `°F` | درجه فارنهایت |
| `%` | درصد |
| `Hz` | هرتز |
| `MHz` | مگاهرتز |
| `GHz` | گیگاهرتز |
| `MB`, `GB`, `TB` | مگابایت / گیگابایت / ترابایت |
| `kg/m²` | کیلوگرم بر متر مربع |

Examples:

- `25%` → `بیست و پنج درصد`
- `100 km/h` → `صد کیلومتر بر ساعت`
- `5 GB` → `پنج گیگابایت`
- `25°C` → `بیست و پنج درجه سانتی‌گراد`

---

## Symbols

| Symbol | Read as |
|---|---|
| `&` | `و` |
| `@` (in email) | `اَت` (or skip — emails often shouldn't be read) |
| `#` (number) | `شماره` (e.g., `#3` → `شمارهٔ سه`) |
| `#` (hashtag) | `هشتگ` |
| `+` (math) | `به‌علاوه` |
| `-` (math) | `منهای` |
| `*`, `×` (math) | `ضربدر` |
| `/`, `÷` (math) | `تقسیم بر` |
| `=` | `مساوی` |
| `~` | `تقریباً` |
| `→` | `به` or `تبدیل به` (context) |
| `©` | `کپی‌رایت` (or skip) |
| `®`, `™` | `ثبت‌شده` (or skip) |

---

## URLs

| Pattern | Decision |
|---|---|
| `https://example.com` | If meant to be spoken: `سایتِ اگزمپل دات کام`. If reference only: skip entirely. |
| Email `user@example.com` | Almost always skip — emails aren't meant to be read |
| `@username` (social handle) | If meant to be spoken: `اَت یوزرنیم`. Usually skip. |
| File path `/home/user/file.txt` | Skip — paths aren't meant for TTS |

**Default**: if the URL is just a reference (e.g. footnote), remove it. If it's the subject of the sentence ("Visit example.com"), expand it.

---

## Markdown / formatting characters

These are visual formatting, not content. Remove silently:

| Character | Action |
|---|---|
| `*`, `**` (markdown bold/italic) | Remove |
| `_`, `__` | Remove |
| `~~` (strikethrough) | Remove |
| ``` ` ``` (code) | Remove |
| `#`, `##`, `###` (headings) | Remove the `#` marks; keep the heading text |
| `>` (blockquote marker) | Remove |
| `-`, `*` (list bullets) | Remove |
| `1.`, `2.` (numbered list) | Convert to spoken form: `یکم`, `دوم`, or leave the number and the engine will say it |
| `[text](url)` | Keep `text`, drop the URL |
| `![alt](src)` (image) | Drop entirely or expand to `(تصویر: alt)` |

---

## Edge cases

### Mixed digit systems

Input might contain Persian digits `۰۱۲...` and Arabic digits `0123...` mixed. Normalise all to one set first (Persian for Persian text), then expand.

### Years in different calendars

If a sentence has both `2026` and `1405`, expand both with their calendar names:

`در سال ۱۴۰۵ (۲۰۲۶ میلادی)` → `در سالِ هزار و چهارصد و پنج (دو هزار و بیست و شش میلادی)`

### Ranges

| Input | Output |
|---|---|
| `5-10` | `پنج تا ده` |
| `2020-2026` | `دو هزار و بیست تا دو هزار و بیست و شش` |
| `صفحه ۱۰-۱۵` | `صفحه ده تا پانزده` |

### Phone numbers

Read as digits, separated by short pauses:

`021-12345678` → `صفر دو یک ... یک دو سه چهار پنج شش هفت هشت`

For internal pause control, use `،` between digit groups.
