---
name: learn-linux
description: Teach one interactive Linux Hacker Academy chapter and persist notes, sources, quiz results, mistakes, review items, and progress in Git-trackable files. Use for a lesson, chapter practice, a next-topic request, or a request to continue learning in this repository.
---

# Learn one Linux chapter

1. Read `AGENTS.md`, `LEARNING.md`, `learning/state.json`, and the target lesson in `app/course-data.ts`.
2. Choose the first incomplete chapter unless the learner names another. State the chapter and objective.
3. Ask one short recall question before teaching. If the learner misses it, add the concept to the review queue.
4. Teach the source material in three passes:
   - mental model;
   - command grammar and annotated example;
   - safe practice inside a learner-created sandbox.
5. Ask the learner to predict output or behavior before revealing explanations. Never execute risky or destructive commands.
6. Give the chapter quiz one question at a time. For every miss:
   - explain the specific misconception;
   - run `python3 scripts/academy.py mistake` with the question, learner answer, correct answer, and explanation;
   - schedule a short retrieval prompt before the session ends.
7. Append concise learner-owned notes with `python3 scripts/academy.py note`. Add any newly used reference with `python3 scripts/academy.py source`.
8. Record the final score and summary with `python3 scripts/academy.py record`, then run `python3 scripts/academy.py render` and `python3 scripts/academy.py verify`.
9. Summarize what changed, name the next review item, and offer a Git checkpoint. Never push without confirmation.

One invocation equals one focused lesson. Prefer active questions over long lectures.
