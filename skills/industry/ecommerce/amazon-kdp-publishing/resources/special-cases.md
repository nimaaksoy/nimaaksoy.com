# KDP special cases — when the standard workflow doesn't apply

The main SKILL.md and resources assume a standard trade book — a novel or a 200–300-page nonfiction title. For these formats, the standard workflow doesn't fit and the rules differ. Read the relevant section before applying the rest of the skill.

Tag legend:

- `[Rule]` — official KDP requirement.
- `[Default]` — sensible starting point.
- `[Heuristic]` — author judgment, not platform rule.
- `[Volatile]` — verify in live KDP docs before locking.

---

## 1. Children's picture books

### What's different

- **Visual-first, color-required.** Almost always full standard or premium color interior.
- **Short page count.** Typically 24–48 pages.
- **Print sizes oriented toward large or square trims** — 8 × 8, 8.5 × 8.5, 7 × 10.
- **Hardcover often expected.** Parents and gifting buyers want hardcover.

### Format defaults `[Default]`

- **Paperback + hardcover.** Skip Kindle for picture books unless you have a dedicated fixed-layout EPUB workflow.
- **Color interior**, standard or premium depending on art style.

### Specs to watch `[Rule]`

- Two-page spreads need to align across the gutter — design with the gutter in mind, not as an afterthought.
- 300 DPI for every illustration.
- CMYK for print.
- Bleed if any illustration goes to the edge — and remember, **the whole file** must be set up with bleed if any page bleeds.

### Pricing `[Heuristic]`

- Paperback: $9.99–$12.99 (note the 60% threshold at $9.99).
- Hardcover: $14.99–$19.99.
- Color printing costs are high — confirm with KDP's calculator before pricing. A 32-page picture book in standard color can have a printing cost of $4–6 alone.

### Avoid `[Heuristic]`

- Kindle picture books without dedicated fixed-layout work — they render poorly on most devices.
- Too much text per spread — picture books are typically 100–500 words total across the whole book.

---

## 2. Workbooks, journals, planners (low-content books)

### What's different

- **Mostly blank pages.** Lined journals, undated planners, prompt journals.
- **ISBN optional** for low-content books.
- **No Kindle equivalent** — these are print-only by definition.
- **Higher volume of titles per author** is normal — many low-content publishers ship 50–500 SKUs.

### Format defaults `[Default]`

- **Paperback only.**
- **Black ink on white paper** for cost efficiency.
- 6 × 9 or 8.5 × 11 trim depending on use.

### Specs to watch `[Rule]`

- Same margin / gutter rules apply.
- If using line art for templates: 300 DPI vector exports, not raster.
- Page count typically 100–200; watch the gutter table.

### Metadata strategy `[Heuristic]`

- Title is the searchable hook: *"Lined Journal for Founders — 200 Pages 6 × 9"*.
- Keywords mirror the use case: *"daily planner"*, *"undated journal"*, *"bullet journal blank"*, *"gratitude journal women"*.
- Categories: pick the most specific shelf (Office Products > Office & School Supplies > Office Notebooks & Pads, or similar — verify in your marketplace).

### Caveats `[Volatile]`

- KDP has periodically updated its low-content policies, including limits on how many similar titles one account can publish. Verify the current rules in KDP help before bulk-launching.

---

## 3. Cookbooks and photo-heavy books

### What's different

- **Premium color often required.** Standard color washes out food photography.
- **High printing cost.** Often $8–15 per copy before royalty.
- **Layout-intensive** — usually built in InDesign or Affinity, not Word.

### Format defaults `[Default]`

- **Hardcover + paperback** if budget allows; hardcover alone is fine.
- **Premium color interior** for the recipe photos.
- 7 × 10 or 8 × 10 trim.

### Pricing `[Heuristic]`

- Hardcover: $24.99–$39.99 typical.
- Paperback: $19.99–$29.99 typical.
- Run KDP's calculator first — premium color + 200 pages of full-bleed photos can push printing cost above $15. Price accordingly.

### Layout principles `[Heuristic]`

- One recipe per spread (or one per page) for clean visual hierarchy.
- Margins generous — cookbooks lay flat better with wider gutters.
- Type hierarchy: dish name (large) → ingredients (sans serif) → method (numbered) → notes (italic).

---

## 4. Textbooks, academic, technical (image-light)

### What's different

- **Long.** Often 400–800 pages.
- **Print pricing matters less** than reference / authority value.
- **TOC, index, references** all critical.

### Format defaults `[Default]`

- **Kindle + paperback** (and hardcover if you want a premium tier).
- Black ink on white.
- 7 × 10 or 8.5 × 11 trim for technical references.

### Specs `[Rule]`

- Watch the page-count limits per trim — 6 × 9 black/white caps at 828 pages.
- Gutter at high page counts is 0.875" — design for it.

### Metadata `[Heuristic]`

- Title is the topic + audience: *"PostgreSQL for Working Engineers"*.
- Subtitle is the value: *"A Practical Reference for Production Systems"*.
- Categories: Computers & Technology > Databases & Big Data, etc.
- Keywords: technical phrases the buyer would type.

### Pricing `[Heuristic]`

- $24.99–$49.99 paperback typical for technical references.
- Kindle often $14.99–$29.99 — technical buyers often prefer Kindle for search.

---

## 5. Comics, graphic novels, manga

### What's different

- **Fixed-layout EPUB** for Kindle, not reflowable.
- **Full-page art on every page.**
- **Trim sizes are different** — 6.625 × 10.25 (comic), 5 × 7.5 (manga digest).

### Format defaults `[Default]`

- **Kindle Comic Creator (KCC) tool** for the digital edition — purpose-built for comics.
- Paperback + hardcover both fine for print.

### Specs `[Rule]`

