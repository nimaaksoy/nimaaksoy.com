---
name: Clarification-First Prompting
description: Use when a user request is ambiguous in a way that meaningfully changes the answer. The model asks one focused clarifying question before producing a response, then proceeds.
dependencies: []

category: meta
subcategory: prompt-engineering
tags: [prompting, clarification, ambiguity]
author:
  name: Nima Aksoy
  url: https://nimaaksoy.com
  github: nimaaksoy
license: CC-BY-4.0
version: 0.1.0
created: 2026-05-14
updated: 2026-05-14
---

# Clarification-First Prompting

## Overview

A meta skill that teaches the model to pause and ask one focused clarifying question before answering an ambiguous request. The skill is opinionated about restraint: at most one question, only when the answer would be meaningfully different across plausible readings of the request.

## When to use this skill

- The request has more than one reasonable interpretation and the answers diverge.
- A core constraint is missing (audience, format, length, language, scope).
- The request references something specific the model cannot identify with confidence.

Do not use this skill when the request is clear, when the ambiguity is cosmetic, or when the user has already answered the question implicitly elsewhere in the conversation.

## Instructions

1. Read the request once and list, internally, the most likely two or three interpretations.
2. If the answers across interpretations would be substantively different, pick the single highest-leverage missing fact.
3. Ask one question. Make it concrete and answerable in a sentence. Offer two or three options if it helps the user choose faster.
4. Do not stack questions. Do not ask a question whose answer you can reasonably guess.
5. Once the user answers, proceed without re-asking.
6. If the request is already clear, skip the question entirely and answer.

The bar for asking is high. A wrong guess that the user can correct in one turn is often cheaper than a clarifier that breaks their flow.

## Examples

### Example 1 — Ambiguous request that should trigger a clarifier

**Input:**
> User asks: "Write me a short bio."

**Expected behaviour:**
The skill should ask one question before writing. Two interpretations diverge sharply: a professional LinkedIn-style bio versus a personal dating-app-style bio. The model should ask:

> Quick check before I draft this: is this for a professional context like a website or LinkedIn, or a personal one like a social profile?

Then write once the user answers.

### Example 2 — Clear request that should not trigger a clarifier

**Input:**
> User asks: "Write me a 3-sentence professional bio for the about page of my freelance design site. I am Maya, I have ten years of brand work, mostly for food and hospitality clients."

**Expected behaviour:**
The skill should not ask a question. Audience, format, length, and content are all specified. The model writes the bio directly.

### Example 3 — Borderline case where the clarifier is the wrong move

**Input:**
> User asks: "Translate this to Spanish."

**Expected behaviour:**
The skill should not ask whether the user wants Latin American or Castilian Spanish. The cost of guessing wrong is one turn; the cost of asking is interrupting the user. Translate using neutral Latin American Spanish and offer a one-line note that it can be adjusted.

## Resources

None.

## Notes & limitations

- The skill leans toward not asking. Over-clarifying is the more common failure than under-clarifying.
- Conversational context overrides this skill: if the user has answered the would-be question earlier, do not re-ask it.
- This skill does not apply to safety-relevant ambiguity, which has its own handling.

## Changelog

- `0.1.0` — initial version.
