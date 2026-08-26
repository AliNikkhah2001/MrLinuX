#!/usr/bin/env python3
"""Install the repo learning skills into another supported agent layout."""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / ".agents" / "skills"
HOST_TARGETS = {
    "codex": ROOT / ".agents" / "skills",
    "claude": ROOT / ".claude" / "skills",
    "cursor": ROOT / ".cursor" / "skills",
}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", choices=sorted(HOST_TARGETS), default="codex")
    parser.add_argument("--target", type=Path, help="custom skills directory; overrides --host")
    parser.add_argument("--force", action="store_true", help="replace an existing skill with the same name")
    args = parser.parse_args()

    target = args.target.expanduser().resolve() if args.target else HOST_TARGETS[args.host]
    target.mkdir(parents=True, exist_ok=True)
    if target.resolve() == SOURCE.resolve():
        print("Codex skills are already installed in .agents/skills")
        return

    installed = []
    for skill in sorted(path for path in SOURCE.iterdir() if (path / "SKILL.md").is_file()):
        destination = target / skill.name
        if destination.exists():
            if not args.force:
                raise SystemExit(f"refusing to replace {destination}; rerun with --force")
            shutil.rmtree(destination)
        shutil.copytree(skill, destination)
        installed.append(skill.name)

    print(f"installed {len(installed)} learning skills in {target}")
    for name in installed:
        print(f"- {name}")


if __name__ == "__main__":
    main()
