---
name: start-linux-learning
description: Initialize or resume the Linux Hacker Academy's Git-tracked learning plan. Use when a learner clones this repository, asks to start the course, set a pace or goal, choose a starting chapter, or recover their current progress.
---

# Start Linux learning

1. Read `AGENTS.md`, `README.md`, `LEARNING.md`, and `learning/state.json`.
2. Run `python3 scripts/academy.py init` if the state is missing or uninitialized.
3. Ask, one question at a time:
   - What can the learner already do comfortably in a shell?
   - What outcome are they aiming for?
   - How many sessions per week are realistic?
4. Recommend a starting chapter from `app/course-data.ts`. Explain the choice in one short paragraph and let the learner override it.
5. Save the answers with `python3 scripts/academy.py init --mission "..." --pace "..." --goal "..."`. Do not edit generated progress tables by hand.
6. Run `python3 scripts/academy.py verify`.
7. Offer to begin one lesson with `$learn-linux`.

Keep onboarding brief. Do not teach a full lesson during initialization unless the learner asks to continue.
