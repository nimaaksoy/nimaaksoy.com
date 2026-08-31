# Midjourney Image Generation Prompt Guide

Midjourney is a cutting-edge AI that creates images with cinematic appeal and intricate details from text prompts. It works via Discord and excels at creating visually striking, artistic images.

## Core Principle

**Keep it short and specific.** Simple, descriptive phrases work best. Avoid long lists or overly detailed instructions.

---

## Prompt Structure

A complete Midjourney prompt has up to four parts:

```
/imagine [image URLs] [text description] [--parameters]
```

1. **Command**: `/imagine` (required - initiates generation)
2. **Image URLs** (optional): Reference images for style/content consistency
3. **Text Description** (required): What you want to see
4. **Parameters** (optional): Technical adjustments (aspect ratio, style, etc.)

---

## Prompting Strategy

### Basic Formula

1. **Start with main subject + attributes**
   - "goblin bears with distinctive noses"

2. **Define background/scene**
   - "in a futuristic landscape"

3. **Specify art style** (adds dimension)
   - "1920s magazine illustration style"

**Example:**
```
/imagine goblin bears with distinctive noses in a futuristic landscape, 1920s magazine illustration style
```

### What to Specify

- **Subject**: Who/what (person, animal, object, location)
- **Medium**: Form (photo, painting, illustration, sculpture)
- **Environment**: Where (indoors, outdoors, specific location)
- **Lighting**: Type (soft, dramatic, neon, golden hour)
- **Color**: Palette (vibrant, muted, monochromatic, pastel)
- **Mood**: Feeling (playful, mysterious, energetic, gloomy)
- **Composition**: Framing (portrait, closeup, bird's-eye view, wide-angle)

### Best Practices

- **Use specific synonyms**: "gigantic" instead of "big"
- **Be precise with numbers**: "three cats" instead of "cats"
- **Focus on what you want**: Describe presence, not absence
- **Choose the right words**: Quality matters more than quantity

---

## Common Parameters

Parameters come at the end of prompts after `--`

### 1. Aspect Ratio
```
--ar [width]:[height]
--aspect [width]:[height]
```

**Common ratios:**
- `--ar 1:1` - Square (social media)
- `--ar 4:3` - Classic (older screens)
- `--ar 16:9` - Widescreen (videos, modern displays)
- `--ar 2:3` - Portrait (photography)
- `--ar 9:16` - Vertical (mobile, stories)

**Example:** `/imagine sunset over mountains --ar 16:9`

### 2. Stylize
```
--stylize [0-1000]
--s [0-1000]
```

Controls how much Midjourney's default aesthetic influences results. Default is 100.
- Lower values (0-50): More literal interpretation
- Higher values (500-1000): More artistic/stylized

**Example:** `/imagine minimalist logo --s 50`

### 3. Quality
```
--quality [.25, .5, 1, or 2]
--q [.25, .5, 1, or 2]
```

Rendering time and detail level. Default is 1.
- `.25` or `.5`: Faster, less detailed
- `1`: Standard (recommended for most uses)
- `2`: More detailed (uses 2x the generation time)

### 4. Chaos
```
--chaos [0-100]
--c [0-100]
```

Controls variety in results. Default is 0.
- Low values: More consistent/predictable
- High values: More varied/unexpected results

### 5. Seed
```
--seed [integer]
```

Use a specific seed number to create similar images. Get seed numbers from previous generations to maintain consistency.

### 6. Stop
```
--stop [10-100]
```

Stops rendering partway through. Creates interesting artistic effects or blurred results. Useful for softening imperfect text.

### 7. Character Reference (V6+)
```
--cref [image URL]
--cw [0-100]
```

Maintains consistent character design across images.
- `--cref`: Reference image URL
- `--cw`: Weight (0-100) - higher = closer resemblance

**Example:** `/imagine Master Raccoon riding bicycle --cref https://example.com/raccoon.jpg --cw 80`

---

## Style Keywords & Techniques

### Art Styles

**Retro Games:**
- "1990s point and click 16bit adventure" - Pixelated, retro game style
- "32-Bit Isometric" - Angled rooms, mid-90s game aesthetic

**Fine Art:**
- "Surrealism" - Dreamscape, wild, hyper-detailed
- "Cubism" - Geometric shapes, vibrant colors
- "Art Deco" - 1920s-30s optimistic, stylish compositions
- "Bauhaus" - Clean lines, primary colors, modern materials

**Genre Styles:**
- "Steampunk" - Retrofuturistic, alternative history
- "Cyberpunk" - Futuristic cityscape, neon, high-tech
- "Phantasmal Iridescent" - White, blue, pinkish lights (gothic/fantasy)

**Artistic Techniques:**
- "Layered Paper" - Paper art, intricate textures
- "Watercolor Sketch" - Pastel tones, subtle brush marks
- "Naive Art" - Children's book illustrations, playful
- "DuoTon" - Two-color graphic design

### Photography Terms

**Camera Specifications:**
- Wide-angle shot
- Macro focus
- 85mm portrait lens
- Shallow depth of field / bokeh
- Sharp focus
- Bird's-eye view / low-angle perspective

**Lighting:**
- Golden hour
- Dramatic lighting
- Studio lighting
- Soft, diffused light
- Cinematic lighting

### Creative Patterns

**"A as B" Formula:**
Transform one thing into another (e.g., "cat as astronaut", "teapot as spaceship")

**Director Styles:**
"in the style of [cinema director]" - Emulate specific cinematic aesthetics

---

## Generation vs Editing

### Text-to-Image Generation
Use the formulas and templates above. Focus on clear, descriptive language.

### Image-to-Image Editing

**With Image References:**
1. Upload/provide image URL first
2. Describe desired changes in text
3. Add parameters as needed

**Example:**
```
/imagine [image URL] add wizard hat to the cat, keep original lighting and composition --ar 1:1
```

**For Style Transfer:**
```
/imagine [image URL] transform into Van Gogh style with swirling brushstrokes
```

---

## Pro Tips

- **Use `/describe`**: Upload an image and Midjourney suggests prompts for similar results
- **Remix Mode**: Turn on in settings to modify generated images iteratively
- **Get seed numbers**: React with 📧 emoji to get image seed for consistency
- **Upscale strategically**: U1-U4 buttons upscale specific results
- **Create variations**: V1-V4 buttons create variations of specific results
- **Blur imperfect text**: Use `--stop 85` to slightly blur before completion

---

## Quick Reference

| Use Case | Recommended Approach |
|----------|---------------------|
| Photorealistic images | Photography terms + lighting + camera specs |
| Artistic styles | Style keywords + art movement names |
| Characters/illustrations | Art style + character details + mood |
| Consistent characters | Use `--cref` with reference images |
| Product mockups | Studio lighting + detailed materials |
| Game/retro aesthetics | Era-specific style keywords |
| Abstract/surreal | Style movements + unusual combinations |

---

## Common Workflows

### Creating a Series
1. Generate initial image
2. Get seed number (📧 reaction)
3. Use `--seed [number]` in subsequent prompts for consistency
4. Add `--cref [URL]` for character consistency

### Iterative Refinement
1. Generate initial batch (4 images)
2. Choose favorite with U button
3. Use V button for variations
4. Apply Remix to adjust specific elements
5. Repeat until satisfied

### Style Exploration
1. Start with basic description
2. Add different style keywords
3. Adjust `--stylize` value
4. Compare results and refine