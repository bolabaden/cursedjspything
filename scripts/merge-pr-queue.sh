#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
VITEST_RESULTS="node_modules/.vite/vitest/da39a3ee5e6b4b0d3255bfef95601890afd80709/results.json"

resolve_conflicts() {
  python3 <<'PY'
import re, subprocess, pathlib

def read(path):
    return pathlib.Path(path).read_text()

def write(path, text):
    pathlib.Path(path).write_text(text)

def resolve_markers(text):
    while '<<<<<<<' in text:
        start = text.index('<<<<<<<')
        end = text.index('>>>>>>>', start)
        nl = text.index('\n', end)
        block = text[start:nl+1]
        head_m = re.search(r'<<<<<<<[^\n]*\n(.*?)=======', block, re.DOTALL)
        theirs_m = re.search(r'=======\n(.*?)>>>>>>> ', block, re.DOTALL)
        head = head_m.group(1).strip() if head_m else ''
        theirs = theirs_m.group(1).strip() if theirs_m else ''
        if head and theirs:
            merged = head + '\n\n' + theirs
        else:
            merged = head or theirs
        text = text[:start] + merged + '\n' + text[nl+1:]
    return text

def merge_compat(text):
    text = resolve_markers(text)
    # dedupe consecutive duplicate paragraphs in §8.17 area
    lines = text.splitlines()
    out = []
    prev = None
    for line in lines:
        if line == prev and line.strip() and not line.startswith('#'):
            continue
        out.append(line)
        prev = line
    return '\n'.join(out) + ('\n' if text.endswith('\n') else '')

unmerged = subprocess.check_output(['git', 'diff', '--name-only', '--diff-filter=U'], text=True).splitlines()
for path in unmerged:
    text = read(path)
    if path.endswith('LIVING-PLAN.md') or path.endswith('COMPATIBILITY_AND_GAPS.md'):
        text = merge_compat(text)
    else:
        text = resolve_markers(text)
    write(path, text)
    print('resolved', path)

if unmerged:
    remaining = subprocess.check_output(['git', 'diff', '--name-only', '--diff-filter=U'], text=True)
    if remaining.strip():
        print('STILL UNMERGED:', remaining)
        raise SystemExit(1)
PY
}

merge_one_pr() {
  local pr="$1"
  local branch
  branch=$(gh pr view "$pr" --json headRefName -q .headRefName)
  echo "========== PR #$pr ($branch) =========="
  git checkout main
  git pull origin main
  git checkout "$branch" 2>/dev/null || gh pr checkout "$pr"
  git pull origin "$branch" --no-rebase --no-edit 2>/dev/null || true
  git checkout -- "$VITEST_RESULTS" 2>/dev/null || true
  git fetch origin main
  if ! git merge origin/main --no-edit; then
    resolve_conflicts
    git add -A
    git commit -m "merge(main): resolve conflicts for PR #$pr"
  fi
  npm test
  git checkout -- "$VITEST_RESULTS" 2>/dev/null || true
  git push origin "$branch"
  for i in 1 2 3 4 5 6 7 8; do
    sleep 20
    if gh pr merge "$pr" --merge 2>/dev/null; then
      echo "merged PR #$pr"
      return 0
    fi
  done
  echo "FAILED merge PR #$pr"
  gh pr view "$pr" --json mergeable,mergeStateStatus,statusCheckRollup
  return 1
}

PRS=(35 36 37 38 39 40 41 42 43 45 46 49 50 51 52 53)
for pr in "${PRS[@]}"; do
  merge_one_pr "$pr" || exit 1
done
git checkout main && git pull origin main && npm test
echo "All PRs merged successfully."
