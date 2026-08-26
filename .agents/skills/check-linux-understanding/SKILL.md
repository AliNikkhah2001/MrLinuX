---
name: check-linux-understanding
description: Run a structured Linux Hacker Academy understanding check and save the result. Use when a learner asks for a quiz, phase review, checkpoint, exam, retake, or mistakes-focused assessment in this repository.
---

# Check Linux understanding

1. Read `AGENTS.md`, `LEARNING.md`, `learning/state.json`, and the requested chapter range in `app/course-data.ts`.
2. Ask exactly eight questions, one at a time:
   - four conceptual questions about mental models, grammar, or system behavior;
   - four practical questions that ask for a command, prediction, diagnosis, or safe correction.
3. Do not reveal the answer before the learner responds. Score each answer as correct, partial, or missed and keep a running score privately.
4. For every partial or missed answer, explain the gap and record it with `python3 scripts/academy.py mistake`.
5. End with:
   - score and level: needs review, developing, solid, or transferable;
   - a short mistake breakdown;
   - the two highest-priority review prompts;
   - a choice to retake or continue.
6. Record the session with `python3 scripts/academy.py record`, then run `python3 scripts/academy.py render` and `python3 scripts/academy.py verify`.

Ground all questions in the repository curriculum. Keep practical tasks inside a safe sandbox and avoid privileged or destructive operations.
