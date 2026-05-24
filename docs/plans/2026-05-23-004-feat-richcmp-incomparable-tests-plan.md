---
title: "feat: CPython-derived richcmp Incomparable/Rev tests"
type: feat
status: completed
date: 2026-05-23
origin: docs/knowledgebase/LIVING-PLAN.md
---

# CPython-derived richcmp Incomparable/Rev tests

## Summary

Add Vitest coverage for `test_richcmp`-style `Rev` (reflected ordering) and `Incomparable` (both-sides `NotImplemented`) fixtures already used in the golden harness, so behavior is tested in unit tests independent of Python-installed golden runs.

---

## Problem Frame

Golden proves cross-runtime parity for two rich-compare edge cases, but LIVING-PLAN calls for Tier A `test_richcmp` ports beyond `NumberTest`. Unit tests should mirror golden fixture semantics for agents and CI without Python.

---

## Requirements

- R1. `Rev`: `lt(int, rev)` is true via reflected `__gt__`; `gt(rev, int)` is true
- R2. `Incomparable`: ordering ops (`lt`, `le`, `gt`, `ge`) between distinct instances raise `TypeError`
- R3. `Incomparable`: `eq`/`ne` use identity fallback (distinct instances not equal)
- R4. `int` vs `Incomparable` ordering raises `TypeError`
- R5. Update `mine-lib-tests.sh` and LIVING-PLAN

---

## Scope Boundaries

- No golden harness changes (fixtures already present)
- No compare.ts algorithm changes unless tests fail

---

## Implementation Units

- U1. `test/cpython-derived/richcmp-incomparable.test.ts`
- U2. Docs: `mine-lib-tests.sh`, LIVING-PLAN.md

---

## Sources & References

- `scripts/golden/cases.py` Rev/Incomparable fixtures
- CPython `Lib/test/test_richcmp.py` (Tier A reference)