- KDP supports fixed-layout Kindle for comics via Kindle Comic Creator (free download). Don't try to ship a normal EPUB.
- 300 DPI per page asset.
- CMYK for print.

### Caveats `[Heuristic]`

- This is its own world. The standard SKILL.md workflow only partially applies — the cover/metadata/pricing rules still hold, but the manuscript pipeline is entirely different. Treat comics as a specialised skill outside this skill's primary scope.

---

## 6. Fixed-layout EPUB (general, beyond comics)

### When to use

- Picture books for Kindle
- Cookbooks for Kindle
- Highly designed nonfiction with sidebars / pull-quotes
- Children's chapter books with illustrations on every spread

### How `[Rule]`

- Build in **Kindle Create** (Amazon's tool) — choose the **Comic** or **Print Replica** template depending on need.
- Or build a fixed-layout EPUB in InDesign / Affinity Publisher and export with the right metadata flags.
- Validate aggressively in Kindle Previewer across phone, tablet, and Kindle device views.

### Caveats `[Heuristic]`

- Fixed-layout EPUB has compatibility issues across older Kindle devices.
- File sizes balloon — and Kindle delivery cost is per MB at the 70% royalty tier. A 50 MB fixed-layout file delivered at 70% on Amazon.com costs you `0.70 × (price − 0.15 × 50) = 0.70 × (price − $7.50)` per sale. Often unviable at typical price points.

---

## 7. Multilingual, right-to-left, and non-Latin scripts

### Persian, Arabic, Hebrew, Urdu (right-to-left)

- **RTL layout requires specific manuscript prep.** Word documents with RTL paragraph direction may not export correctly to KDP without tweaking.
- **KDP supports a growing list of languages** but support for individual scripts and RTL conventions varies by format. Verify in KDP's supported-languages help page before locking the project.
- **Use a script-appropriate font** (e.g., Vazir, IRANSans for Persian; Cairo, Tajawal for Arabic). Embed it in the print PDF.
- **Cover language must match the metadata language** — don't put a Persian title on the cover with English metadata.

### CJK (Chinese, Japanese, Korean)

- KDP supports Japanese on Amazon.co.jp; Chinese and Korean support is more limited.
- Vertical text layout (Japanese, Chinese) requires specialist tools — Adobe InDesign Japanese edition or equivalent.
- Verify support in the target marketplace before producing.

### Translations

- A book translated from English to Persian (or vice versa) gets a **separate ASIN**. Don't try to upload both languages to the same listing.
- Linking translated editions to a single author page is possible via Author Central.
- The translator should be credited as a contributor in the metadata.
- Public-domain translation rights: if you translated a public-domain work, your translation may qualify for 70% Kindle royalty even though the original doesn't — but verify on a case-by-case basis.

---

## 8. Box sets and bundled editions

### What's different

- A box set is a separate ASIN that bundles multiple existing books into one purchase.
- Common in fiction series — books 1–3 of a series sold as a "trilogy edition".
- **No physical box** for KDP — these are digital and/or print compilations, not literal box sets.

### Format defaults `[Default]`

- Kindle: combine the three books' files into one EPUB with a unified TOC.
- Paperback: combine into one PDF with continuous pagination.

### Pricing `[Heuristic]`

- Discount the bundle relative to the sum of individual prices.
- Common pattern: bundle = 70–80% of the sum of individuals.
- Confirm KDP's pricing rules for bundles haven't changed since you last published.

### Caveats `[Rule]`

- Bundles are not eligible for KDP Select Free Promo if any of the individual books in the bundle have already used their promo days that quarter.

---

## 9. Republished / public-domain content

### What's different

- Books that are primarily public-domain content (Shakespeare, Dickens, etc.) face specific KDP rules.

### Rules `[Rule]`

- **Public-domain books are not eligible for 70% Kindle royalty** unless they contain **substantial original contribution** — annotation, commentary, translation, modernisation, illustration.
- Mere reformatting / reset typography is not "substantial original contribution."
- You can sell public-domain content at 35% royalty without restriction.

### Strategy `[Heuristic]`

- For straight reprints, accept 35% royalty and price competitively.
- For annotated / illustrated / translated editions, document the original contribution clearly in the metadata so the 70% eligibility holds up if reviewed.

---

## 10. New edition vs separate ASIN

### When to issue a new edition

- Major content change (added/removed chapters, rewritten significant sections).
- Title or subtitle change.
- Edition number change (e.g. *Second Edition*).
- Primary author change.
- Most physical print attributes (trim, paper, ink, page count).

### When NOT to issue a new edition

- Description tweaks (just edit metadata).
- Keyword changes (just edit metadata).
- Category changes (just edit metadata).
- Price changes (just edit pricing).
- Cover refresh (you can upload a new cover without a new edition, in most cases).

### Caveat `[Rule]`

- A new edition is a new ASIN. Reviews don't carry over automatically. Plan accordingly — only issue a new edition when the content change is material enough to justify losing the review history.

---

## 11. Audiobooks (out of scope — pointer only)

- **KDP does not handle audiobooks.** Audiobooks are produced and distributed through **ACX (Audiobook Creation Exchange)**, which is a separate Amazon platform.
- ACX supports royalty-share or pay-for-production deals with narrators.
- An audiobook can link to the same Amazon detail page as your Kindle/paperback, but the workflow is entirely separate.
- If the user wants an audiobook, redirect them to ACX. This skill doesn't cover it.

---

## When to stop and ask the user

If the book falls into any of these special cases, stop and confirm scope before applying the standard SKILL.md workflow:

- "Is this a picture book / workbook / cookbook / comic / fixed-layout / multilingual / box set?"
- "Are you republishing public-domain content?"
- "Is the print edition standard color, premium color, or B&W?"

These four answers reshape the workflow more than any other intake question.
