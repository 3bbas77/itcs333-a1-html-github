#!/usr/bin/env bash
# ITCS333 A1 — git-workflow checks (rubric checks 7 & 8). Run at grading time
# against a FULL clone of the fork. Prints CHECK lines in the standard format.
set -euo pipefail
cd "$(dirname "$0")/.."

# Check 7 (20 pts): >= 3 commits with non-trivial messages.
commits=$(git log --format='%s' 2>/dev/null || true)
count=$(printf '%s\n' "$commits" | grep -cve '^\s*$' || true)
trivial=$(printf '%s\n' "$commits" | grep -ciE '^(update|fix|change|asdf|test|wip|a|commit|initial|\.+|x+)$' || true)
if [ "$count" -ge 3 ] && [ "$trivial" -lt "$count" ]; then
  echo "CHECK git_history PASS 20/20"
  g7=20
else
  echo "CHECK git_history FAIL 0/20 -- need >=3 meaningful commits (found $count)"
  g7=0
fi

# Check 8 (10 pts): >= 1 pull request merged from a feature branch.
# Merged PRs on GitHub create merge commits titled "Merge pull request #...".
merges=$(git log --merges --format='%s' 2>/dev/null | grep -ciE 'merge pull request' || true)
if [ "$merges" -ge 1 ]; then
  echo "CHECK merged_pr PASS 10/10"
  g8=10
else
  echo "CHECK merged_pr FAIL 0/10 -- no merged pull request found"
  g8=0
fi

echo "GIT_TOTAL $((g7 + g8))/30"
