# Linux Command Line Hacker Academy

```text
 _     ___ _   _ _   ___  __
| |   |_ _| \ | | | | \ \/ /
| |    | ||  \| | | | |\  /
| |___ | || |\  | |_| |/  \
|_____|___|_| \_|\___//_/\_\

> status: interactive learning system online
```

An interactive, source-grounded learning and practice system built from *The Linux Command Line: From Syntax Confusion to Fluency*. It teaches the grammar and mental models behind Linux commands instead of asking learners to memorize opaque one-liners.

## What is included

- 20 tracked chapters across six learning parts
- detailed explanations, mental models, annotated commands, and key concepts
- 60 safe practice tasks: easy, medium, and hard for every chapter
- 20 four-option knowledge checks with explanations and best-score tracking
- a browser-only command decoder that never executes shell commands
- XP, ranks, achievements, overall and per-part completion
- a GitHub-style 84-day activity matrix and consecutive-day streak counter
- browser-local progress persistence plus JSON progress export
- an autosaving chapter notebook and automatic mistakes-review queue
- chapter search, mobile chapter map, responsive layout, and reduced-motion support
- mapped further reading for William Shotts, Bash, POSIX, GNU manuals, man-pages, and systemd
- a curated video path from MIT Missing Semester, Learn Linux TV, linuxhint, and freeCodeCamp
- three repo-scoped AI tutor skills for onboarding, one-chapter lessons, and structured understanding checks
- Git-trackable notes, sources, quiz mistakes, chapter scores, sessions, and an 84-day Markdown contribution matrix
- a standard-library-only progress CLI plus a GitHub Actions consistency check

## Course map

| Part | Chapters | Focus |
| --- | ---: | --- |
| Foundations | 1–2 | architecture, command anatomy, argv, resolution, status |
| Shell Grammar | 3–4 | quoting, expansion, streams, redirection, pipelines, lists |
| Files & Search | 5–8 | paths, links, mutation safety, permissions, find, metadata |
| Text Interface | 9–12 | records, regex, grep, filters, sed, awk |
| Running Systems | 13–16 | processes, systemd, logs, networks, storage, packages |
| Bash Programs | 17–20 | scripts, parameters, arrays, tests, loops, reliability, debugging |

## Run locally

Requirements: Node.js 22.13 or later.

```bash
npm ci
npm run dev
```

The learner's progress is stored only in that browser under the key `linux-hacker-academy-v1`. No account or remote database is required.

## Clone and learn with a local AI tutor

The repository is also a durable learning workbench. Browser progress remains private to one browser; the local tutor writes progress to normal files that you can review, commit, clone elsewhere, and push to your own GitHub repository.

### 1. Fork or create your copy

Fork the repository on GitHub, or create an empty repository for this source. Then clone your copy:

```bash
git clone https://github.com/YOU/linux-hacker-academy.git
cd linux-hacker-academy
```

### 2. Start Codex in the repository

Codex discovers repository skills under `.agents/skills`. Start the CLI from the repository root:

```bash
codex
```

Then invoke:

```text
$start-linux-learning
$learn-linux
$check-linux-understanding
```

- `$start-linux-learning` sets a mission, realistic pace, goal, and starting chapter.
- `$learn-linux` teaches one chapter, runs safe practice and a quiz, then records notes, sources, scores, and every mistake.
- `$check-linux-understanding` asks eight source-grounded questions—four conceptual and four practical—and adds gaps to the retrieval queue.

The same files can be copied into another agent's skill directory:

```bash
# Claude Code layout
python3 scripts/install_learning_skills.py --host claude

# Cursor layout
python3 scripts/install_learning_skills.py --host cursor

# Any compatible custom skill directory
python3 scripts/install_learning_skills.py --target /path/to/skills
```

The installer refuses to replace an existing skill unless `--force` is supplied.

### 3. Inspect and manage progress

```bash
python3 scripts/academy.py status
python3 scripts/academy.py render
python3 scripts/academy.py verify
```

The tutor uses the same CLI for structured updates:

```bash
python3 scripts/academy.py note --chapter 1 --text "A command becomes argv plus shell grammar."
python3 scripts/academy.py mistake --chapter 1 \
  --question "What parses a pipeline?" \
  --learner-answer "The kernel" \
  --correct-answer "The shell" \
  --explanation "The shell parses operators before launching programs."
python3 scripts/academy.py source \
  --title "Bash Reference Manual" \
  --url "https://www.gnu.org/software/bash/manual/bash.html" \
  --note "Confirmed the parsing and pipeline model."
python3 scripts/academy.py record --chapter 1 --score 4 --total 5 \
  --summary "Can separate shell grammar from command arguments."
```

