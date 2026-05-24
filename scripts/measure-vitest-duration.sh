#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
LOG="$(mktemp /tmp/vitest-measure.XXXXXX.log)"
trap 'rm -f "$LOG"' EXIT
start_ns=$(date +%s%N)
if npm test >"$LOG" 2>&1; then
  passed=1
else
  passed=0
fi
end_ns=$(date +%s%N)
vitest_seconds=$(awk "BEGIN {printf \"%.3f\", ($end_ns - $start_ns) / 1000000000}")
test_count=$(grep -Eo '[0-9]+ passed' "$LOG" | tail -1 | grep -Eo '^[0-9]+' || echo 0)
printf '{"vitest_seconds":%s,"test_pass_rate":%s,"tests_passed":%s,"test_count":%s}\n' "$vitest_seconds" "$passed" "$passed" "$test_count"
