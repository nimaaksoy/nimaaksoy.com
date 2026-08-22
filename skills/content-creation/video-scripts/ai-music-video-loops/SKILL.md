---
name: AI Music Video Loops
description: Use when generating prompts for AI video tools (Sora, Runway, Veo, Kling, Pika) to create hypnotic 3–5 second loop videos for music. Produces atmospheric, loop-friendly visual briefs.
dependencies: []

category: content-creation
subcategory: video-scripts
tags: [ai-video, music-video, loop, sora, runway, veo, kling, pika]
author:
  name: Nima Aksoy
  url: https://nimaaksoy.com
  github: nimaaksoy
license: CC-BY-4.0
version: 0.1.0
created: 2026-05-16
updated: 2026-05-16
---

# AI Music Video Loops

## Overview

Build prompts for AI video tools that produce **visually hypnotic short loops** for music — atmospheric, immersive, seamlessly repeatable. The core principle: don't write a scene where *things happen*. Write a scene that *exists and breathes*.

Output target: 3–5 seconds. Motion is ambient, environmental, emotionally stable, and loop-friendly.

## When to use this skill

- The user wants a video prompt for music — looped backdrop, music video B-roll, visualiser, social-media background.
- The user mentions Sora, Runway, Veo, Kling, Pika, Luma, or "AI video".
- The user asks for hypnotic / atmospheric / ambient short visuals.
- The user wants the same vibe rendered across multiple style variations.

Do **not** use when:

- The user wants a full narrative video script with scenes and dialogue — use a screenwriting approach instead.
- The user wants a single still image — use an image-prompt skill.
- The user wants a long-form video (>10 sec) with story progression.

## Instructions

### Core philosophy

The loop has to feel:

- ambient
- environmental
- continuous
- emotionally stable
- loop-friendly

It must **not** feel like a cinematic sequence, a short movie, or an action scene.

### Motion to use

rain · snowfall · fog drifting · smoke · floating particles · dust · cloth movement · light flicker · reflections · water ripples · fire embers · slow moving shadows · subtle camera drift · steam · clouds · neon glow pulses · CRT flicker.

### Motion to avoid

walking · dancing · talking · dramatic gestures · fast camera movement · turning around · scene transitions · object transformations · sudden lighting changes · story progression.

### Camera

**Use**: locked camera · slow dolly · subtle push-in · tiny cinematic drift.

**Avoid**: handheld · aggressive movement · spinning · fast zooms.

### Layering principle

Every good loop contains three depth layers. Layered motion hides loop seams naturally.

1. **Foreground motion** — rain, particles, fog, smoke, embers.
2. **Midground focus** — the main subject or environment.
3. **Background depth** — distant lights, buildings, haze, stars, mountains.

### Prompt structure

Order matters. Build every prompt in this order:

```
[environment + mood],
[subtle environmental motion],
[lighting style],
[layered depth],
[camera behavior],
[loop-friendly atmosphere],
[minimal motion],
[cinematic quality]
```

### Universal loop phrases (mix 3–5 per prompt)

subtle atmospheric motion · seamless loop feeling · ambient movement · hypnotic repetition · environmental motion only · emotionally stable scene · cinematic depth · layered atmosphere · minimal movement · slow breathing environment · static composition · dreamy continuous motion · immersive ambience · loop-friendly motion · no dramatic action.

### Output format

Return a single prompt per requested style as a comma-separated descriptor block, ~30–50 descriptors. If the user asks for multiple styles, return one labelled block per style.

End every prompt with a loop-friendliness phrase (e.g. `seamless loop feeling` or `loop-friendly motion`) so the AI generator biases toward repeatable output.

## Examples

### Dark Ambient

```
abandoned cathedral interior, drifting fog, floating dust particles,
candle flicker, layered shadows, subtle atmospheric movement, locked
camera, cinematic depth, hypnotic ambience, seamless loop feeling,
minimal motion, emotionally stable scene
```

### Lofi

```
cozy bedroom during rain, steam from coffee cup, soft monitor glow,
subtle curtain movement, rainy window reflections, warm cinematic
lighting, ambient atmosphere, slow environmental motion, static
composition, seamless loop feeling
```

### Synthwave

```
neon highway at night, rain reflections on asphalt, drifting fog,
distant car lights, subtle glow pulses, cinematic depth, minimal
camera drift, hypnotic atmosphere, environmental motion only,
seamless loop feeling
```

### Tribal

```
ancient ritual fire in desert night, floating embers, smoke drifting
in wind, cloth movement, atmospheric dust particles, cinematic
shadows, slow ambient movement, layered depth, immersive loop feeling
```

## Notes & limitations

- **3–5 seconds is the sweet spot.** Shorter feels too cut; longer drifts out of the layered-motion zone and the AI introduces unwanted change.
- **One subject, no character action.** A figure in the scene is fine if they're nearly still (looking out a window, sitting by a fire). Walking or gesturing breaks the loop.
- **Three depth layers is non-negotiable.** Single-layer scenes look flat and the loop seam shows. Always foreground + midground + background.
- **Tool differences exist.** Sora and Veo handle longer loops cleanly; Runway and Pika favour 3–4 sec; Kling is strong on environmental motion. If the user names the tool, lean into its strengths.
- **No transitions, no cuts.** A loop is one continuous take. Anything that implies a cut (different angle, different time) will break it.

## Changelog

- `0.1.0` — initial version.