### 4. Review, commit, and push the checkpoint

The tutor never pushes automatically. Review the diff, validate the generated views, and create a small learning checkpoint:

```bash
git diff -- LEARNING.md learning/
python3 scripts/academy.py verify
git add LEARNING.md learning/
git commit -m "learn(chapter-01): record session"
git push
```

This makes learning activity visible as ordinary Git history and keeps it portable between computers.

## Learning workbench file map

| Path | Role |
| --- | --- |
| `AGENTS.md` | Repository-wide tutor rules, safety boundaries, durable record, and checkpoint policy |
| `.agents/skills/start-linux-learning/SKILL.md` | Short onboarding and placement workflow |
| `.agents/skills/learn-linux/SKILL.md` | One interactive lesson with recall, practice, quiz, notes, sources, and mistakes |
| `.agents/skills/check-linux-understanding/SKILL.md` | Eight-question assessment and review workflow |
| `learning/state.json` | Canonical structured learning state |
| `LEARNING.md` | GitHub-readable mission, current position, chapter table, and review queue |
| `learning/PROGRESS.md` | 84-day contribution matrix, recent sessions, and complete chapter matrix |
| `learning/notes/` | Dated notes for each studied chapter |
| `learning/reviews/mistakes.md` | Wrong/partial answers, corrections, explanations, and review state |
| `learning/sources.md` | Additional sources actually used by the local tutor |
| `scripts/academy.py` | Deterministic state, render, and verification CLI |

## Publish with GitHub Pages

The repository includes `.github/workflows/pages.yml`. To deploy:

1. Create a GitHub repository and push this project to its `main` branch.
2. Open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Run the **Deploy Linux Hacker Academy** workflow, or push a new commit.

The workflow runs `npm run build:github-pages` and deploys the static `github-dist` directory. The static build uses relative asset paths, so it works on a project Pages URL such as `https://USER.github.io/REPOSITORY/`.

To test the static artifact locally:

```bash
npm run build:github-pages
npx serve github-dist
```

## Content model

Course content lives in `app/course-data.ts`. Each lesson contains:

- metadata and learning objective
- two-part detailed explanation
- a transferable mental model
- four concept definitions
- an annotated command example
- three practice tasks with hints
- one four-option quiz and explanation
- chapter-specific reading and video mappings

The interactive experience lives in `app/page.tsx`; the hacker terminal design system is in `app/globals.css`.

## Source stack

The explanations are original and synthesize the attached handbook with the following authoritative or primary references:

- [The Linux Command Line, Seventh Internet Edition — William Shotts](https://linuxcommand.org/tlcl.php)
- [GNU Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html)
- [POSIX.1-2024, Shell and Utilities](https://pubs.opengroup.org/onlinepubs/9799919799/)
- [GNU Coreutils Manual](https://www.gnu.org/software/coreutils/manual/coreutils.html)
- [GNU Findutils Manual](https://www.gnu.org/software/findutils/manual/html_mono/find.html)
- [GNU grep Manual](https://www.gnu.org/software/grep/manual/grep.html)
- [GNU Awk Manual](https://www.gnu.org/software/gawk/manual/gawk.html)
- [Linux man-pages project](https://man7.org/linux/man-pages/)
- [systemd documentation](https://systemd.io/)
- [OverTheWire Bandit](https://overthewire.org/wargames/bandit/)
- [MIT Missing Semester — The Shell](https://missing.csail.mit.edu/2020/course-shell/)
- [MIT Missing Semester — Shell Tools and Scripting](https://missing.csail.mit.edu/2020/shell-tools/)

The local AI workbench is an original Linux-course adaptation inspired by the lesson/skill/state/evidence pattern in [AI Engineering from Scratch](https://github.com/rohitg00/ai-engineering-from-scratch). This repository does not copy that project's curriculum; it applies the reusable workflow to the Linux academy's own content and safety model.

## Safety model

The in-app command decoder is a text-pattern simulator; it does not run commands. Practice instructions use a learner-created lab directory, separate observation from mutation, prefer previews and read-only inspection, and avoid storage-changing recipes. Always consult the installed `man`, `info`, Bash `help`, and `--version` output because implementations and distribution versions differ.

## License note

The application code and original academy explanations may be adapted for this project. Third-party books, videos, names, and documentation retain their own licenses and copyrights; links do not redistribute their contents.
