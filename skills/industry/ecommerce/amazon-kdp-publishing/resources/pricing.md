# KDP pricing, royalties, and the actual money math

Sourced May 2026. Royalty thresholds and delivery fees change; verify before locking a price.

---

## Kindle eBook

Two royalty options. The choice is partly yours, partly determined by territory and price.

### 35% royalty

- Available in **all** sales territories KDP supports.
- Formula: `0.35 × list price`.
- Price range: **$0.99 to $200** (some thresholds by file size).
- No delivery cost deduction.

### 70% royalty

- Available only in **eligible territories** (most major markets including US, UK, EU, Canada, Australia).
- Price range: **$2.99 to $9.99** (on Amazon.com; ranges vary by marketplace).
- Formula: `0.70 × (list price − VAT − delivery cost)`.
- **Delivery cost on Amazon.com: $0.15 per MB**, market-specific elsewhere.
- In **Brazil, Japan, Mexico, India**: 70% requires the book to be enrolled in **KDP Select**.
- Public-domain books are not 70%-eligible unless they contain substantial original contribution (translation, commentary, adaptation).

### Quick comparison at common prices

| List price | 35% royalty | 70% royalty (1 MB file, US) |
|---|---|---|
| $0.99 | $0.35 | not eligible |
| $2.99 | $1.05 | `0.70 × (2.99 − 0.15) = $1.99` |
| $4.99 | $1.75 | `0.70 × (4.99 − 0.15) = $3.39` |
| $7.99 | $2.80 | `0.70 × (7.99 − 0.15) = $5.49` |
| $9.99 | $3.50 | `0.70 × (9.99 − 0.15) = $6.89` |
| $14.99 | $5.25 | not eligible (above 70% range) |

For 70% to beat 35%, you typically need to be at $2.99+. Below $2.99, 35% is the only option.

### Pricing strategy heuristics

- **$2.99–$4.99**: typical for novellas, short nonfiction, first-in-series.
- **$4.99–$7.99**: typical for full-length novels, mid-length nonfiction.
- **$7.99–$9.99**: typical for premium nonfiction, established authors.
- **$0.99**: only for first-in-series loss-leader strategy or short stories.
- **You cannot price a book free** through normal Kindle pricing. For a free run, use **KDP Select's Free Book Promotions** (max 5 days per 90-day enrollment).

---

## Paperback

Royalty formula: `(royalty rate × list price) − printing cost = royalty per copy`.

### The 50% / 60% threshold

On Amazon.com:

- **List price $9.98 or below** → **50% royalty rate**
- **List price $9.99 or above** → **60% royalty rate**

This is a *cliff*, not a slope. Pricing at $9.99 instead of $9.98 typically nets you ~$1 more per copy on the same printing cost. **Always $9.99, never $9.98.** Other marketplaces have similar but currency-specific thresholds.

### Printing cost formula (Amazon.com)

| Trim | Ink type | Fixed cost | Per-page cost |
|---|---|---|---|
| Regular trim | Black ink | $1.00 | $0.012 |
| Regular trim | Standard color | $0.85 | $0.045 |
| Regular trim | Premium color | $0.85 | $0.065 |
| Large trim | Black ink | $1.00 | $0.017 |

Example: 300pp paperback, regular trim, black ink → `$1.00 + (300 × $0.012) = $4.60` printing cost per copy.

### Royalty scenarios

| Page count | Ink | List price | Rate | Printing cost | Royalty per copy |
|---|---|---|---|---|---|
| 200 | Black | $9.99 | 60% | $3.40 | **$2.59** |
| 200 | Black | $14.99 | 60% | $3.40 | **$5.59** |
| 300 | Black | $9.99 | 60% | $4.60 | **$1.39** |
| 300 | Black | $9.98 | 50% | $4.60 | **$0.39** ← $1 worse for 1¢ cheaper |
| 300 | Black | $14.99 | 60% | $4.60 | **$4.39** |
| 300 | Black | $19.99 | 60% | $4.60 | **$7.39** |
| 400 | Black | $14.99 | 60% | $5.80 | **$3.19** |
| 300 | Color (standard) | $19.99 | 60% | `$0.85 + (300 × $0.045) = $14.35` | **−$2.36** ← below minimum, must raise price |

The color example shows why color books need careful pricing — printing costs eat the royalty fast. **Always run KDP's Printing Cost & Royalty Calculator before publishing.** It tells you the minimum viable list price.

### Expanded Distribution (paperback only)

- Pays **40%** of the effective distribution-channel list price minus printing costs (and minus taxes/withholding).
- Takes up to 8 weeks to show up through distributors.
- Use only when you've already optimised Amazon.com and want library/bookstore exposure. For most first-time publishers, skip it initially.

---

## Hardcover

Same 50% / 60% threshold as paperback. Higher printing cost.

### Printing cost (Amazon.com, hardcover)

| Trim | Ink type | Fixed cost | Per-page cost |
|---|---|---|---|
| Common hardcover trims | Black ink | $5.65 | $0.012 |
| Common hardcover trims | Color | $5.65 | $0.045 |

Example: 300pp hardcover, black ink → `$5.65 + (300 × $0.012) = $9.25`.

### Hardcover scenarios

| Page count | List price | Rate | Printing cost | Royalty per copy |
|---|---|---|---|---|
| 300 | $19.99 | 60% | $9.25 | **$2.74** |
| 300 | $24.99 | 60% | $9.25 | **$5.74** |
| 300 | $29.99 | 60% | $9.25 | **$8.74** |
| 400 | $24.99 | 60% | $10.45 | **$4.54** |
| 400 | $29.99 | 60% | $10.45 | **$7.54** |

Hardcover pricing sweet spot is typically **$24.99–$29.99** for trade nonfiction, **$22.99–$26.99** for fiction.

---

## KDP Printing Cost & Royalty Calculator

KDP provides an official calculator that takes your trim size, ink type, page count, and list price and returns:

- Printing cost per copy
- Royalty per copy
- Minimum viable list price for the format
- Cross-marketplace royalty estimates

**Use it before locking any print price.** Guessing here costs real money — pricing $0.01 below the 60% threshold cuts your royalty by ~$1/copy.

---

## KDP Select (Kindle exclusive)

Enrolling in KDP Select makes your Kindle book exclusive to Amazon (90-day blocks). In exchange:

- Book is in **Kindle Unlimited** — you earn from page reads (KENP).
- **KENP rate**: typically ~$0.004 per page read, varies monthly with the KDP Select Global Fund.
- Access to **Free Book Promotions** (5 days per 90-day enrollment) or **Countdown Deals**.
- 70% royalty in BR/JP/MX/IN markets becomes available.

Decision heuristic:

- **Enroll if**: most of your readers are on Kindle, you don't have a meaningful following outside Amazon, you want KU income, or you're launching a new series.
- **Skip if**: you have an audience that buys EPUB elsewhere, you're already on other ebook stores, your book is a long evergreen reference (low page-read ratio).

Print books are not affected by KDP Select. Only Kindle is exclusive.

---

## Currency and territories

KDP publishes in multiple marketplaces (US, UK, DE, FR, ES, IT, NL, JP, BR, CA, MX, AU, IN). For each:

- You set the list price in the local currency or let KDP auto-convert from your primary marketplace price.
- The 70% Kindle range and the 50%/60% paperback threshold are **per-marketplace**, not global.
- Tax and withholding rules differ. The royalty figure shown in KDP Reports is post-tax estimate; actual payout is after final withholding.

Default for first launch: optimise Amazon.com first. Set other marketplaces to auto-convert from USD. Tune them only after the US page is converting.
