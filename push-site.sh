#!/bin/bash
set -euo pipefail

commit_message="${1:-Update website content}"
repo_url="${2:-https://github.com/Sakura7274/jt-love-story.git}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git init
  git checkout -b main >/dev/null 2>&1 || true
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "$repo_url"
fi

if command -v gh >/dev/null 2>&1; then
  gh auth setup-git >/dev/null 2>&1 || true
fi

git add .

if git diff --cached --quiet; then
  echo "No changes to commit."
  exit 0
fi

git commit -m "$commit_message"
git push -u origin main

echo "Website pushed successfully. GitHub Pages should update shortly."
