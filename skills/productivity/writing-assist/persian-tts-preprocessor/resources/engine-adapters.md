# Engine-specific adapters

Each TTS engine handles Persian slightly differently. After running the standard preprocessor, apply the engine-specific layer if you know the target.

If the engine is unknown, skip this step and deliver the engine-neutral preprocessed text.

---

## Azure Speech (fa-IR)

### Voices

- `fa-IR-DilaraNeural` (female)
- `fa-IR-FaridNeural` (male)

### Capabilities

- Standard SSML supported.
- `<break time="..."/>` works.
- Pitch / rate / volume controls via SSML.
- **Custom lexicon / phoneme tags are NOT supported for fa-IR voices.**

### Implications

- All pronunciation fixes must be in the text itself.
- The exception lexicon (واو معدوله, proper names) cannot be fixed via lexicon — handle in preprocessing.
- For phantom-ezafe risk on names, use the in-text fixes (quotation marks, possessive form, full-clause anchoring).

### SSML wrapping

Standard envelope:

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="fa-IR">
  <voice name="fa-IR-DilaraNeural">
    <prosody rate="0%" pitch="0%">
      <break time="500ms"/>
      ...text...
    </prosody>
  </voice>
</speak>
```

### Recommended break times

| Position | Time |
|---|---|
| Sentence break (`.`) | `500ms` |
| Paragraph break | `800ms` |
| `،` (comma) | usually automatic; force with `200ms` if needed |
| Before a list | `300ms` |
| Inside quoted speech | `200ms` |

### Common Azure-specific issues

- Sometimes overly formal reading. Mitigate with Spoken register (more colloquial input).
- Numbers in Persian script: convert to spelled-out Persian. Don't rely on Azure's number expansion.
- Dates: spell out fully.
- Quoted speech: wrap with `<break>` before and after to give the quote separation.

---

## Google Cloud TTS / Gemini-TTS (fa-IR)

### Voices

- Gemini-TTS supports fa-IR in **Preview** status.
- Voices vary by Google Cloud project access.

### Capabilities

- SSML supported (with some restrictions vs Azure).
- `<break>` supported.
- `<sub>` for substitution (could help with pronunciation hints).
- `<prosody>` for rate/pitch/volume.

### Implications

- Preview status = variance possible between runs.
- Test critical phrases multiple times before locking.

### SSML wrapping

```xml
<speak>
  <voice name="fa-IR-Wavenet-A">
    <break time="500ms"/>
    ...text...
  </voice>
</speak>
```

### Common Google-specific issues

- Variance in Preview voices — re-roll 2–3 times if a generation sounds wrong.
- Sentence boundaries usually respected.
- Numbers: prefer spelled-out for consistency.

---

## MMS-TTS Persian (Meta / Facebook open-source)

### What it is

- Open-source, available via Hugging Face.
- Checkpoint: `facebook/mms-tts-fas` (Persian).
- Built into the Massively Multilingual Speech project.

### Capabilities

- Text in, audio out. No SSML.
- **The default tokeniser strips all punctuation.**
- Trained on text without punctuation.

### Implications

- Don't rely on commas, periods, or question marks to control prosody.
- For natural prosody, **split the text into short sentences** and synthesise each separately, then concatenate with inserted silence.

### Adapter strategy

```
Input: long Persian paragraph
→ Split on sentence boundaries (using punctuation, then remove the punctuation)
→ For each chunk:
    - Strip all punctuation
    - Send to MMS
    - Receive audio
    - Append silence (400ms default)
