---
name: B2B Cold Email Outreach
description: Use when drafting a cold B2B outreach email. Produces a short message with one specific hook, one line of relevance, and a soft, low-commitment call to action.
dependencies: []

category: business
subcategory: sales
tags: [outreach, b2b, cold-email]
author:
  name: Nima Aksoy
  url: https://nimaaksoy.com
  github: nimaaksoy
license: CC-BY-4.0
version: 0.1.0
created: 2026-05-14
updated: 2026-05-14
---

# B2B Cold Email Outreach

## Overview

A skill for writing short, human B2B cold emails. The structure is hook, relevance, soft CTA. The goal is a reply, not a meeting. The message reads like a peer reaching out, not a sales sequence.

## When to use this skill

- The user asks to draft a cold email to a prospect, founder, hiring manager, or buyer.
- The user has a specific recipient, company, or role in mind.
- The user wants a first-touch message, not a follow-up sequence.

## Instructions

Write a single message of 60 to 110 words. Keep it plain text. No emoji. No exclamation marks. No marketing language.

1. Open with a specific hook tied to something true and recent about the recipient or company. One sentence. Avoid flattery.
2. Add one relevance line that connects the hook to a problem the recipient likely owns. Name the problem, not your product.
3. Close with a soft CTA. Ask for permission to share more, or a yes/no question. Never propose a 30-minute call in the first message.
4. Subject line: under 6 words, lowercase, no clickbait. It should describe the email, not pitch it.
5. Sign with first name only.
6. Read the draft aloud. If it sounds like a template, rewrite the hook.

See `resources/templates.md` for three reusable openers.

## Examples

### Example 1 — Outreach to a head of operations

**Input:**
> Write a cold email to Maya Chen, Head of Operations at Lumen Logistics. They just opened a Houston warehouse. I sell route-planning software.

**Expected behaviour:**
The skill should produce something like:

> Subject: houston route planning
>
> Maya,
>
> Saw the Houston warehouse announcement last week. Standing up a new lane usually means two or three weeks of manual route fixes before the patterns settle.
>
> We help ops teams compress that to a few days. Worth a short note with two before-and-after examples from teams your size?
>
> Nima

### Example 2 — Outreach to a founder

**Input:**
> Cold email to Theo Park, founder of Riverbed CRM. They raised a seed round last month. I do fractional security reviews for early-stage SaaS.

**Expected behaviour:**

> Subject: post-seed security
>
> Theo,
>
> Congrats on the Riverbed seed. The window between hiring the first engineers and signing the first mid-market contract is where most CRMs end up redoing their auth model.
>
> I do short, fixed-scope security reviews for companies right at that stage. Open to a one-page summary of what I usually look at?
>
> Nima

## Resources

- `resources/templates.md` — three reusable openers covering recent news, product change, and a shared connection.

## Notes & limitations

- This skill produces a first-touch email only. It does not write multi-step sequences.
- Hooks require something true about the recipient. If the user has no specifics, the skill should ask for one before drafting.
- Do not use this skill for consumer-facing marketing emails.

## Changelog

- `0.1.0` — initial version.
