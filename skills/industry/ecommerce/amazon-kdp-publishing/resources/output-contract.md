# KDP output contract — what an agent must produce

This file defines the **completion criteria** when an agent (or a user) runs this skill on a project. Use it to know when the work is actually done — not just when it feels done.

---

## Scope tiers

A KDP project can be small or full-launch. The contract scales with the requested scope.

### Tier 1 — "Help me with [one piece]"

User asks for one artefact (a description, a keyword set, a price decision, a cover spec).

**Required output:**

- The requested artefact, ready to copy-paste into the KDP field.
- A 1-line note about which KDP rule or default informed each choice.
- Any compliance flags (e.g. "Your title is 207 characters — KDP max is 200, here's the cut").

**Do not claim completion until:**

- The artefact passes the relevant checklist section in `resources/checklist.md`.
- Any cross-impact is flagged (e.g. "Changing the price below $9.99 drops you from 60% to 50% royalty — confirm before proceeding").

### Tier 2 — "Help me prepare the launch"

User wants the full metadata + ad + review package, manuscript and cover already exist.

**Required output:**

| Artefact | Format |
|---|---|
| Title + subtitle | Plain text, with character count |
| Description | KDP-safe HTML, with character count |
| 7 keywords | Plain list, one per line |
| 3 categories | Full path each |
| ISBN/imprint decision | Decision + reasoning |
| Kindle price | Price + royalty rate + estimated royalty per sale |
| Paperback price | Price + royalty rate + printing cost + estimated royalty per sale |
| Hardcover price (if releasing) | Same as paperback |
| KDP Select decision | Decision + reasoning |
| Ad campaign drafts | 1 SP Auto + 1 SP Manual keyword, with bid/budget defaults and 30+ keyword list |
| Review request template (back matter) | One paragraph, neutral, no incentive |
| ARC reader workflow | Recruit / send / follow-up plan |
| Launch-week checklist | What to do on days −7, 0, +7, +30 |

**Do not claim completion until:**

- All items above are produced.
- Every metadata field passes `resources/metadata.md` compliance rules.
- The pricing decision was checked against KDP's Printing Cost & Royalty Calculator (or the formulas in `resources/pricing.md` were applied with the user's actual page count).
- The 5 hard gates in `resources/checklist.md` ("do NOT publish if false") are all satisfied.

### Tier 3 — "Help me publish a book end-to-end"

User wants the full workflow from idea to published book.

**Required output (in addition to Tier 2):**

| Artefact | Format |
|---|---|
| Niche scorecard | 5 factors × 10 points = /50, with reasoning per factor |
| Competitive analysis | 10–20 books × 20-field template (`resources/market-research.md`) |
| Outline | Fiction or nonfiction template filled in |
| Editing plan | Which stages of the ladder, at what cost, with which provider type |
| Cover brief | One-page brief for designer (or self) — concept, focal image, type hierarchy, genre signals, palette |
| Manuscript format spec | DOCX / EPUB / KPF / PDF — and a Kindle Previewer validation plan |
| Print interior spec | Trim, bleed Y/N, margin table for the actual page count, font choice, image DPI |
| Print cover spec | Wrap PDF dimensions from KDP calculator, spine width formula, bleed setup |
| Proofing plan | Kindle Previewer review + physical proof order + sign-off checklist |
| Author Central content | Bio, photo spec, biblio links |
| 30-day post-launch optimisation plan | Ads tuning schedule, review-gathering plan, metric thresholds for action |

**Do not claim completion until:**

- All Tier 2 criteria are met.
- A 10-phase pre-launch checklist (`resources/checklist.md`) is provided with the project's actual status per item.
- An open-issues list is produced — every "TBD" or "user must provide" item is named.

---

## Minimum acceptable output

For any tier, the output is **not acceptable** if it:

- Includes URLs in the KDP description (KDP rejects them).
- Includes review requests in the description (KDP rejects them).
- Recommends pricing the US paperback at $9.98 (loses ~$1 per copy vs $9.99).
- Uses keywords that duplicate the title or category info (wasted keyword slots).
- Claims a 70% Kindle royalty for a price outside $2.99–$9.99 (range violation).
- Misses the cross-format title-match requirement (causes split detail pages).
- Lacks any compliance flag for a known-volatile area (royalty thresholds, ad costs, KU rate).

If any of those is in the output, the work is **not done** — revise before delivery.

---

## The "open issues" requirement

Every full-launch output must include an **Open issues** section listing:

- What the user still needs to provide (manuscript file, author photo, etc.).
- Decisions the user needs to make that the agent couldn't make alone (genre tone, comp-author choice, specific imprint name).
- Items that need re-checking before publish (live KDP pricing thresholds, current ad benchmark CPCs).
- Items that depend on data not yet available (review velocity, ad CPC for the specific niche).

The skill is helpful when it surfaces unknowns clearly. Pretending you have all the answers when you don't is how launches break.

---

## Questions to ask before starting

If the user hasn't already answered `resources/intake.md`, ask these three at minimum:

1. **What's the book type?** (Fiction / nonfiction / children / low-content / photo-heavy / other)
2. **What format scope?** (Kindle only / Kindle+paperback / +hardcover)
3. **Where are you in the process?** (Idea / drafting / done writing / done cover / ready to publish / already published)

Without these three, output is guesswork.

---

## Sign-off template

When you've finished a Tier 2 or Tier 3 output, end with:

```
KDP project status — [book title]

Scope: Tier [1/2/3]
Required artefacts: [N/N delivered]
Compliance flags raised: [count]
Open issues for user: [count, summarised]

Ready to publish? [Yes / No, with reason]
Next 3 actions for the user: [list]
```

This forces honesty about whether the work is actually done.
