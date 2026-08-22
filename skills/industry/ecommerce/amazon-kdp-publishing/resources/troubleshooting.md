# KDP troubleshooting — issue → cause → fix

Diagnosis-first reference. When something fails, find the issue, read the likely causes, apply the fix.

Tag legend (used across the skill — see SKILL.md):

- `[Rule]` — official KDP requirement; non-negotiable.
- `[Default]` — sensible starting point most users should follow.
- `[Heuristic]` — author judgment from patterns, not platform rules.
- `[Volatile]` — likely to change; verify in live KDP docs.

---

## Cover rejection

### "Cover does not meet bleed requirements"

**Likely cause:**
- Bleed missing entirely
- Bleed set on cover but not on interior (or vice versa)
- Bleed less than 0.125"

**Fix `[Rule]`:**
1. Add **0.125"** bleed beyond trim on top, bottom, and outside edges.
2. If *any* interior page bleeds, the **whole interior** must be set up with bleed. Re-export.
3. For 6 × 9 paperback with bleed, the page size becomes **6.125" × 9.25"**.
4. For the cover, use KDP's cover calculator/template; don't guess the wrap dimensions.

### "Cover spine width is incorrect"

**Likely cause:**
- Spine width didn't account for the actual page count + paper choice
- Used a paperback template for a hardcover (or vice versa)

**Fix `[Rule]`:**
1. Re-download the KDP cover template using your **final** page count + paper choice.
2. Spine width on paperback: roughly `pages × 0.002252"` for white paper, `pages × 0.0025"` for cream.
3. If the book is **under 79 pages**, do NOT put text on the spine. KDP will reject it.

### "Image resolution below 300 DPI"

**Likely cause:**
- Source images exported at 72 / 96 DPI
- Image scaled up in InDesign/Affinity without re-exporting at higher resolution

**Fix `[Rule]`:**
1. Open the source asset. Confirm it's **at least 300 DPI at the final placed size**.
2. For full-page 6 × 9 cover image: minimum **1800 × 2700 px**.
3. If the source is lower-res, you need a new asset — upscaling won't pass.

### "Fonts not embedded"

**Likely cause:**
- PDF exported without "Embed all fonts" option ticked
- Using a font with restrictive licensing that can't embed

**Fix `[Rule]`:**
1. Re-export the PDF with **all fonts embedded** (in InDesign: PDF/X-1a preset; in Affinity: "Embed all fonts" in PDF export options).
2. If a font can't be embedded, switch to a font that can (Times, Arial, Garamond, the Linux/Liberation equivalents, or any properly licensed open-source font).

### "Color profile issue"

**Likely cause:**
- ICC color profile embedded in cover assets
- Cover saved as RGB instead of CMYK

**Fix `[Rule]`:**
1. **Strip the embedded color profile.** KDP removes it anyway and the results are unpredictable when one is included.
2. Save cover assets in **CMYK**, not RGB. (Kindle marketing cover is the opposite: RGB only.)
3. Avoid spot colors.

### "Cover layers are not flattened"

**Likely cause:**
- Live transparencies, blend modes, or text layers in the PDF

**Fix `[Rule]`:**
1. **Flatten all transparencies and layers** before export.
2. Convert all text to outlines if you suspect a font issue (only after font embedding fails).
3. Re-export.

### "Text or important content too close to the trim edge"

**Likely cause:**
- Content within the safe-area margin

**Fix `[Rule]`:**
1. Paperback: keep important content **≥ 0.25" from the outside trim edge**.
2. Hardcover: keep important content **≥ 0.635" from the edge**, and avoid the **0.4" spine hinge area entirely**.

---

## Interior (manuscript) rejection

### "Margins are too narrow"

**Likely cause:**
- Margins below KDP minimum
- Gutter not scaled to page count

**Fix `[Rule]`:**
1. Confirm against the gutter-by-page-count table in `technical-specs.md`. The gutter grows: 0.375" for 24–150pp, 0.5" for 151–300, 0.625" for 301–500, 0.75" for 501–700, 0.875" for 701–828.
2. Outside / top / bottom margins: **≥ 0.25"** without bleed, **≥ 0.375"** with bleed.

### "Font size too small"

**Likely cause:**
- Body text below 7 pt (often happens in tables, footnotes, or captions)

**Fix `[Rule]`:**
1. KDP minimum body font: **7 pt**. Raise anything below.
2. Footnotes/captions can be smaller in your visual hierarchy but must still be ≥ 7 pt.

### "Image quality issues in the interior"

**Likely cause:**
- Images under 300 DPI
- Images scaled past their native resolution

