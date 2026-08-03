# Contributing Prompts

This library is a public collection of useful prompts discovered and contributed by people. Keep contributions practical, clear, and easy to reuse.

## How To Contribute

1. Fork `https://github.com/nimaaksoy/nimaaksoy.com`.
2. Create a Markdown file in `content/prompts/`.
3. Use the frontmatter format below.
4. Add only media you have permission to share or embed.
5. Include the original source URL when relevant.
6. Reuse existing tags where possible.
7. Run `npm run prompts:validate` and `npm run build`.
8. Open a pull request.

## Required Fields

- `title`: Human-readable prompt title.
- `slug`: Lowercase URL slug using letters, numbers, and hyphens.
- `description`: One clear sentence explaining the prompt.
- `tags`: Lowercase reusable tag list.
- Prompt body: The reusable prompt content below the frontmatter.

## Optional Fields

- `media`: A list of image or video embeds.
- `sourceUrl`: Original public source.
- `authorName`: Author or contributor name.
- `authorUrl`: Public author profile.
- `date`: `YYYY-MM-DD`.
- `featured`: `true` or `false`.

## Complete Example

```md
---
title: "Cinematic product video"
slug: "cinematic-product-video"
description: "Create a dramatic product video with controlled camera movement and studio lighting."
tags:
  - video
  - product
  - cinematic
media:
  - type: "video"
    url: "https://example.com/video.mp4"
    poster: "https://example.com/poster.jpg"
    alt: "Product video preview"
sourceUrl: "https://x.com/example/status/123"
authorName: "Example Author"
authorUrl: "https://x.com/example"
date: "2026-08-03"
featured: false
---
Create a cinematic product video for [PRODUCT].

Use controlled camera movement, studio lighting, macro details, and a clean final hero shot.
```

## Supported Media

- `image`: Use a direct image URL in `url`, or a self-hosted path under `/prompts/media/`.
- `video`: Use a direct video URL in `url`, or a self-hosted path under `/prompts/media/`; include `poster` when possible.
- **Prefer self-hosting** X/Twitter media: `video.twimg.com` returns **403** when the browser sends `Referer: nimaaksoy.com`. Download mp4 + poster into `public/prompts/media/{slug}/` and point frontmatter at `/prompts/media/{slug}/video.mp4` and `/prompts/media/{slug}/poster.jpg`.
- The player also sets `referrerPolicy="no-referrer"` as a fallback for external hosts that allow no-referrer fetches.
- Do not use local filesystem paths outside `public/`, private URLs, or media you do not have permission to share or embed.

## Tag Rules

- Use lowercase slugs such as `video`, `writing`, `product`, `research`, `strategy`.
- Reuse existing tags before creating a new one.
- Do not create near-duplicates like `web-design`, `website-design`, and `website-ui`.
- Keep tags broad enough to be useful across multiple prompts.

## Slug Rules

- Use lowercase letters, numbers, and hyphens only.
- Match the file name when practical.
- Do not change a slug after a prompt is published unless there is a strong reason.

## Content Quality

- Make the prompt directly reusable.
- Prefer concrete instructions over vague advice.
- Use variables like `[PRODUCT]`, `[AUDIENCE]`, or `[PASTE NOTES]` where the user should customize input.
- Do not include private data, secrets, or copyrighted text you cannot share.

## Pull Request Checklist

- [ ] The file is in `content/prompts/`.
- [ ] The file name does not start with `_`.
- [ ] Required fields are present.
- [ ] Tags are normalized and reusable.
- [ ] Media URLs are public and permitted.
- [ ] Original source is included when relevant.
- [ ] `npm run prompts:validate` passes.
- [ ] `npm run build` passes.
