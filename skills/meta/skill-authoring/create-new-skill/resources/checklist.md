# Skill validation checklist

Walk this list before declaring a skill done. It mirrors what `npm run validate` enforces on every PR to `skills.nimaaksoy.com`.

## Frontmatter

- [ ] Parses as valid YAML.
- [ ] `name` present, ≤ 64 characters.
- [ ] `description` present, ≤ 200 characters, leads with an explicit trigger.
- [ ] `category` is one of the ids in `categories.yml`.
- [ ] `subcategory` exists under that category in `categories.yml`.
- [ ] `tags` is an array of 1 to 8 strings, each kebab-case.
- [ ] `author.name` present.
- [ ] `dependencies`, if present, is an array of strings.
- [ ] `license` is `CC-BY-4.0` or accompanied by a `LICENSE.txt` declaring the alternative.
- [ ] `version` is semver.
- [ ] `created` / `updated` are ISO dates.

## Folder layout

- [ ] Folder path is exactly `skills/<category>/<subcategory>/<slug>/`.
- [ ] Slug is kebab-case (lowercase, hyphens, no underscores or spaces).
- [ ] No nested `SKILL.md` (one per folder).
- [ ] No file in the folder larger than 5 MB.
- [ ] No secrets, API keys, credentials, or PII anywhere in the folder.

## Body

- [ ] At least one `## ` heading.
- [ ] `## Overview` present and ≤ ~5 lines.
- [ ] `## When to use this skill` present with a bullet list. (Bonus: a "Do not use" sub-list.)
- [ ] `## Instructions` present with concrete steps.
- [ ] `## Examples` present with at least one worked example. (Two is better.)
- [ ] Every file referenced under `## Resources` actually exists in `resources/`.

## Submission

- [ ] `npm run validate` passes locally.
- [ ] PR checklist filled in honestly.
- [ ] Tested with Claude at least once. Notes in the PR description.

If any box is unchecked, fix it before opening the PR. CI will catch the structural ones; the others are on you.
