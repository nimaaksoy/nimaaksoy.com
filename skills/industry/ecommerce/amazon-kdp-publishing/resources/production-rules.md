# KDP production rules — file generation and final preflight

The technical rules that catch the failures most likely to break a print upload or produce a low-quality print copy. These are `[Rule]` — apply every time, no exceptions.

For each rule, the failure it prevents is named explicitly so you understand the cost of skipping it.

---

## Rule 1 — Interior PDF font embedding `[Rule]`

**Print interiors must have fonts embedded before upload.** Do not rely on PDF base fonts such as Helvetica, Times-Roman, Courier, or any Type1 fonts. KDP's print pipeline does not guarantee correct rendering of unembedded base fonts; the safe path is to embed every font your interior references.

### If generating PDFs with ReportLab

ReportLab silently leaves a default Helvetica resource in the PDF unless you override the base font. Even if every ParagraphStyle uses your embedded font, the default base font reference persists.

Required steps:

```python
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.rl_config import canvas_basefontname  # or rl_config

# 1. Register real TTF/OTF fonts.
pdfmetrics.registerFont(TTFont("BookBody", "fonts/EBGaramond-Regular.ttf"))
pdfmetrics.registerFont(TTFont("BookBody-Bold", "fonts/EBGaramond-Bold.ttf"))
pdfmetrics.registerFont(TTFont("BookHeading", "fonts/Inter-SemiBold.ttf"))

# 2. Override the canvas default base font BEFORE building the PDF.
import reportlab.rl_config
reportlab.rl_config.canvas_basefontname = "BookBody"

# 3. Use registered font names in every ParagraphStyle.
from reportlab.lib.styles import ParagraphStyle
body_style = ParagraphStyle(
    name="Body", fontName="BookBody", fontSize=11, leading=14
)
heading_style = ParagraphStyle(
    name="H1", fontName="BookHeading", fontSize=18, leading=22
)
```

### Verification after generation

After producing the PDF, inspect for base-font references and embedded font descriptors:

```bash
# Should produce NO output:
grep -a "/Helvetica\|/Times-Roman\|/Courier\|/Type1" interior.pdf

# Should produce at least one match per font (FontFile2 = TrueType embedded):
grep -a "/FontFile2\|/FontFile3" interior.pdf
```

**Reject the file if the first grep produces any output.** Re-generate with the base font override applied.

### Other PDF generators

- **InDesign**: PDF preset *PDF/X-1a:2001* embeds all fonts. Verify with the same grep.
- **Affinity Publisher**: PDF Export → tick "Embed all fonts" explicitly.
- **LibreOffice**: File → Export as PDF → check "PDF/A-1a" or "PDF/A-2b" for guaranteed embedding.
- **Microsoft Word**: File → Save As → PDF → Options → tick "ISO 19005-1 compliant (PDF/A)".
- **TeX/LaTeX**: pdflatex with proper font packages embeds by default; verify anyway.

The failure mode is the same regardless of generator: a font referenced but not embedded means the print shop substitutes, and the substitution often shifts line breaks, page counts, and visual hierarchy.

---

## Rule 2 — KDP print cover template `[Rule]`

**Always build paperback and hardcover covers from the exact KDP template** for the final trim size, page count, paper type, ink type, and language. Templates are not interchangeable.

### Procedure

1. **Finish the interior PDF first.** You need the final page count to download the right template — page count drives spine width.
2. **Download the KDP template ZIP** for the exact format: paperback or hardcover; the trim size (e.g. 6 × 9); paper type (white / cream / colour); ink type (black / standard colour / premium colour); language.
3. **Use the PNG/PDF template dimensions as the artwork canvas.** Don't recreate the dimensions from a spreadsheet — use the template file.
4. **Export one flattened full-wrap PDF.** Back cover + spine + front cover, all in one file.
5. **Do not include the visible template guide layer** (the pink/grey/blue safety zones) in the final upload. Hide or delete the guide layer before export.
6. **Keep a preview JPG separately** for human review, but only upload the print-cover PDF to KDP.

