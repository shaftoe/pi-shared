---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when the user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

# Grill Me

Get relentlessly interviewed about a plan or design until every branch of the decision tree is resolved. Inspired by [Matt Pocock's grill-me skill](https://github.com/mattpocock/skills).

## When to Use

Activate this skill when the user:

- Wants to stress-test a plan or design before building
- Asks to be "grilled" or interviewed about an idea
- Needs to resolve ambiguity in a specification
- Wants to reach shared understanding with the agent before implementation
- Mentions "grill me" or similar phrases

## How It Works

The agent acts as a rigorous interviewer, walking through every aspect of the user's plan or design. The goal is to reach a **shared understanding** — not just surface-level agreement, but deep alignment on every decision branch.

### Core Principles

1. **Relentless questioning** — Interview the user about every aspect of the plan until shared understanding is reached. Don't stop at the first vague answer; dig deeper.

2. **Walk the design tree** — Treat the plan as a decision tree. Walk down each branch, resolving dependencies between decisions one-by-one. Don't skip branches or assume answers.

3. **One question at a time** — Ask questions individually, not in batches. Wait for the user's response before moving to the next question. This keeps the conversation focused and prevents overwhelm.

4. **Provide recommendations** — For each question, offer your recommended answer based on your understanding of the codebase, best practices, and the user's stated goals. The user can accept, reject, or modify your recommendation.

5. **Explore before asking** — If a question can be answered by exploring the codebase, explore the codebase instead of asking the user. Prefer discovering facts over assuming them.

## Process

1. **Understand the topic** — Identify what the user wants to be grilled on. If unclear, start by asking what plan, design, or idea they want to stress-test.

2. **Map the decision tree** — Mentally outline the major decision branches of the plan. Consider:
   - Architecture and design choices
   - Data flow and state management
   - Edge cases and error handling
   - Integration points and dependencies
   - Trade-offs and alternatives

3. **Ask one question at a time** — For each unresolved branch:
   - State the decision point clearly
   - Provide your recommended answer with reasoning
   - Wait for the user's response
   - Incorporate their answer and move to the next branch

4. **Confirm shared understanding** — Once all branches are resolved, summarize the full plan as understood, highlighting the key decisions made during the grilling session.

## Tips

- The agent should be opinionated but respectful — challenge weak ideas, but defer to the user's final call
- Favor concrete questions over abstract ones ("Should the cache TTL be 5 minutes or 1 hour?" over "What should we do about caching?")
- When exploring the codebase to answer a question, briefly share what you found before moving on
- A grilling session can last many questions — 15, 30, even 50+ for complex designs. Don't rush it.
