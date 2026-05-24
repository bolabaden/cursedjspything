#!/usr/bin/env bash
# List Lib/test modules relevant to pyrt parity (reference mining only).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CPY="${ROOT}/vendor/cpython"
if [[ ! -d "${CPY}/Lib/test" ]]; then
  echo "Missing ${CPY}/Lib/test — run: git submodule update --init vendor/cpython" >&2
  exit 1
fi
TAG="$(git -C "${CPY}" describe --tags --always 2>/dev/null || echo unknown)"
echo "# CPython Lib/test mining report (${TAG})"
echo
echo "## Tier A (data-model / rich compare) — start here"
TIER_A=(
  test_richcmp.py
  test_compare.py
  test_operator.py
  test_isinstance.py
  test_contains.py
)
for f in "${TIER_A[@]}"; do
  path="${CPY}/Lib/test/${f}"
  if [[ -f "${path}" ]]; then
    lines=$(wc -l < "${path}")
    echo "- ${f} (${lines} lines)"
    rg -n "^\s+def test_" "${path}" 2>/dev/null | head -8 | sed 's/^/    /' || true
    if [[ $(rg -c "^\s+def test_" "${path}" 2>/dev/null || echo 0) -gt 8 ]]; then
      echo "    … ($(rg -c '^\s+def test_' "${path}") tests total)"
    fi
  fi
done
echo
echo "## Tier A keyword hits (NotImplemented / rich compare)"
for f in "${TIER_A[@]}"; do
  path="${CPY}/Lib/test/${f}"
  [[ -f "${path}" ]] || continue
  hits=$(rg -n "NotImplemented" "${path}" 2>/dev/null | wc -l)
  echo "- ${f}: ${hits} NotImplemented references"
done
echo
echo "## Tier B (reference only — heavy test.support / C-API)"
for f in test_descr.py test_class.py test_types.py; do
  path="${CPY}/Lib/test/${f}"
  [[ -f "${path}" ]] && echo "- ${f} ($(wc -l < "${path}") lines)"
done
echo
echo "## Next ports (suggested)"
cat <<'EOF'
- test/cpython-derived/richcmp-number.test.ts  ← test_richcmp.NumberTest (done)
- test/cpython-derived/compare-ne.test.ts      ← test_compare ne delegation (done)
- test/cpython-derived/richcmp-incomparable.test.ts ← Rev/Incomparable (done)
- test/cpython-derived/operator-int-float.test.ts ← test_operator int/float (done)
- test/cpython-derived/contains-protocol.test.ts ← test_contains (done)
- test/cpython-derived/isinstance-protocol.test.ts ← test_isinstance (done)
- golden keys from test_richcmp Incomparable / Rev (done in golden harness)
- Tier B next: test_descr.py, test_class.py (reference only)
EOF