### Why this is non-negotiable

Spine width changes with every page added or removed. A template downloaded at 200 pages will be wrong for a 220-page final book. Using a template from a different paper type (cream is thicker than white) produces a spine mis-fit you'll only notice in the physical proof.

### Common mistakes

| Mistake | Result |
|---|---|
| Downloaded template before finalising interior page count | Spine width wrong; back cover artwork shifts onto spine |
| Used cream-paper template for a white-paper book | Spine slightly off; visible mis-alignment in physical proof |
| Forgot to hide the guide layer | KDP rejects the upload, or worse, prints the guides |
| Uploaded the PNG preview instead of the PDF | KDP rejects (PDF required for print covers) |

---

## Rule 3 — Barcode area `[Rule]`

**Do not draw your own barcode unless the user explicitly provides an ISBN barcode and wants to place it manually.**

KDP automatically places the barcode in a fixed area on the back cover. The default-safe behaviour is to let KDP place it.

### Default behaviour

- **Leave the KDP barcode area as normal cover background.** Whatever the background colour, texture, or pattern is — extend it through the barcode area.
- **Do not place important text, icons, faces, QR codes, or key design elements in that area.** Anything placed there will be covered by the barcode at print time.
- **Do not add a white placeholder box.** This is the most common mistake. A white rectangle in the barcode position looks correct in your design but produces a visibly mismatched patch when KDP overlays the barcode (especially on coloured/dark backgrounds).

### Where the barcode area is

The KDP template marks the barcode safe zone explicitly — typically a rectangle on the lower-right of the back cover. Refer to your downloaded template (Rule 2).

### When to place your own barcode

Only when:
1. The user has their own ISBN.
2. The user explicitly wants manual placement (e.g. for specific design reasons).
3. The barcode image is provided at 300 DPI, sized to KDP's required dimensions (typically 2" × 1.2"), with the correct quiet zones.

In all other cases, leave the area clean and let KDP handle it.

---

## Rule 4 — Paperback spine text `[Rule]`

**Do not add spine text unless the book safely exceeds KDP's spine-text threshold and the spine is visually wide enough.**

KDP's hard rule: no spine text on books under 79 pages. But the *practical* threshold is higher — spines in the 80–130 page range are physically very narrow, and thin spine text:

- is hard to align without visible drift
- can trigger KDP visual-quality rejections
- looks amateur in a physical copy even when it technically passes

### Default behaviour

- **For short books around the minimum threshold (under ~150 pages), omit paperback spine text** even if technically allowed.
- For books 150+ pages, spine text is fine if designed carefully.
- For books 300+ pages, spine text is expected.

### When you do add spine text

- Centre the text within the spine safe-zone (the KDP template marks this).
- Use a font size that leaves at least 0.0625" (1.6 mm) of clear space on either side of the text.
- Test the alignment in the physical proof — what looks fine in PDF preview often drifts slightly in print due to binding tolerance.

---

## Rule 5 — Bleed and safe-zone for cover text `[Rule]`

**Important front-cover text must stay well inside trim and bleed edges.**

KDP's minimum safe-zone (≥ 0.25" from outside trim on paperback; ≥ 0.635" on hardcover) is the *minimum*. Treat it as the floor, not the target.

### Default behaviour

- **Keep title and subtitle at least 0.25"** from trim on paperback. **Use more margin for large display type** — a 72pt title needs visual breathing room well beyond the technical minimum.
- **Check the word closest to the outer edge, not just the text box.** A text box may be inside the safe-zone but the actual glyph extends past it (especially for italics, descenders like `g`/`y`, or stylised display fonts).
- **If a title feels close to the border, reduce font size first** before shifting other elements. A title with proper breathing room reads better than a title pushed to fit.
- **Test at thumbnail size.** The cover must work at 200px wide (Amazon thumbnail). Margins that look generous at full size can look cramped at thumbnail.

