#!/bin/bash
set -euo pipefail

commit_message="${1:-Update website content}"
repo_url="${2:-https://github.com/Sakura7274/jt-love-story.git}"

# Prefer Homebrew-installed git when available to avoid macOS Xcode CLI tool issues.
if command -v /opt/homebrew/bin/git >/dev/null 2>&1; then
  GIT_CMD="/opt/homebrew/bin/git"
elif command -v /usr/local/bin/git >/dev/null 2>&1; then
  GIT_CMD="/usr/local/bin/git"
elif command -v git >/dev/null 2>&1; then
  GIT_CMD="git"
else
  echo "Git is not installed. Please install Git and rerun this script."
  exit 1
fi

if ! "$GIT_CMD" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  "$GIT_CMD" init
  "$GIT_CMD" checkout -b main >/dev/null 2>&1 || true
fi

if ! "$GIT_CMD" remote get-url origin >/dev/null 2>&1; then
  "$GIT_CMD" remote add origin "$repo_url"
fi

if command -v gh >/dev/null 2>&1; then
  gh auth setup-git >/dev/null 2>&1 || true
fi

"$GIT_CMD" add .

if "$GIT_CMD" diff --cached --quiet; then
  echo "No changes to commit."
  exit 0
fi

"$GIT_CMD" commit -m "$commit_message"
"$GIT_CMD" push -u origin main

echo "Website pushed successfully. GitHub Pages should update shortly."
