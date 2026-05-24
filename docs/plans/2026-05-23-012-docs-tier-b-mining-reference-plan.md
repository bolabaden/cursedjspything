---
title: "docs: Tier B Lib/test reference mining guide"
type: docs
status: completed
date: 2026-05-23
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Tier B Lib/test reference mining guide

## Summary

Add a knowledgebase doc cataloguing Tier B CPython `Lib/test` modules (`test_descr.py`, `test_class.py`, `test_types.py`) with pyrt relevance tiers, out-of-scope boundaries, and near-term golden/Vitest targets — reference only, no bulk port.

---

## Problem Frame

LIVING-PLAN lists Tier B reference mining as next work after Tier A completion. `mine-lib-tests.sh` lists Tier B filenames but lacks actionable guidance for maintainers.

---

## Requirements

- R1. Create `docs/knowledgebase/50-execution/tier-b-lib-test-reference.md` with module summaries and pyrt mapping
- R2. Link from `cpython-reference-submodule.md`
- R3. Fix `mine-lib-tests.sh` non-zero exit when `rg NotImplemented` misses (set -e safety)
- R4. Update LIVING-PLAN delta
- R5. Merge PR #10 (golden Tier A expansion) if CI green

---

## Scope Boundaries

- Documentation + script robustness only
- No new Vitest ports or golden cases in this slice
- Do not claim Tier B coverage

---

## Implementation Units

- U1. `docs/knowledgebase/50-execution/tier-b-lib-test-reference.md`
- U2. `cpython-reference-submodule.md` cross-link
- U3. `scripts/cpython/mine-lib-tests.sh` exit fix + Tier A complete note
- U4. LIVING-PLAN

---

## Test Scenarios

- T1. `bash scripts/cpython/mine-lib-tests.sh` exits 0 with initialized submodule
- T2. Doc paths are repo-relative and evidence-labeled

---

## Sources & References

- `vendor/cpython/Lib/test/test_descr.py`, `test_class.py`, `test_types.py`
- `scripts/cpython/mine-lib-tests.sh`
- Tier A completion in `test/cpython-derived/`
