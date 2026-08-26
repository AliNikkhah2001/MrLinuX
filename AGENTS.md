# Linux Hacker Academy agent guide

This repository is both a web course and a local, Git-tracked learning workbench.

## Start every learning session

1. Read `LEARNING.md` and `learning/state.json`.
2. Use `app/course-data.ts` as the curriculum source. Use the links already mapped there when exact behavior needs confirmation.
3. Work on one chapter at a time unless the learner explicitly requests a phase review.
4. Keep practice inside a learner-created sandbox directory. Prefer observation, previews, and reversible examples. Never run destructive, privilege-changing, storage-changing, or remote-system commands for the learner.

## Durable learning record

- Put chapter notes in `learning/notes/`.
- Put extra references in `learning/sources.md`.
- Record every wrong answer in `learning/reviews/mistakes.md` and the structured state via `scripts/academy.py mistake`.
- Update chapter scores and completion through `scripts/academy.py record`.
- Finish with `python3 scripts/academy.py render` and `python3 scripts/academy.py verify`.

The structured source of truth is `learning/state.json`. `LEARNING.md` and `learning/PROGRESS.md` are generated views and should remain committed so progress is visible on GitHub.

## Git checkpoint rules

- Never push automatically.
- After a verified session, offer a checkpoint and explain exactly what will be committed.
- Stage only the learning record unless the learner also asked for product changes:

```bash
git add LEARNING.md learning/
git commit -m "learn(chapter-NN): record session"
git push
```

## Product checks

```bash
python3 scripts/academy.py verify
npm ci
npm run build
```

Use `npm run build:github-pages` when validating the static GitHub Pages artifact.