### Cover hierarchy reminder (commercial, not technical)

- **One focal idea**, not five.
- **Title readable at thumbnail size.**
- **One genre signal** so the shelf is clear in one second.
- **Title and author exactly match the metadata** in every format.

---

## Rule 6 — Final KDP preflight checklist `[Rule]`

Before declaring files ready to upload, every item below must be true. **Do not say "files are ready" if any item is unchecked.**

### Interior

- [ ] Interior PDF has all fonts embedded.
- [ ] `grep -a "/Helvetica\|/Times-Roman\|/Courier\|/Type1" interior.pdf` produces **no output**.
- [ ] `grep -a "/FontFile2\|/FontFile3" interior.pdf` produces **at least one match per font used**.
- [ ] Page count is final (no further content changes planned).
- [ ] Margins match the gutter-by-page-count table in `technical-specs.md`.
- [ ] If any page bleeds, the whole file is set up with bleed (0.125" beyond trim).
- [ ] All images are 300 DPI minimum at placed size.
- [ ] Body font is ≥ 7 pt.

### Paperback cover

- [ ] Built from the **exact KDP template** for the final trim, page count, paper, ink, language.
- [ ] **One flattened full-wrap PDF** (back + spine + front).
- [ ] Cover dimensions match the template exactly.
- [ ] Spine width matches the final page count (re-download template if interior changed).
- [ ] No spine text unless the book is comfortably above ~150 pages.
- [ ] Important text ≥ 0.25" from trim edge.
- [ ] Title and author **exactly match** metadata (cover ↔ KDP fields).
- [ ] Barcode area has no important content and no placeholder box — extend the background through it.
- [ ] Template guide layer is hidden / removed before export.
- [ ] All fonts embedded.
- [ ] All layers flattened, transparencies handled.
- [ ] Cover assets CMYK (not RGB), no embedded ICC profile.

### Hardcover cover (if releasing)

- [ ] Built from the hardcover-specific KDP template.
- [ ] One flattened full-wrap PDF.
- [ ] Wrap extension = 0.51" (per template).
- [ ] Important content ≥ 0.635" from edge.
- [ ] No content in the 0.4" spine hinge area.
- [ ] All other paperback-cover rules apply.

### Kindle cover (separate from print cover)

- [ ] **JPG**, not PDF.
- [ ] **RGB** colour profile.
- [ ] **2560 × 1600 px** (or larger at the same 1.6:1 aspect ratio — taller than wide).
- [ ] **Under 5 MB.**
- [ ] If the cover is mostly light: thin border added so it doesn't disappear on Amazon's white background.
- [ ] Title and author match metadata.

### Ebook file (Kindle interior)

- [ ] EPUB validates as a proper zip/package (use `epubcheck` or Kindle Previewer).
- [ ] TOC built from heading styles, not a manual TOC.
- [ ] Hyperlinked TOC works on phone, tablet, e-reader views in Kindle Previewer.
- [ ] Internal cover image embedded at the start (≥ 1200 px on a side).
- [ ] No fixed-width tables (unless intentionally fixed-layout EPUB).
- [ ] All chapter breaks render correctly.

### Preview vs upload files

- [ ] Preview JPGs are provided for **human review only**, not as print-cover uploads.
- [ ] Print covers uploaded as **PDF**, not JPG or PNG.
- [ ] Kindle marketing cover uploaded as **JPG**, not PDF.
- [ ] All filenames are clear and distinguishable (e.g. `interior.pdf`, `cover-paperback-wrap.pdf`, `cover-hardcover-wrap.pdf`, `cover-kindle.jpg`).

### Sign-off

If every box above is checked, the files are ready. If any box is unchecked, the files are not ready — fix and re-run the checklist.

When delivering to the user, list:
1. Which checks ran and passed.
2. Which checks couldn't be verified (e.g. you don't have access to run grep on the user's file).
3. Any item the user must verify themselves before uploading.

Never claim "ready to upload" without the user being able to see which checks were actually performed.
