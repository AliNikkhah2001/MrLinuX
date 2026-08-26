#!/usr/bin/env python3
"""Git-trackable learning state for Linux Hacker Academy."""

from __future__ import annotations

import argparse
import json
import sys
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LEARNING_DIR = ROOT / "learning"
STATE_PATH = LEARNING_DIR / "state.json"
LEARNING_PATH = ROOT / "LEARNING.md"
PROGRESS_PATH = LEARNING_DIR / "PROGRESS.md"
SOURCES_PATH = LEARNING_DIR / "sources.md"
MISTAKES_PATH = LEARNING_DIR / "reviews" / "mistakes.md"
NOTES_DIR = LEARNING_DIR / "notes"

CHAPTERS = [
    (1, "mental-model", "Why commands look impossible"),
    (2, "command-anatomy", "Command anatomy & execution"),
    (3, "quoting-expansion", "Tokens, quoting & expansion"),
    (4, "streams-pipelines", "Streams, pipes & control lists"),
    (5, "filesystem-tree", "The filesystem as a tree"),
    (6, "file-operations", "Copy, move, delete & archive"),
    (7, "permissions", "Permissions & least privilege"),
    (8, "find-metadata", "Finding files & metadata"),
    (9, "text-regex", "Text, records & regex"),
    (10, "grep-selection", "Selection with grep"),
    (11, "filter-toolkit", "The core filter toolkit"),
    (12, "sed-awk", "Transforming with sed & awk"),
    (13, "processes-signals", "Processes, jobs & signals"),
    (14, "systemd-logs", "Services & logs with systemd"),
    (15, "networking-cli", "Networking from the CLI"),
    (16, "storage-packages", "Storage, packages & system facts"),
    (17, "script-fundamentals", "Script fundamentals & data"),
    (18, "decisions-loops", "Tests, loops & functions"),
    (19, "reliable-scripts", "Reliable scripts & boundaries"),
    (20, "fluency-system", "Discovery, debugging & fluency"),
]


def today() -> str:
    return date.today().isoformat()


def chapter_by_number(number: int) -> tuple[int, str, str]:
    try:
        return CHAPTERS[number - 1]
    except IndexError as exc:
        raise SystemExit("chapter must be between 1 and 20") from exc


def blank_state() -> dict:
    return {
        "version": 1,
        "profile": {
            "mission": "Build durable Linux command-line fluency.",
            "pace": "Set during $start-linux-learning.",
            "goal": "Explain commands, test safely, and verify evidence.",
        },
        "chapters": [
            {
                "number": number,
                "id": chapter_id,
                "title": title,
                "status": "not-started",
                "best_score": None,
                "last_studied": None,
                "summary": "",
            }
            for number, chapter_id, title in CHAPTERS
        ],
        "activity": {},
        "matrix_end": today(),
        "sessions": [],
        "mistakes": [],
        "sources": [],
    }


def ensure_directories() -> None:
    NOTES_DIR.mkdir(parents=True, exist_ok=True)
    MISTAKES_PATH.parent.mkdir(parents=True, exist_ok=True)


def normalize_state(state: dict) -> dict:
    template = blank_state()
    for key, value in template.items():
        state.setdefault(key, value)
    state["profile"] = {**template["profile"], **state.get("profile", {})}
    known = {item.get("id"): item for item in state.get("chapters", [])}
    state["chapters"] = [
        {**item, **known.get(item["id"], {})}
        for item in template["chapters"]
    ]
    return state


def load_state(create: bool = True) -> dict:
    ensure_directories()
    if not STATE_PATH.exists():
        if not create:
            raise SystemExit("learning/state.json is missing; run academy.py init")
        state = blank_state()
        write_state(state)
        return state
    try:
        return normalize_state(json.loads(STATE_PATH.read_text(encoding="utf-8")))
    except (json.JSONDecodeError, OSError) as exc:
        raise SystemExit(f"cannot read {STATE_PATH.relative_to(ROOT)}: {exc}") from exc