**Fix `[Rule]`:**
1. Every interior image: **300 DPI minimum** at placed size.
2. For a 4 × 6 print image, that's **1200 × 1800 px**.
3. Re-export the source at higher resolution if needed.

### "Page count outside supported range"

**Likely cause:**
- Trim + paper + ink combination doesn't support the page count

**Fix `[Rule]`:**
- 6 × 9 paperback, black ink on white: **24–828 pages**.
- 6 × 9 paperback, black ink on cream: **24–776 pages**.
- 6 × 9 paperback, standard color: **72–600 pages** (most trims).
- Hardcover (common trims): **75–550 pages**.

Either change trim/paper/ink or change content length.

---

## Metadata rejection

### "Title or subtitle does not match cover"

**Likely cause:**
- Different word order, different punctuation, different capitalisation between cover and metadata

**Fix `[Rule]`:**
1. **Cover and metadata must match exactly.** Identical wording, identical capitalisation, identical punctuation.
2. If you want to change the title, update both the cover file and the metadata simultaneously.

### "Description contains forbidden content"

**Likely cause:**
- URLs (your website, social, anything)
- Reviews / testimonials / blurbs
- Requests for reviews
- Promotional language (*"free for a week"*, *"limited time"*)
- Time-sensitive info (*"new for 2026"*, *"just released"*)
- Mentions of Amazon programs (*"on Kindle Unlimited!"*)
- References to other authors / titles / trademarks you don't own

**Fix `[Rule]`:**
1. Remove all of the above. KDP rejects descriptions that contain any.
2. See `metadata.md` for the allowed HTML scaffold and the full forbidden list.

### "Keywords contain disallowed content"

**Likely cause:**
- Subjective claims (*best ever*, *amazing*)
- Time-sensitive (*new*, *2026*, *just released*)
- Amazon program names (*Kindle Unlimited*, *KDP Select*, *Prime Reading*)
- Other authors' or titles' names
- Brands you don't own

**Fix `[Rule]`:**
1. Replace with reader-language phrases describing topic / setting / trope / audience / problem.
2. See `metadata.md` for the keyword strategy table per genre.

### "Title or subtitle over 200 characters"

**Likely cause:**
- Subtitle has been keyword-stuffed

**Fix `[Rule]`:**
1. **Title + subtitle combined max: 200 characters.**
2. Cut the subtitle to a single audience + benefit + specificity statement.

---

## Detail page issues

### "Ebook and paperback show up as separate detail pages"

**Likely cause:**
- Title, subtitle, series, or author name differ between formats (often a single character, capitalisation, or punctuation difference)

**Fix `[Rule]`:**
1. Make the title, subtitle, series, and author name **identical** across all formats.
2. Open a support case to merge them after fixing.

### "Reviews are split between editions"

**Likely cause:**
- Same as above — detail pages were never linked

**Fix `[Rule]`:**
1. Fix the metadata match first.
2. Then contact KDP support to merge. Amazon usually consolidates reviews once metadata matches.

### "Sales rank doesn't update / book not appearing in category"

**Likely cause:**
- Category change just made (up to 72 hours delay)
- Category chosen doesn't actually exist in that marketplace
- Wrong format in that marketplace

**Fix `[Volatile]`:**
1. Wait up to **72 hours** after a category change for indexing.
2. Confirm the category path exists in your specific marketplace + format.

---

## Kindle / ebook issues

### "TOC isn't working in Kindle Previewer"

**Likely cause:**
- TOC not built from heading styles
- Heading styles not applied consistently
- Manual table of contents instead of styled

**Fix `[Rule]`:**
1. **Apply Word Heading 1 style** (or equivalent in your tool) to every chapter title.
2. **Don't insert a manual TOC.** KDP and Kindle build the TOC from heading styles automatically.
3. Re-export EPUB / DOCX and re-validate in Kindle Previewer.

### "Cover doesn't show up inside the Kindle book"

**Likely cause:**
- Internal cover image not embedded in the manuscript file
- Internal cover image is the marketing cover (too small)

**Fix `[Rule]`:**
1. Embed an **internal cover image** at the start of the manuscript file (in addition to uploading the marketing cover separately).
2. Internal cover: **≥ 1200 px** on a side.

### "Images render with white background when they should be transparent"

**Cause:**
- Kindle reflowable images **always render transparency as white**.

**Fix `[Rule]`:**
- Design the image with a white background from the start. Transparent PNGs will lose transparency on Kindle.

### "Text reflows oddly on phone view"

