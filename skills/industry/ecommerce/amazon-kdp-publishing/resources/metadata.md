# KDP metadata — title, subtitle, description, keywords, categories, ISBN

The fields are short but the rules are strict. Most quiet failures are metadata failures.

---

## Title

- **Must match the cover exactly.** Same wording, same capitalisation, same word order.
- Forbidden: promotional claims (*free*, *bestselling*, *new release*), rank claims (*#1 in*), other authors' or titles' names, trademarks you don't own, HTML, junk formatting (...!!!), pricing.
- **Title + subtitle combined max: 200 characters.**
- Lead with the main promise or hook. Don't stuff keywords — KDP's algorithm reads them from the keywords field, and stuffing makes the title fail human reading.

## Subtitle

- Optional.
- Same rules as title.
- Use to **sharpen audience, outcome, or subgenre**.

Pattern templates:

| Genre | Title : Subtitle template |
|---|---|
| Nonfiction (how-to) | *[Outcome] [Method]* : *A [Style] Guide to [Specific Audience/Outcome]* |
| Nonfiction (idea) | *[Provocative Idea]* : *Why [Old Belief] Is Wrong and What to Do About It* |
| Cosy mystery | *[Place + Mood + Noun]* : *A [Place] Mystery About [Specific Hook]* |
| Thriller | *[Punchy Title]* : *A [Sleuth Type] Thriller* |
| Literary fiction | *[Evocative Phrase]* : *A Novel* (subtitle often just *A Novel*) |
| Romance | *[Hook]* : *A [Subgenre/Trope] Romance* |
| Memoir | *[Concrete Image]* : *A Memoir of [Specific Experience]* |

---

## Description

- **Max 4,000 characters** (HTML tags count toward the limit).
- **Allowed HTML**: `<b>`, `<i>`, `<u>`, `<br>`, `<p>`, `<h4>`, `<h5>`, `<h6>`, `<ul>`, `<ol>`, `<li>`.
- **Forbidden content**:
  - URLs (your website, social, anything)
  - Reviews / testimonials / blurbs
  - Requests for reviews
  - Promotional language ("limited time", "free for a week")
  - Time-sensitive information ("just released", "new for 2026")
  - Keyword-stuffing phrases
  - Mentions of Amazon programs ("on Kindle Unlimited!")
  - References to other authors, books, or trademarks you don't own

### Description scaffold that works

```html
<b>One-line hook in bold.</b><br><br>
A short paragraph (2–4 lines) that names the situation, the promise, or the question. Make the reader want the answer.<br><br>
<h5>Inside this book:</h5>
<ul>
  <li>Bullet 1 — concrete benefit, not abstract emotion</li>
  <li>Bullet 2 — concrete benefit</li>
  <li>Bullet 3 — concrete benefit</li>
  <li>Bullet 4 — concrete benefit (optional)</li>
</ul>
<p>A one-line close. No CTA. No "buy now". Let the buy button do its job.</p>
```

### Fiction description scaffold

```html
<b>The hook in one sentence.</b><br><br>
A short paragraph that sets up the protagonist and the situation. Don't summarise the plot — set up the question that makes someone click "Look Inside".<br><br>
A second short paragraph that raises the stakes. End on the central question or threat.<br><br>
<i>Perfect for readers of [subgenre] mysteries / thrillers / romance who want [specific reader-need].</i>
```

The italic "perfect for readers of X" line is the only place you can name comp authors safely — by genre, not by name (`readers of small-town mysteries`, not `readers of Louise Penny`).

---

## Keywords

- **Up to 7 phrases** in the keywords field.
- **Don't repeat** what's already in: title, subtitle, contributor names, categories.
- **Avoid:**
  - Subjective claims (*best novel ever*, *amazing*)
  - Time-sensitive (*new*, *2026*)
  - Unowned brand names
  - Amazon program names (*Kindle Unlimited*, *KDP Select*, *Prime Reading*)
  - Other authors' or titles' names
  - HTML or punctuation tricks

### Keyword strategy by genre

**Nonfiction** — think in *reader-language phrases that name a goal or problem*:

```
how to manage your time as a founder
weekly planning system for entrepreneurs
deep work for busy professionals
finish what you start productivity
practical guide for solo founders
time blocking for creative work
focus systems without burnout
```

**Fiction** — think in *trope + setting + emotional payoff*:

```
small town cosy mystery
female amateur sleuth
coastal village mystery
slow burn investigation
family secrets thriller
atmospheric island setting
missing person fiction
```

Test: would a reader type this into Amazon search? If no, replace it.

---

## Categories

- **Up to 3 Amazon categories.**
- Categories differ by marketplace and format. Changes can take up to 72 hours to apply.
- The path matters — `Fiction > Mystery, Thriller & Suspense > Amateur Sleuths` ranks the book differently than `Fiction > Literary Fiction`.

### Category selection pattern

Pick **one broad, one mid, one specific**:

| Slot | Why | Example (cosy mystery) |
|---|---|---|
| Broad | Cast a wide net for genre browsers | Fiction > Literary Fiction |
| Mid | Anchor the book in a recognisable subgenre | Fiction > Mystery, Thriller & Suspense > Women Sleuths |
| Specific | Niche where you can realistically chart | Fiction > Mystery, Thriller & Suspense > Amateur Sleuths |

The specific shelf is where most "bestseller" status is won early. Pick a shelf that's active but not dominated by mega-titles.

---

## ISBN and imprint

- **Each print format needs its own ISBN.** Paperback and hardcover are separate ISBNs.
- **Kindle eBooks and low-content books**: ISBN is optional.

Two ISBN paths:

| Path | Imprint | Reusable elsewhere? | Cost |
|---|---|---|---|
| Free KDP ISBN | Shows as *Independently published* | No — locked to KDP | Free |
| Own ISBN (Bowker US, Nielsen UK) | Your registered imprint | Yes — any platform | ~$125 / 10 for $295 (Bowker) |

If you intend to publish only on KDP, free is fine. If you want a polished imprint name on the listing, or plan to use IngramSpark / Draft2Digital / Smashwords too, buy your own.

KDP verifies that book details and imprint match the ISBN agency's record exactly — including capitalisation and stray spaces. Imprint field max: **100 characters**.

---

## BISAC vs Amazon categories

KDP's current category system is Amazon-specific. BISAC is the broader trade publishing system (used by libraries, distributors, bookstores).

- **If you publish only on KDP**: Amazon categories are your shelf system. BISAC isn't required.
- **If you publish on KDP + other platforms** (IngramSpark, D2D, direct): maintain BISAC subject codes separately using the [BISG official BISAC list](https://bisg.org/page/BISACEdition).

Don't try to map BISAC 1-to-1 onto Amazon categories — the trees are different.

---

## Cross-format linking

For the ebook / paperback / hardcover to share **one Amazon detail page**, the title, subtitle, series, and author name must match across all three. Different capitalisation or a stray punctuation difference will split them into separate product pages, fragmenting reviews and search rank.

Set it once. Copy-paste the exact strings across formats.