→ Concatenate
```

### Silence recommendations

| Position | Silence |
|---|---|
| Between sentences (was `.`) | 400ms |
| Between paragraphs | 800ms |
| After commas (was `،`) — usually skip | 0–150ms |
| Before quoted speech | 250ms |

### Common MMS-specific issues

- Run-on prosody if you don't pre-chunk.
- Robotic intonation on long sequences — keep chunks short (5–15 words).
- Ezafe still helpful (mark in input even though MMS doesn't pronounce the diacritic — it affects the phoneme prediction).

---

## XTTS-v2 (Coqui / Idiap)

### Status

- Official `xtts-v2` does **NOT** list Persian in its 16 supported languages.
- Community fine-tunes exist on Hugging Face.

### Implications

- Don't use official XTTS-v2 for Persian production. Quality will be poor.
- If using a community fine-tune, follow its specific documentation — Persian fine-tunes may have different preprocessing expectations.

### Recommended alternative

- Use a Persian-trained model (ManaTTS, ParsVoice fine-tune) or a multilingual model that officially supports Persian (Azure, Google, ElevenLabs).

---

## ElevenLabs

### Capabilities

- Supports Persian (often labelled as `fa` or via the multilingual model).
- Good Persian intonation, especially with Eleven Multilingual v2.
- SSML-like break tags supported (`<break time="0.5s" />` inline).
- Voice cloning supports Persian.

### Implications

- Strong out-of-the-box quality for Persian.
- Punctuation matters — respects `،`, `.`, `؟`.
- For long text (>500 words), break into chunks for better consistency.

### Recommended settings

| Setting | Value |
|---|---|
| Model | Eleven Multilingual v2 |
| Stability | 0.4–0.6 (lower for emotional, higher for consistent) |
| Similarity | 0.6–0.8 |
| Style | 0.2–0.4 |

### Common ElevenLabs-specific issues

- Long text can drift in voice consistency — chunk it.
- Numbers handled well; less aggressive expansion needed.
- Phantom ezafe on names still occurs — apply the same fix techniques.

---

## ParsVoice / ManaTTS (Persian-trained research models)

### Status

- Research-grade Persian TTS, available via Hugging Face / GitHub.
- ManaTTS: ~86 hours single-speaker, MOS = 3.76.
- ParsVoice: ~3526 hours raw, ~1804 hours high-quality, MOS = 3.6 / SMOS = 4.0.

### Capabilities

- Built for Persian — handle most preprocessing gracefully.
- Still benefit from the standard pipeline (normalisation, half-space, punctuation, Ezafe, exception lexicon).

### Implications

- Best Persian quality available open-source.
- Require infrastructure to deploy (GPU, Python pipeline).
- Not a drop-in API.

### Recommended preprocessing

- Apply the full standard skill pipeline.
- These models handle the `خوا-` family correctly more often than multilingual engines.

---

## Suno (singing TTS — different category)

- Suno is for music generation, not standalone TTS. If the user wants singing Persian, use the *Persian Suno Lyrics* skill, not this preprocessor.
- For spoken Persian inside Suno (in a song with a spoken verse), apply this skill's output as the verse text.

---

## Engine selection matrix

For Persian content, recommended ordering by use case:

| Use case | Best engine | Backup |
|---|---|---|
| Production voiceover, professional | Azure (Dilara/Farid) | ElevenLabs |
| Audiobook | ElevenLabs (cloned voice) | Azure |
| Chat assistant, real-time | Azure (lower latency) | ElevenLabs |
| Casual / Spoken style | ElevenLabs | Azure with Spoken-rewritten input |
| Open-source / on-premise | ManaTTS / ParsVoice | MMS-TTS with chunking |
| Research / experimentation | All — compare on your test set | — |
| Tight budget | MMS-TTS | Hugging Face Persian fine-tunes |
| Studio fine control | Azure with SSML | Google Gemini with SSML |

---

## Cross-engine test plan

When deploying to production, test the same input on multiple engines and pick the best for your specific content. Don't assume one engine is universally best.

For each engine:

1. Run the standard preprocessing pipeline.
2. Apply the engine adapter.
3. Generate audio on the 12 test slices (see `test-cases.md`).
4. Rate each slice: correct / partially correct / wrong.
5. Pick the engine with the highest score on your specific test set.

The "best" engine depends on the content. Cookbooks need clean number expansion; news needs clear sentence prosody; chat assistants need fast colloquial reading.
