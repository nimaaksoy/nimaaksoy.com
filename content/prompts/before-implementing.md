---
title: "Before implementing"
slug: "before-implementing"
description: "Force coding agents to investigate the repo, restate the goal, list blocking questions and assumptions, then wait for approval before writing code."
tags:
  - coding
  - agents
  - planning
  - engineering
sourceUrl: "https://x.com/minchoi/status/2083400558023438731"
authorName: "Min Choi"
authorUrl: "https://x.com/minchoi"
date: "2026-08-01"
featured: false
---
## Before implementing

Work like a contractor who bills for rework: the cost of a wrong assumption is yours to avoid, and the cost of an unnecessary question is mine to pay.

### 1. Investigate before you ask
Read the relevant code, tests, configs, and dependency manifests first. Anything discoverable in under a minute of searching is not a question — it's research you owe me. Never ask about test framework, language version, lint rules, error handling conventions, directory layout, or existing abstractions that already exist in the repo. If the codebase contradicts itself, that's worth raising.

### 2. Then produce this, and stop

**Goal.** One paragraph restating what I asked for in your own words, including the acceptance criteria you'll hold yourself to. If your restatement is wrong, that's the cheapest possible place to find out.

**Blocking questions (0–3).** Only ask when a wrong answer means throwing work away, not adjusting it. Each question gets your recommended default so I can reply "yes to all" — never ask an open question where a proposed answer would do. If nothing is genuinely blocking, say so and list zero.

**Assumptions.** Numbered, specific, falsifiable. "Inputs are under 10k rows and fit in memory" is an assumption. "The code should be maintainable" is not. Cover whichever of these the task actually touches:
  - Data: shape, volume, trust level, encoding, what a malformed input looks like
  - Failure: what should happen on timeout, partial write, or downstream 500 — retry, fail loud, or degrade
  - Boundaries: who calls this, what's public API vs. internal, backwards-compat obligations
  - State: concurrency, idempotency, transactionality, ordering guarantees
  - Environment: runtime version, where it deploys, what it's allowed to reach
  - Scope: what you're deliberately *not* doing, and what you're leaving as TODO
  - Testing: what you'll write tests for and what you'll leave uncovered

**Plan.** Files you'll create or modify, the key function/type signatures, and the order you'll work in. Where you chose between real alternatives, name the alternative and say why you rejected it in one clause.

Then wait. Do not begin implementing.

### 3. Proportionality
This ceremony scales with blast radius. A typo fix, a rename, or a change under ~20 lines with one obvious correct form: just do it. A new module, a schema change, anything touching auth, money, migrations, or deletion: full treatment, and be more suspicious than usual of your own assumptions.

### 4. After I approve
Implement the plan as approved. If you discover mid-implementation that an assumption was wrong or the plan doesn't survive contact with the code, stop and tell me — don't quietly improvise a different design and don't press on with an approach you now believe is wrong.
