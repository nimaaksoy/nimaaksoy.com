# Skills Maintenance Guide for Hermes

This site serves AI skills at `/skills`. The source of truth is Markdown under
`skills/`; generated JSON and ZIP files live under `public/skills-data/`.

## Key Paths

- `skills/<category>/<subcategory>/<slug>/SKILL.md` - primary skill file
- `skills/<category>/<subcategory>/<slug>/resources/` - optional supporting files
- `categories.yml` - allowed categories and subcategories
- `scripts/validate-skills.ts` - validates skill frontmatter and folder layout
- `scripts/build-skills-index.ts` - generates public index JSON and ZIP downloads
- `public/skills-data/skills.json` - generated skill index
- `public/skills-data/categories.json` - generated category counts
- `public/skills-data/zips/` - generated downloadable skill packages

Do not edit generated files by hand. Edit `skills/` and `categories.yml`, then
run the build commands below.

## Add a Skill

1. Run:

```bash
npm run skills:new
```

2. Fill in the new `SKILL.md`.
3. Add resource files under the skill's `resources/` folder if needed.
4. Validate and rebuild:

```bash
npm run skills:validate
npm run skills:build-index
```

5. Open `/skills` and the new detail page.

## Edit a Skill

1. Edit the skill's `SKILL.md`.
2. Update the frontmatter `updated` date.
3. Edit, add, or remove files in that skill's `resources/` folder.
4. Run:

```bash
npm run skills:validate
npm run skills:build-index
```

5. Test the detail page and ZIP download.

## Remove a Skill

1. Delete the full folder:

```bash
skills/<category>/<subcategory>/<slug>/
```

2. Run:

```bash
npm run skills:validate
npm run skills:build-index
```

The index script removes stale ZIP files before regenerating downloads.

## Add or Edit Categories

1. Edit `categories.yml`.
2. Category and subcategory ids must be kebab-case.
3. Skill folder paths and frontmatter must match `categories.yml`.
4. Run:

```bash
npm run skills:validate
npm run skills:build-index
```

## Required Frontmatter

Every `SKILL.md` needs:

```yaml
---
name: Example Skill
description: One clear sentence under 200 characters.
category: productivity
subcategory: writing-assist
tags: [example, writing]
author:
  name: Nima Aksoy
  github: nimaaksoy
version: 0.1.0
created: 2026-08-22
updated: 2026-08-22
license: CC-BY-4.0
dependencies: []
---
```

The body must include at least one `##` section heading.

## Before Commit

Run:

```bash
npm run skills:validate
npm run skills:build-index
npm run build
```

Stage the source skill files plus regenerated files in `public/skills-data/`.
Do not stage unrelated local changes.
