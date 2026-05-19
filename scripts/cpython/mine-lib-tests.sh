#!/usr/bin/env bash
# List Lib/test modules relevant to pyrt parity (reference mining only).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CPY="${ROOT}/vendor/cpython"
if [[ ! -d "${CPY}/Lib/test" ]]; then
  echo "Missing ${CPY}/Lib/test — run: git submodule update --init vendor/cpython" >&2
  exit 1
fi
echo "# CPython Lib/test mining report ($(git -C "${CPY}" describe --tags --always 2>/dev/null || echo unknown))"
echo
echo "## Tier A (data-model / rich compare)"
for f in test_richcmp.py test_compare.py test_operator.py test_isinstance.py test_contains.py; do
  path="${CPY}/Lib/test/${f}"
  if [[ -f "${path}" ]]; then
    lines=$(wc -l < "${path}")
    echo "- ${f} (${lines} lines)"
  fi
done
echo
echo "## Keyword hits (NotImplemented, __eq__, lookupSpecial-adjacent)"
rg -l "NotImplemented|__richcmp__|richcompare" "${CPY}/Lib/test" --glob 'test_*.py' 2>/dev/null | head -20 || true
