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
- chapter search, mobile chapter map, responsive layout, and reduced-motion support
- mapped further reading for William Shotts, Bash, POSIX, GNU manuals, man-pages, and systemd
- a curated video path from MIT Missing Semester, Learn Linux TV, linuxhint, and freeCodeCamp

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

## Safety model

The in-app command decoder is a text-pattern simulator; it does not run commands. Practice instructions use a learner-created lab directory, separate observation from mutation, prefer previews and read-only inspection, and avoid storage-changing recipes. Always consult the installed `man`, `info`, Bash `help`, and `--version` output because implementations and distribution versions differ.

## License note

The application code and original academy explanations may be adapted for this project. Third-party books, videos, names, and documentation retain their own licenses and copyrights; links do not redistribute their contents.
