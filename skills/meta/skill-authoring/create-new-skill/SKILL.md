---
name: Create a New Skill
description: Use when the user asks to author, draft, scaffold, or create a new Agent Skill or SKILL.md file. Produces a spec-compliant skill folder ready to submit or use locally with Claude.

dependencies: []

category: meta
subcategory: skill-authoring
tags: [skill-authoring, meta, agent-skills, template, scaffolding]
author:
  name: Nima Aksoy
  url: https://nimaaksoy.com
  github: nimaaksoy
license: CC-BY-4.0
version: 0.1.0
created: 2026-05-14
updated: 2026-05-14
---

# Create a New Skill

## Overview

A skill that helps you write a new skill. Given a topic, behaviour, or workflow the user wants to encode, produce a complete `SKILL.md` plus folder structure that follows Anthropic's Agent Skills spec exactly — and, when the target is `skills.nimaaksoy.com`, also satisfies that directory's extra metadata and validation rules.

The output is a working folder a contributor can drop into `skills/<category>/<subcategory>/<slug>/`, run `npm run validate` against, and submit as a PR.

## When to use this skill

- The user says "create a skill for X", "write a SKILL.md", "draft an agent skill", "scaffold a new skill", or similar.
- The user describes a workflow, repeated prompt pattern, or behaviour they want Claude to apply automatically and asks you to turn it into a skill.
- The user is contributing to `skills.nimaaksoy.com` and wants help authoring a submission.
- The user wants to extract a reusable skill from a long-running conversation pattern.

Do **not** use this skill when:

- The user only wants a one-off prompt or a single response — not a reusable skill.
- The user is editing an existing skill (use targeted edits instead of regenerating from scratch).
- The user is asking conceptual questions about how skills work — answer directly without authoring a new one.

## Instructions

Work in this order. Don't skip steps — they're sequenced so the description (the part that controls whether the skill ever loads) gets written before anything else is committed.

### 1. Pin down the trigger

Before writing anything, get clear on **the single condition that should make a model load this skill**. Ask the user, in plain language:

> "When should this skill activate? Describe the user's request or the situation that signals it's needed — not what the skill does, but what the user is asking for when it should fire."

If the user can't articulate a trigger in one sentence, the skill is probably too broad or not actually skill-shaped. Push back and offer to narrow it.

### 2. Draft the `description`

This is the single most important field. The model uses it to decide whether to load the skill at all.

Rules:

- **≤ 200 characters.** Hard limit — the validator rejects anything longer.
- **Lead with "Use when …"** or another explicit trigger phrase. A description that reads like a brochure won't trigger reliably.
- **Be specific about the situation.** "Use when the user asks for X" beats "helps with X".
- **Mention the artefact produced** if it's distinctive ("produces a 4-line cover letter", "outputs SQL for ClickHouse").
- **No marketing language** ("powerful", "comprehensive", "the best way to …"). The model doesn't grade on enthusiasm.

See `resources/description-examples.md` for good and bad examples.

### 3. Pick the name

- ≤ 64 characters. Title Case. Short noun phrase.
- The folder slug is derived from this: lowercase, kebab-case, no stop words. ("Cold Email Outreach" → `cold-email-outreach`.)

### 4. Choose category and subcategory

For submissions to `skills.nimaaksoy.com`, the category and subcategory must match `categories.yml` exactly. See `resources/categories.md` for the current tree.

A skill belongs to **exactly one** category + subcategory. If two feel equally right, pick the one closer to where a user would look for it, and add the other angle as a tag.

### 5. Write the frontmatter

Start from `resources/template.md`. Fill in:

```yaml
---
name: <Skill Name>
description: <single-line trigger description, ≤ 200 chars>
dependencies: []                  # only if real (e.g. ["python>=3.10"])

# Directory-only fields — ignored by Claude, used by the site
category: <category-id>           # must exist in categories.yml
subcategory: <subcategory-id>     # must exist under that category
tags: [<1-8 kebab-case>]
author:
  name: <Author Name>
  url: <optional>
  github: <optional>
license: CC-BY-4.0                # default; only change if needed
version: 0.1.0
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
---
```

If you don't know the author, ask. Don't guess — the field is required.

### 6. Write the body

Use these headings, in this order. The validator requires at least one `## ` heading; convention requires the full set:

- `## Overview` — one paragraph: what this skill does and the situation it's built for. Written so a contributor browsing the directory understands the point in under 10 seconds.
- `## When to use this skill` — a bullet list of trigger conditions, and (recommended) a "Do not use" sub-list.
- `## Instructions` — step-by-step guidance for the model. Be concrete. Reference any files under `resources/` by relative path.
- `## Examples` — at least one worked example, ideally two. Use the `### Example 1 — label` pattern. For each: an **Input** block (what the user says) and an **Expected behaviour** block (what the model should do).
- `## Resources` — describe each file under `resources/`.
- `## Notes & limitations` — what the skill can't do, common pitfalls, things to push back on.
- `## Changelog` — append-only version log.

