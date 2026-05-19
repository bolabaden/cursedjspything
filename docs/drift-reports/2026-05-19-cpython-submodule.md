# Drift Report — CPython submodule proposal (2026-05-19)

## Drift Report

- **Surface:** Parity claims vs verification mechanism  
- **Observed:** `npm test` (Vitest) and `npm run golden` (~11 JSON keys/version); no `vendor/cpython` before this change  
- **Claimed:** COMPATIBILITY cites CPython `Objects/*.c` URLs; STRATEGY metric is golden pass rate  
- **Severity:** medium  
- **Remediation:** Submodule as **reference only**; expand golden + `test/cpython-derived/`; do not run `Lib/test` in CI  
- **Verification command:** `npm run golden && npm test`

## Drift Report

- **Surface:** Plan R3 vs CPython list `__eq__` semantics  
- **Observed:** CPython `Lib/test/test_richcmp.py` `ListTest.test_goodentry` — list `<` uses lexicographic compare; pyrt `list` has no `__lt__`  
- **Claimed:** Earlier plan text suggested propagating `NotImplemented` from container `__eq__`  
- **Severity:** low (resolved in tier-1 slice: element `NotImplemented` → unequal, matching CPython list equality)  
- **Remediation:** Document list ordering as out of scope until `list.__lt__` exists; do not port `ListTest` ordering to Vitest without implementation  
- **Verification command:** `npx tsx -e "import { lt, pyList, pyInt } from './src/index.ts'; lt(pyList([]), pyList([]))"`

## Drift Report

- **Surface:** Test count in KB  
- **Observed:** 142 Vitest tests after tier-1 continuation + ne/tuple coverage  
- **Claimed:** `parity-gaps-priorities.md` previously cited 118  
- **Severity:** low  
- **Remediation:** Updated in tier-1 docs pass; refresh after cpython-derived tests land  
- **Verification command:** `npm test 2>&1 | tail -5`

## Drift Report

- **Surface:** Submodule vs CI Python matrix  
- **Observed:** Submodule pinned `v3.14.0`; CI golden uses 3.10 / 3.12 / 3.14 **installed** interpreters  
- **Claimed:** Risk of assuming submodule tag equals CI runtime  
- **Severity:** medium  
- **Remediation:** `scripts/cpython/parity-surface.json` records pin; golden remains oracle on PATH Python  
- **Verification command:** `python3.14 scripts/golden/cases.py | jq .rich_lt_both_not_impl_raises`

## Open

- **Surface:** Bulk `Lib/test` port  
- **Observed:** ~1,244 `Lib/test/*.py` files in submodule  
- **Claimed:** User ask to implement “any” CPython tests in TS  
- **Severity:** high if interpreted literally  
- **Remediation:** Explicit OUT OF SCOPE in `cpython-reference-submodule.md`; Tier A manifest only  
- **Verification command:** `wc -l vendor/cpython/Lib/test/test_*.py | tail -1` (after submodule init)
