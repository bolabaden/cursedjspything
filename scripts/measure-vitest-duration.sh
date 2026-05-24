#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
LOG="$(mktemp /tmp/vitest-measure.XXXXXX.log)"
trap 'rm -f "$LOG"' EXIT
start_ns=$(date +%s%N)
passed=0
npm test >"$LOG" 2>&1 && passed=1
end_ns=$(date +%s%N)
vitest_seconds=$(awk "BEGIN {printf \"%.3f\", ($end_ns - $start_ns) / 1000000000}")
test_count=$(grep -Eo '[0-9]+ passed' "$LOG" | tail -1 | grep -Eo '^[0-9]+' || echo 0)
if [ "$passed" -eq 1 ] && [ "$test_count" -eq 0 ]; then
  passed=0
fi
printf '{"vitest_seconds":%s,"test_pass_rate":%s,"tests_passed":%s,"test_count":%s}\n' "$vitest_seconds" "$passed" "$passed" "$test_count"
exit "$((1 - passed))"
