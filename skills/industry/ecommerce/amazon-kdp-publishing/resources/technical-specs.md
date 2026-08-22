# KDP technical specs — Kindle, paperback, hardcover

Numbers sourced May 2026 from KDP help pages. Check the live page before locking a critical decision.

---

## Quick comparison

| Topic | Kindle eBook | Paperback | Hardcover |
|---|---|---|---|
| Accepted manuscript formats | DOC/DOCX, KPF, EPUB, HTML/ZIP, RTF, TXT, PDF (limited languages) | With bleed: **PDF only**. Without bleed: PDF, DOC, DOCX, RTF, HTML, TXT | More constrained; PDF preferred |
| Cover file | Separate marketing image (RGB) + internal cover image | Single wrap PDF (back + spine + front) | Single wrap PDF (back + spine + front) |
| Common page-size logic | Reflowable, no trim | Trim-size based | Trim-size based |
| Default trim (US) | n/a | 6 × 9 inches | 6 × 9 or 6.14 × 9.21 inches |
| Custom trim range | n/a | Width 4–8.5", height 6–11.69" | Supported hardcover trims only |
| Bleed rule | n/a | If *any* page bleeds, the whole file must be set up with bleed. Add 0.125" beyond trim on top, bottom, outside | Hardcover covers use wrap (template), not paperback-style bleed |
| Min image resolution | High-res recommended; cover image must be strong | 300 DPI minimum | 300 DPI minimum |
| Color profile | **RGB / sRGB** (Kindle does NOT support CMYK) | Cover assets: **CMYK** (KDP strips embedded profiles) | Same as paperback |
| File size limits | Marketing cover: 5 MB max | Manuscript conversion: 650 MB max. Cover recommended ≤ 40 MB | Cover recommended ≤ 40 MB |
| Recommended cover size | 2560 × 1600 px JPEG, RGB, 300 DPI, ≤ 5 MB. Internal cover ≥ 1200 px on a side | Cover PDF, 300 DPI assets, ≤ 40 MB | Cover PDF, 300 DPI assets, ≤ 40 MB |
| Min font size | No single official rule; keep ebook typography simple | **7 pt minimum** | 7 pt minimum |

---

## Paperback interior margins

Margins are the #1 print-rejection cause.

| Margin | Without bleed | With bleed |
|---|---|---|
| Top | ≥ 0.25" | ≥ 0.375" |
| Bottom | ≥ 0.25" | ≥ 0.375" |
| Outside | ≥ 0.25" | ≥ 0.375" |
| Inside (gutter) | grows with page count (see below) | same |

**Gutter by page count:**

| Page count | Inside margin |
|---|---|
| 24–150 | 0.375" |
| 151–300 | 0.500" |
| 301–500 | 0.625" |
| 501–700 | 0.750" |
| 701–828 | 0.875" |

For 6×9 paperback **with bleed**, the page size becomes **6.125" × 9.25"**.

---

## Page-count ranges (common paperback trims)

At 6×9, the workable ranges:

| Paper / Ink | Min pages | Max pages |
|---|---|---|
| Black ink on white | 24 | 828 |
| Black ink on cream | 24 | 776 |
| Standard color (most trims) | 72 | 600 |

**Hardcover (much narrower):** common trims 5.5×8.5, 6×9, 6.14×9.21, 7×10, 8.25×11 — page range **75–550**.

---

## Print cover (paperback) — preflight checklist

- One full-wrap PDF (back + spine + front).
- 300 DPI assets minimum.
- All layers flattened.
- All fonts embedded.
- 0.125" bleed on the outer edges.
- Important content ≥ 0.25" from outside trim.
- Spine text only if book is ≥ 79 pages.
- No URL or pricing in cover artwork.

## Hardcover cover — preflight checklist

- Use the KDP hardcover template (download from KDP).
- Extend file 0.51" for wrap.
- Keep text and images ≥ 0.635" from the edge.
- Avoid the 0.4" spine hinge area entirely.
- If placing your own barcode: 300 DPI, 2" × 1.2".

## Kindle cover — preflight checklist

- 2560 × 1600 px JPEG, RGB, 300 DPI, ≤ 5 MB.
- If the cover is mostly light, add a thin border so it doesn't disappear on Amazon's white background.
- Title and author exactly match the metadata.
- Internal cover image ≥ 1200 px in width or height.

---

## Fonts

KDP's paperback font guidance:

- **7 pt minimum** for body text.
- Common safe choices: Times New Roman, Arial, Garamond, Palatino Linotype, Centaur, Hightower Text, Constantia, Cambria.
- **Amazon Endure** is KDP's purpose-built typeface to reduce page count and printing cost. Use it for cost-sensitive long manuscripts.
- One body font + one heading font. No display typography in body.

Embed all fonts in the print PDF. If you can't, use a font that's already embedded by your software (Arial, Times) instead.

---

## Image sizing math (300 DPI)

Plan in pixels, not inches. At 300 DPI:

| Image use | Pixels |
|---|---|
| Full-page 6×9 print image | 1800 × 2700 |
| 4×6 print image | 1200 × 1800 |
| Kindle marketing cover | 2560 × 1600 |
| Kindle internal cover | ≥ 1200 px on a side, 1600 px preferred |
| Standard Kindle illustration | ≥ 1600 px on long side |

For Kindle reflowable images: use sRGB, avoid TIFF, avoid multi-frame GIFs. Transparent backgrounds convert to white.

---

## When KDP rejects — first 5 things to check

1. **Bleed missing or wrong size.** If any page bleeds, the whole file needs bleed setup. Outer edges need 0.125" beyond trim.
2. **Spine text on <79-page book.** Move the text off the spine.
3. **Margins too tight.** Confirm against the gutter table by your exact page count.
4. **Image under 300 DPI** or unflattened layers.
5. **Embedded color profile.** Strip it — KDP removes it anyway.

If none of those, the rejection email usually names the file area precisely. Read it before re-uploading.