def write_state(state: dict) -> None:
    ensure_directories()
    STATE_PATH.write_text(json.dumps(state, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def touch_activity(state: dict, amount: int = 1) -> None:
    state["activity"][today()] = min(int(state["activity"].get(today(), 0)) + amount, 4)
    state["matrix_end"] = today()


def score_label(chapter: dict) -> str:
    score = chapter.get("best_score")
    return "—" if score is None else f"{score}%"


def profile_block(state: dict) -> str:
    profile = state["profile"]
    return (
        f"- **Mission:** {profile['mission']}\n"
        f"- **Pace:** {profile['pace']}\n"
        f"- **Goal:** {profile['goal']}"
    )


def chapter_table(state: dict) -> str:
    rows = ["| Ch. | Chapter | Status | Best | Last studied |", "| ---: | --- | --- | ---: | --- |"]
    for item in state["chapters"]:
        marker = "✅ complete" if item["status"] == "complete" else "⬜ not started"
        if item["status"] == "in-progress":
            marker = "🟨 in progress"
        rows.append(
            f"| {item['number']:02d} | {item['title']} | {marker} | {score_label(item)} | {item.get('last_studied') or '—'} |"
        )
    return "\n".join(rows)


def matrix(state: dict) -> str:
    end = date.fromisoformat(state.get("matrix_end", today()))
    current_week = end - timedelta(days=end.weekday())
    start = current_week - timedelta(weeks=11)
    days = [start + timedelta(days=index) for index in range(84)]
    weeks = [days[index:index + 7] for index in range(0, 84, 7)]
    header = "| day | " + " | ".join(f"W{index + 1:02d}" for index in range(12)) + " |"
    divider = "| --- | " + " | ".join("---" for _ in range(12)) + " |"
    rows = [header, divider]
    for day_index in range(7):
        cells = []
        for week in weeks:
            current = week[day_index]
            level = int(state["activity"].get(current.isoformat(), 0))
            cells.append("·" if current > end else ("⬛" if level == 0 else "🟩"))
        rows.append(f"| {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day_index]} | " + " | ".join(cells) + " |")
    return "\n".join(rows)


def review_rows(state: dict, limit: int | None = None) -> str:
    pending = [item for item in state["mistakes"] if not item.get("reviewed")]
    if limit is not None:
        pending = pending[-limit:]
    if not pending:
        return "No pending mistakes. Misses will appear here automatically after an AI-led quiz."
    rows = ["| ID | Chapter | Prompt | Review |", "| --- | ---: | --- | --- |"]
    for item in pending:
        prompt = str(item["question"]).replace("|", "\\|")
        rows.append(f"| `{item['id']}` | {item['chapter']:02d} | {prompt} | {item['explanation']} |")
    return "\n".join(rows)


def learning_text(state: dict) -> str:
    completed = sum(item["status"] == "complete" for item in state["chapters"])
    return f"""# Learning control file

> This file is a Git-visible view of `learning/state.json`. Use `$start-linux-learning`, `$learn-linux`, or `$check-linux-understanding` in Codex after cloning the repository.

## Mission

{profile_block(state)}

## Current position

- **Completed:** {completed}/20 chapters
- **Next chapter:** {next_chapter_text(state)}
- **Pending reviews:** {sum(not item.get('reviewed') for item in state['mistakes'])}

## Progress log

{chapter_table(state)}

## Review queue

{review_rows(state, 8)}

## Session protocol

1. Start Codex in this repository.
2. Invoke `$learn-linux` for one interactive chapter.
3. Let the tutor record notes, sources, scores, and mistakes.
4. Review the generated files, then commit and push the learning checkpoint yourself.

Generated by `python3 scripts/academy.py render`.
"""


def progress_text(state: dict) -> str:
    sessions = state["sessions"][-10:]
    session_lines = [
        f"- **{item['date']} · chapter {item['chapter']:02d}:** {item['score']}% — {item['summary']}"
        for item in reversed(sessions)
    ] or ["- No recorded learning sessions yet."]
    return f"""# Git learning progress

## 84-day contribution matrix

{matrix(state)}

Green squares contain one or more learning actions. Exact daily intensity remains in `state.json`.

## Recent sessions

{chr(10).join(session_lines)}

## Full chapter matrix

{chapter_table(state)}

## Mistakes awaiting review

{review_rows(state)}

Generated by `python3 scripts/academy.py render`.
"""


def sources_text(state: dict) -> str:
    lines = [
        "# Additional learning sources",
        "",
        "Chapter-mapped primary sources remain in `app/course-data.ts`. AI tutors append only sources actually used during a session.",
        "",
    ]
    if not state["sources"]:
        lines.append("No additional sources recorded yet.")
    else:
        for item in state["sources"]:
            lines.extend([f"## {item['title']}", "", f"- URL: {item['url']}", f"- Added: {item['date']}", f"- Why it matters: {item['note']}", ""])
    return "\n".join(lines).rstrip() + "\n"


def mistakes_text(state: dict) -> str:
    lines = [
        "# Mistakes and retrieval review",
        "",
        "Wrong or partial answers are recorded here by the local AI tutor. Review the reasoning, then mark an item with `python3 scripts/academy.py review ID`.",
        "",
    ]
    if not state["mistakes"]:
        lines.append("No mistakes recorded yet.")
    else:
        for item in reversed(state["mistakes"]):
            status = "reviewed" if item.get("reviewed") else "pending"
            lines.extend([
                f"## {item['id']} · chapter {item['chapter']:02d} · {status}",
                "",
                f"- **Question:** {item['question']}",
                f"- **Learner answer:** {item['learner_answer']}",
                f"- **Correct answer:** {item['correct_answer']}",
                f"- **Explanation:** {item['explanation']}",
                f"- **Recorded:** {item['date']}",
                "",
            ])
    return "\n".join(lines).rstrip() + "\n"


def render_files(state: dict, check: bool = False) -> bool:
    targets = {
        LEARNING_PATH: learning_text(state),
        PROGRESS_PATH: progress_text(state),
        SOURCES_PATH: sources_text(state),
        MISTAKES_PATH: mistakes_text(state),
    }
    stale = []
    for path, content in targets.items():
        if not path.exists() or path.read_text(encoding="utf-8") != content:
            stale.append(path)
            if not check:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(content, encoding="utf-8")
    if check and stale:
        print("generated learning files are stale:")
        for path in stale:
            print(f"- {path.relative_to(ROOT)}")
        return False
    if not check:
        print("rendered LEARNING.md and learning progress views")
    return True


def next_chapter_text(state: dict) -> str:
    item = next((chapter for chapter in state["chapters"] if chapter["status"] != "complete"), None)
    return "course complete" if item is None else f"{item['number']:02d} — {item['title']}"


def command_init(args: argparse.Namespace) -> None:
    state = load_state()
    for key in ("mission", "pace", "goal"):
        value = getattr(args, key, None)
        if value:
            state["profile"][key] = value
    write_state(state)
    render_files(state)
    print(f"initialized: next chapter {next_chapter_text(state)}")


def command_status(_: argparse.Namespace) -> None:
    state = load_state()
    completed = sum(item["status"] == "complete" for item in state["chapters"])
    pending = sum(not item.get("reviewed") for item in state["mistakes"])
    print(f"progress: {completed}/20 chapters")
    print(f"next: {next_chapter_text(state)}")
    print(f"review queue: {pending}")


def command_record(args: argparse.Namespace) -> None:
    state = load_state()
    chapter = state["chapters"][chapter_by_number(args.chapter)[0] - 1]
    percent = round((args.score / args.total) * 100)
    chapter["status"] = "complete" if percent >= 70 else "in-progress"
    chapter["best_score"] = max(chapter.get("best_score") or 0, percent)
    chapter["last_studied"] = today()
    chapter["summary"] = args.summary
    state["sessions"].append({"date": today(), "chapter": args.chapter, "score": percent, "summary": args.summary})
    touch_activity(state, 2)
    write_state(state)
    render_files(state)
    print(f"recorded chapter {args.chapter:02d}: {percent}% ({chapter['status']})")


def command_note(args: argparse.Namespace) -> None:
    state = load_state()
    _, chapter_id, title = chapter_by_number(args.chapter)
    path = NOTES_DIR / f"{args.chapter:02d}-{chapter_id}.md"
    if not path.exists():
        path.write_text(f"# Chapter {args.chapter:02d}: {title}\n\n", encoding="utf-8")
    with path.open("a", encoding="utf-8") as handle:
        handle.write(f"## {today()}\n\n{args.text.strip()}\n\n")
    touch_activity(state)
    write_state(state)
    print(f"appended note to {path.relative_to(ROOT)}")


def command_mistake(args: argparse.Namespace) -> None:
    state = load_state()
    chapter_by_number(args.chapter)
    sequence = len(state["mistakes"]) + 1
    mistake_id = f"m-{today().replace('-', '')}-{sequence:03d}"
    state["mistakes"].append({
        "id": mistake_id,
        "chapter": args.chapter,
        "question": args.question,
        "learner_answer": args.learner_answer,
        "correct_answer": args.correct_answer,
        "explanation": args.explanation,
        "date": today(),
        "reviewed": False,
    })
    touch_activity(state)
    write_state(state)
    render_files(state)
    print(f"added review item {mistake_id}")


def command_review(args: argparse.Namespace) -> None:
    state = load_state()
    item = next((entry for entry in state["mistakes"] if entry["id"] == args.id), None)
    if item is None:
        raise SystemExit(f"unknown mistake id: {args.id}")
    item["reviewed"] = True
    item["reviewed_on"] = today()
    touch_activity(state)
    write_state(state)
    render_files(state)
    print(f"marked {args.id} reviewed")


def command_source(args: argparse.Namespace) -> None:
    state = load_state()
    existing = next((item for item in state["sources"] if item["url"] == args.url), None)
    entry = {"title": args.title, "url": args.url, "note": args.note, "date": today()}
    if existing:
        existing.update(entry)
    else:
        state["sources"].append(entry)
    write_state(state)
    render_files(state)
    print(f"recorded source: {args.title}")


def command_render(args: argparse.Namespace) -> None:
    if not render_files(load_state(), check=args.check):
        raise SystemExit(1)


def command_verify(_: argparse.Namespace) -> None:
    state = load_state(create=False)
    errors = []
    if state.get("version") != 1:
        errors.append("state version must be 1")
    actual_ids = [item.get("id") for item in state.get("chapters", [])]
    expected_ids = [item[1] for item in CHAPTERS]
    if actual_ids != expected_ids:
        errors.append("chapter records do not match the 20-chapter curriculum")
    for item in state.get("mistakes", []):
        if not {"id", "chapter", "question", "learner_answer", "correct_answer", "explanation", "reviewed"}.issubset(item):
            errors.append(f"mistake record is incomplete: {item.get('id', 'unknown')}")
    if not render_files(state, check=True):
        errors.append("generated files need academy.py render")
    required = [ROOT / "AGENTS.md", ROOT / ".agents/skills/learn-linux/SKILL.md", ROOT / ".agents/skills/check-linux-understanding/SKILL.md"]
    for path in required:
        if not path.exists():
            errors.append(f"missing {path.relative_to(ROOT)}")
    if errors:
        print("verification failed:")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)
    print("verified: 20 chapters, structured state, generated views, and tutor skills")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)

    init_parser = subparsers.add_parser("init", help="create or update the learning profile")
    init_parser.add_argument("--mission")
    init_parser.add_argument("--pace")
    init_parser.add_argument("--goal")
    init_parser.set_defaults(func=command_init)

    status_parser = subparsers.add_parser("status", help="show the next chapter and review count")
    status_parser.set_defaults(func=command_status)

    record_parser = subparsers.add_parser("record", help="record one chapter session")
    record_parser.add_argument("--chapter", type=int, required=True)
    record_parser.add_argument("--score", type=int, required=True)
    record_parser.add_argument("--total", type=int, required=True)
    record_parser.add_argument("--summary", required=True)
    record_parser.set_defaults(func=command_record)

    note_parser = subparsers.add_parser("note", help="append a dated chapter note")
    note_parser.add_argument("--chapter", type=int, required=True)
    note_parser.add_argument("--text", required=True)
    note_parser.set_defaults(func=command_note)

    mistake_parser = subparsers.add_parser("mistake", help="record a wrong or partial answer")
    mistake_parser.add_argument("--chapter", type=int, required=True)
    mistake_parser.add_argument("--question", required=True)
    mistake_parser.add_argument("--learner-answer", required=True)
    mistake_parser.add_argument("--correct-answer", required=True)
    mistake_parser.add_argument("--explanation", required=True)
    mistake_parser.set_defaults(func=command_mistake)

    review_parser = subparsers.add_parser("review", help="mark one mistake reviewed")
    review_parser.add_argument("id")
    review_parser.set_defaults(func=command_review)

    source_parser = subparsers.add_parser("source", help="add an actually used learning source")
    source_parser.add_argument("--title", required=True)
    source_parser.add_argument("--url", required=True)
    source_parser.add_argument("--note", required=True)
    source_parser.set_defaults(func=command_source)

    render_parser = subparsers.add_parser("render", help="regenerate Git-visible Markdown")
    render_parser.add_argument("--check", action="store_true")
    render_parser.set_defaults(func=command_render)

    verify_parser = subparsers.add_parser("verify", help="validate learning state and generated files")
    verify_parser.set_defaults(func=command_verify)
    return parser


def main() -> None:
    args = build_parser().parse_args()
    if getattr(args, "total", 1) <= 0:
        raise SystemExit("total must be greater than zero")
    if getattr(args, "score", 0) < 0 or getattr(args, "score", 0) > getattr(args, "total", 1):
        raise SystemExit("score must be between zero and total")
    args.func(args)


if __name__ == "__main__":
    main()