**Likely cause:**
- Hard line breaks in the manuscript (instead of paragraph styles)
- Fixed-width tables
- Manual page breaks in the middle of content

**Fix `[Heuristic]`:**
1. Replace hard line breaks with paragraph breaks.
2. Convert wide tables to either a simple list or an image.
3. Remove manual page breaks except between chapters.

---

## Pricing / royalty issues

### "Royalty shown is much lower than expected"

**Likely causes:**
- Paperback priced at **$9.98** instead of $9.99 (drops 60% → 50% on Amazon.com) `[Rule]`
- Ebook delivery cost eating into the 70% calculation `[Rule]`
- Public-domain content blocked from 70% eligibility `[Rule]`
- Wrong marketplace selected (royalty thresholds differ per marketplace) `[Volatile]`

**Fix:**
1. Re-check the price against the 50%/60% threshold for that marketplace.
2. For Kindle 70%: royalty = `0.70 × (list price − VAT − delivery cost)`. Delivery cost = $0.15/MB on Amazon.com.
3. Use KDP's Printing Cost & Royalty Calculator — it shows the actual numbers.

### "70% Kindle option isn't available"

**Likely causes:**
- Price outside $2.99–$9.99 range (Amazon.com) `[Rule]`
- Public-domain book without substantial original contribution `[Rule]`
- In Brazil/Japan/Mexico/India: not enrolled in KDP Select `[Rule]`

**Fix:**
1. Bring the price into the eligible range.
2. If public-domain: add commentary, translation, annotation, or adaptation that makes the book not primarily public-domain.
3. For BR/JP/MX/IN: enroll in KDP Select.

---

## Launch / ads issues

### "Sponsored Products ads getting zero impressions"

**Likely causes `[Heuristic]`:**
- Bids too low (typical: $0.30–$0.50 floor)
- Targeting too narrow
- Budget exhausted in the first hour daily

**Fix `[Heuristic]`:**
1. Raise default bid to $0.50.
2. Add automatic targeting alongside manual.
3. Spread budget across the day or raise it.

### "High CTR, low conversion"

**Likely cause `[Heuristic]`:**
- Cover earns clicks but the description / price / Look Inside doesn't convert

**Fix `[Heuristic]`:**
1. Read your description aloud — does it earn the click's intent?
2. Check Look Inside on mobile — does the first page hook?
3. Reconsider price relative to comp books.

### "ACOS keeps climbing"

**Likely cause `[Heuristic]`:**
- Wasted spend on non-converting keywords/products
- Bidding on too-broad terms

**Fix `[Heuristic]`:**
1. Review Search Term report. Move winners (clicks > 10, orders > 1) to manual exact match.
2. Add losers (clicks > 10, orders = 0) as negative keywords.
3. Tighten match types: switch broad to phrase, phrase to exact for high-spend terms.

---

## Reviews

### "Lost my reviews after a metadata update"

**Likely cause `[Rule]`:**
- KDP merged or split detail pages because a metadata field changed
- An ASIN was retired due to a new edition

**Fix:**
1. Confirm via KDP support whether the detail page was split.
2. Reviews can sometimes be re-merged when metadata is corrected.
3. **Don't bulk-edit metadata after launch.** Change one thing at a time and watch for effects.

### "Reviews aren't appearing on the product page"

**Likely causes:**
- Amazon's moderation queue (1–7 days normal) `[Volatile]`
- Reviewer's account doesn't meet Amazon's threshold to post reviews (e.g. minimum spend)
- Review violated policy and was removed

**Fix `[Heuristic]`:**
1. Wait 7 days.
2. If still missing, the reviewer may need to confirm their Amazon account or buy something to reach review eligibility.
3. Don't ask them to repost — that risks a "review manipulation" flag.

### "Account warning about review manipulation"

**Likely cause `[Rule]`:**
- Reviews from family/friends/employees, incentivised reviews, or paid review services

**Fix:**
- Do not post additional reviews of your own book via any account you control.
- Do not ask family/friends to review.
- Read Amazon's review policy carefully. Repeat violations can result in losing all reviews or losing your KDP account entirely.

---

## When to ask KDP support

Most of the above can be self-fixed. Escalate to KDP support when:

- A rejection persists after you've followed the standard fix.
- A detail page split won't merge after metadata correction.
- A book has been removed without clear cause.
- You see royalty discrepancies that don't reconcile against the formula.
- A category appears but your book never indexes into it after 72 hours.

When you contact support:

- Quote the exact rejection email language.
- Attach screenshots.
- Reference the specific KDP help page you've already checked.
- Be brief. Long emails get slower replies.
