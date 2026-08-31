---
name: Midjourney Prompt Expert
description: Craft optimized Midjourney prompts with proper syntax, parameters, and style references for cinematic, detailed AI images (v6+).
dependencies: []

category: content-creation
subcategory: graphic-design
tags: [midjourney, prompting, image, ai-art, parameters]
author:
  name: Community pack
  url: https://nimaaksoy.com/skills
license: MIT
version: 0.1.0
created: 2026-09-01
updated: 2026-09-01
---

# Midjourney Prompt Expert

> **Credit:** Community Midjourney prompt-expert skill pack (MIT). Added from a user-supplied SKILL.md + reference guide. Not originally authored by Nima Aksoy.


## Overview

Master the art of crafting effective Midjourney prompts to generate stunning AI images. This skill provides comprehensive guidance on Midjourney's syntax, parameters, best practices, and advanced techniques for creating cinematic, detailed images through Discord.

---

## When to Use This Skill

Use this skill when you need to:
- Create optimized prompts for Midjourney image generation
- Understand and apply Midjourney parameters (`--ar`, `--s`, `--c`, `--q`, etc.)
- Structure prompts for specific artistic styles or compositions
- Use image references and style references effectively
- Troubleshoot prompt issues or refine existing prompts
- Generate variations of existing images
- Apply advanced techniques like permutations or multi-prompts

---

## Core Principles

### 1. Keep It Short and Specific
Simple, descriptive phrases work best. Avoid long lists or overly detailed instructions.

**Good:** `sunset over mountains, golden hour, dramatic clouds --ar 16:9`

**Avoid:** `a beautiful sunset with orange and pink colors happening over some tall mountains with snow on them and there are dramatic clouds in the sky and it's during golden hour`

### 2. Focus on Presence, Not Absence
Describe what you want to see, not what you don't want.

**Good:** `peaceful garden with blooming flowers`

**Avoid:** `garden without weeds or dead plants`

### 3. Use Specific Language
Choose precise words over generic descriptions.

**Good:** `gigantic ancient oak tree`

**Avoid:** `big old tree`

---

## Process

### Step 1: Load the Midjourney Reference Guide

**Before creating any prompts, read the complete reference documentation:**

📋 **[View Midjourney Guide](./reference/midjourney.md)**

This comprehensive guide contains:
- Prompt structure and syntax
- All available parameters and their effects
- Best practices and examples
- Advanced techniques (remixing, permutations, multi-prompts)
- Style and image references
- Common use cases and solutions

### Step 2: Understand the User's Vision

Ask clarifying questions if needed:
- What is the main subject?
- What style or mood are they aiming for?
- What's the intended use? (social media, print, website, etc.)
- Any specific requirements? (aspect ratio, color palette, etc.)

### Step 3: Structure the Prompt

Use this formula from the reference guide:

```
/imagine [subject + attributes] [environment/scene] [art style/medium] [--parameters]
```

**Example breakdown:**
- **Subject:** `cyberpunk detective with neon implants`
- **Environment:** `in rain-soaked city streets`
- **Style:** `film noir photography style`
- **Parameters:** `--ar 2:3 --s 250`

**Final prompt:**
```
/imagine cyberpunk detective with neon implants in rain-soaked city streets, film noir photography style --ar 2:3 --s 250
```

### Step 4: Apply Appropriate Parameters

Choose parameters based on the reference guide and requirements:

**Common parameters:**
- `--ar [ratio]`: Aspect ratio (1:1, 16:9, 2:3, 9:16)
- `--s [0-1000]`: Stylization level (default 100)
- `--c [0-100]`: Chaos/variety (default 0)
- `--q [.25-.5-1-2]`: Quality/detail (default 1)
- `--style raw`: More photographic, less artistic
- `--sref [URL]`: Style reference image
- `--cref [URL]`: Character reference image

### Step 5: Provide Variations or Alternatives