### 7. Add resources only if they earn it

Don't pad the folder. A resource file is worth keeping only if:

- It's structured data the model needs verbatim (templates, examples, lookup tables, schema).
- It's long enough that inlining it in `Instructions` would crowd the body.
- It changes independently of the instructions (e.g. a list of supported file types).

If a "resource" is just a paragraph of text, fold it into `Instructions`.

### 8. Validate against the directory's rules

Before declaring the skill done, walk the checklist in `resources/checklist.md`. The site validator enforces these on every PR:

- Frontmatter parses as YAML.
- `name` ≤ 64 chars; `description` ≤ 200 chars.
- `category` and `subcategory` exist in `categories.yml`.
- `tags` is 1–8 kebab-case strings.
- `author.name` present.
- Folder path = `skills/<category>/<subcategory>/<slug>/`, slug kebab-case.
- Body has at least one `## ` heading.
- No file > 5 MB, no nested `SKILL.md`.

### 9. Hand back a complete folder

The deliverable is a folder, not just a `SKILL.md`. Produce:

```
<slug>/
  SKILL.md
  README.md          # optional but recommended for non-trivial skills
  resources/         # only if step 7 said yes
    <file>
  LICENSE.txt        # only if not CC-BY-4.0
```

Then tell the user how to ship it:

```bash
# from the repo root
npm run validate              # confirms it passes the same checks CI will run
git add skills/<cat>/<sub>/<slug>
git commit -m "Add <name> skill"
# open a PR
```

## Examples

### Example 1 — turning a workflow into a skill

**Input:**

> "I keep writing the same kind of bug report — title, repro steps, expected, actual, environment. Can you turn that into a skill?"

**Expected behaviour:**

The model should:

1. Confirm the trigger in one sentence: "Use when the user asks for help writing a bug report or describes a defect to file."
2. Propose a name: "Structured Bug Report".
3. Pick `category: software`, `subcategory: qa-testing` (or `code-review` if more fitting — confirm with user).
4. Draft a description ≤ 200 chars: *"Use when the user describes a software defect or asks to write a bug report. Produces a structured report with title, repro steps, expected vs actual, environment, and severity."*
5. Write `Instructions` that walk through the five-field structure, with a one-line rule for each.
6. Add a `resources/template.md` with the empty bug-report skeleton, since it's verbatim content the model copies.
7. Provide two `Examples`: one minimal bug, one complex bug with multiple repro steps.

### Example 2 — when to push back

**Input:**

> "Make me a skill that's good at everything coding."

**Expected behaviour:**

The model should **not** scaffold a skill. Instead it should respond:

> "Skills work best when they trigger on a specific situation. 'Everything coding' is too broad — the model wouldn't know when to load it, and once loaded it would compete with general coding behaviour Claude already does well. What's the narrowest version of this? E.g. 'review a Python diff for type-safety issues', 'turn a stack trace into a 3-line root-cause hypothesis', 'write a SQL migration with rollback'. Pick one and we'll author that."

Only proceed once the user has scoped the skill to a real trigger.

### Example 3 — directory submission

**Input:**

> "Help me submit a skill to skills.nimaaksoy.com for writing investor update emails."

**Expected behaviour:**

The model should:

1. Confirm trigger and propose name (e.g. "Investor Update Email").
2. Look up the category — `business / sales`? `business / finance`? Likely `business / finance` since investor updates are a finance-team workflow; ask the user if unsure.
3. Produce the folder at `skills/business/finance/investor-update-email/`.
4. Write the frontmatter, body, and at least one example.
5. Tell the user to run `npm run validate`, then open a PR using the template in `.github/PULL_REQUEST_TEMPLATE.md`.

## Resources

- `resources/template.md` — the canonical empty `SKILL.md` template. Copy verbatim, then fill in.
- `resources/description-examples.md` — good vs bad `description` field examples, with reasons.
- `resources/checklist.md` — the validator's full rule list as a checkbox list. Walk it before declaring done.
- `resources/categories.md` — flat reference of all category + subcategory ids from `categories.yml`.

## Notes & limitations

- **The model decides when to load a skill based on the `description` alone.** If the skill never triggers in practice, the description is the first thing to revise — body changes won't help.
- **One trigger per skill.** If a skill covers two distinct triggers, split it into two skills. A single skill with "use when X *or* Y" tends to fire weakly on both.
- **Resources aren't a knowledge dump.** Anything the model needs every time should be in `Instructions`. `resources/` is for templates, examples, and reference data the model loads on demand.
- **Categories are project-specific.** This skill's category map matches `skills.nimaaksoy.com`. If you're authoring for a different directory or for personal use, ignore the directory-only frontmatter fields — Claude does.
- **Don't author a skill for something Claude already does well.** "Summarize this article" doesn't need a skill. Author a skill when the model's default behaviour is wrong, generic, or inconsistent for your specific situation.

## Changelog

- `0.1.0` — initial version.
