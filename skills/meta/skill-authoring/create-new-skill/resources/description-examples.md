# Description field — good vs bad

The `description` is the single field a model uses to decide whether to load the skill. Get this wrong and the skill never runs. Get this right and everything else is secondary.

## The rule

≤ 200 characters. Leads with an explicit trigger ("Use when …", "Activates on …", "Apply this when …"). Names the situation, not the value.

---

## Good

> **Use when the user asks to write or send a B2B cold email. Produces a short message with one specific hook, one line of relevance, and a soft, low-commitment call to action.**

Why it works: clear trigger ("write or send a B2B cold email"), names the artefact ("short message"), gives the model concrete structural cues it can use ("one hook, one relevance line, soft CTA").

---

> **Use when the user asks to shape a song into a verse-chorus-verse-chorus-bridge-chorus structure or asks for help with song form. Returns the structure with rhyme-scheme and prosody notes.**

Why it works: trigger is specific, even names the song-form so the model doesn't have to guess synonyms.

---

> **Apply when the user's request is ambiguous and could reasonably go two or more ways. Ask one focused clarifying question before answering; do not ask if the request is already clear.**

Why it works: trigger is a *condition on the request*, not a topic. Includes a negative case ("do not ask if …") which sharpens the boundary.

---

## Bad

> ❌ **A powerful skill for writing amazing cold emails.**

Why it fails: marketing language, no trigger, no situation. The model can't tell when this is supposed to fire.

---

> ❌ **Helps with songwriting.**

Why it fails: too broad. Every songwriting request would "help with songwriting." The model has nothing to discriminate on, so it either loads the skill always (wasting context) or never.

---

> ❌ **This skill is comprehensive and covers all aspects of B2B sales outreach including cold emails, LinkedIn messages, follow-ups, objection handling, discovery questions, and pricing conversations.**

Why it fails: 200+ chars, omnibus scope, no trigger. Anything that says "covers all aspects of" should be split into separate skills.

---

> ❌ **For users who want to write better emails.**

Why it fails: describes the user, not the request. The model loads skills based on the message in front of it, not based on inferred user intent.

---

## Test it

Before shipping, read your description and answer in one sentence:

> "If a user said *<single message>*, would the model know from this description alone that this skill applies?"

If you can't fill in `<single message>` with a concrete example, the description is too vague. Revise.