Offer 2-3 prompt variations with different approaches:
- Different artistic styles
- Alternative compositions
- Varying parameter settings

---

## Example Workflows

### Example 1: Product Photography

**User Request:** "Professional product photo of a smartwatch"

**Optimized Prompts:**

1. **Clean Studio Shot:**
```
/imagine luxury smartwatch with titanium case, white studio backdrop, soft diffused lighting, product photography style --ar 4:5 --s 50 --q 2
```

2. **Lifestyle Context:**
```
/imagine smartwatch on wrist, modern minimalist office desk, natural window light, lifestyle product photography --ar 16:9 --s 75
```

3. **Dramatic Angle:**
```
/imagine smartwatch closeup macro shot, reflective screen, dramatic side lighting, commercial product photography --ar 1:1 --s 100 --q 2
```

### Example 2: Character Art

**User Request:** "Fantasy warrior character for a game"

**Optimized Prompts:**

1. **Detailed Character:**
```
/imagine fierce warrior woman with ornate armor, mystical runes glowing, ancient temple background, epic fantasy digital art style --ar 2:3 --s 400
```

2. **Action Pose:**
```
/imagine fantasy warrior mid-battle stance, dual swords, dynamic pose, particles and magic effects, concept art style --ar 9:16 --s 350 --c 20
```

3. **Portrait Focus:**
```
/imagine fantasy warrior portrait, battle-worn armor, determined expression, dramatic lighting, character concept art --ar 4:5 --s 300
```

---

## Advanced Techniques

### Using Style References

Apply consistent style across generations:
```
/imagine [your prompt] --sref [URL of style reference image]
```

### Character Consistency

Maintain character appearance across prompts:
```
/imagine [character prompt] --cref [URL of character reference]
```

### Permutations

Generate multiple variations efficiently:
```
/imagine {subject, object, scene} in {style1, style2, style3} --ar 16:9
```

### Remix Mode

Enable remix to modify existing images:
- Use `/prefer remix` to enable
- Click "Vary (Region)" on generated images
- Modify specific areas while keeping the rest

---

## Common Use Cases

### Social Media Content
- Use `--ar 1:1` for Instagram posts
- Use `--ar 9:16` for stories/reels
- Keep `--s` between 50-150 for clean, recognizable content

### Website Headers
- Use `--ar 21:9` or `--ar 16:9`
- Lower `--s` values (50-100) for professional look
- Add `--style raw` for photorealistic results

### Print Design
- Use `--q 2` for maximum detail
- Consider `--ar 2:3` or `--ar 4:5` for prints
- Higher `--s` values (200-500) for artistic prints

### Concept Art
- Use `--s 250-500` for stylized art
- Add `--c 10-30` for varied iterations
- Use style references for consistency

---

## Tips for Success

1. **Start Simple**: Begin with clear, concise descriptions
2. **Iterate**: Generate, analyze, refine based on results
3. **Reference the Guide**: Consult [midjourney.md](./reference/midjourney.md) for parameter details
4. **Test Parameters**: Try different values to understand their effects
5. **Study Examples**: Look at successful prompts from the Midjourney community
6. **Be Specific**: Use exact terms (e.g., "cinematic lighting" vs. "nice lighting")
7. **Consider Context**: Match parameters to intended use case

---

## Reference Documentation

📋 **[Complete Midjourney Guide](./reference/midjourney.md)**

This reference contains:
- Full parameter reference
- Prompt structure examples
- Style and artistic medium keywords
- Advanced features (remix, pan, zoom, vary)
- Multi-prompt syntax
- Image and style references
- Common solutions and troubleshooting

Always consult this guide when:
- Learning new parameters
- Exploring advanced features
- Troubleshooting prompt issues
- Finding specific style keywords

---

## Notes

- Midjourney operates through Discord
- V6+ models are recommended for best results
- Free plan includes limited generations
- Paid plans offer more GPU time and features
- Images are publicly visible unless using private mode (paid plans)
