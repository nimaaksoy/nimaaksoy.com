# Skill Template

Copy this folder to `skills/<category>/<subcategory>/<your-slug>/` and edit. The easiest way:

```bash
npm run new-skill
```

That CLI prompts for name, category, subcategory, and author, then scaffolds a folder with the frontmatter pre-filled.

## Frontmatter, field by field

```yaml
---
name: Skill Name Here          # ≤ 64 chars; what humans (and the model) see
description: One sentence...   # ≤ 200 chars; THIS is what the model uses to decide
                               #   whether to invoke the skill — make it a trigger,
                               #   not a brochure.
dependencies: []               # optional, e.g. ["python>=3.10", "pandas>=2.0"]

# ↓↓↓ Directory-only fields. Claude ignores these. The site uses them.

category: business             # must match an `id` in /categories.yml
subcategory: sales             # must match a subcategory `id` under that category
tags: [outreach, b2b]          # 1–8 kebab-case strings
author:
  name: Your Name              # required
  url: https://yourlink.com    # optional
  github: yourhandle           # optional
license: CC-BY-4.0             # default; only set if your skill needs different
version: 0.1.0                 # semver
created: 2026-05-14            # ISO date
updated: 2026-05-14            # ISO date
---
```

## Body structure

These headings aren't strictly required by the spec, but the directory looks for them and contributors expect them:

- `## Overview` — what this is and the situation it's for.
- `## When to use this skill` — bullet list of trigger conditions.
- `## Instructions` — step-by-step guidance for the model.
- `## Examples` — at least one worked example, ideally two.
- `## Resources` — describe any files under `resources/`.
- `## Notes & limitations` — what the skill can't do, common pitfalls.
- `## Changelog` — append-only.

## Folder layout

```
your-skill/
  SKILL.md         # required
  README.md        # optional, human-readable doc
  LICENSE.txt      # optional, defaults to CC BY 4.0
  resources/       # optional supporting files
  scripts/         # optional helper scripts
  templates/       # optional templates
```

## References

- Anthropic — [How to create custom skills](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- Anthropic — [`algorithmic-art` reference skill](https://github.com/anthropics/skills/tree/main/skills/algorithmic-art)
