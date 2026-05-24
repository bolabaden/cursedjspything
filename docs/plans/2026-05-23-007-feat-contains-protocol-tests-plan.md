---
title: "feat: CPython-derived test_contains protocol ports"
type: feat
status: completed
date: 2026-05-23
origin: docs/knowledgebase/LIVING-PLAN.md
---

# CPython-derived test_contains protocol ports

## Summary

Port thin membership cases from CPython `Lib/test/test_contains.py` into Vitest, covering explicit `__contains__`, sequence `__getitem__` fallback, list/tuple builtins, str substring checks, and `__contains__ = None` blocking iteration fallback.

---

## Problem Frame

Tier A mining lists `test_contains.py` as the next unported module after operator/richcmp/compare work. pyrt `contains()` in `protocols.ts` already implements `__contains__` then iteration/`eq` fallback; this slice adds CPython-derived evidence and closes any gap for blocked `__contains__`.

---

## Requirements

- R1. Port `test_common_tests` core cases: custom `__contains__`, `__getitem__` seq fallback, non-container TypeError, str membership
- R2. Port list/tuple membership from `test_builtin_sequence_types` (skip `range` — no pyrt builtin)
- R3. Port `test_block_fallback` (`__contains__ = None` must raise TypeError, not iterate)
- R4. Fix `contains()` if R3 fails (explicit `null` slot blocks fallback)
- R5. Update `mine-lib-tests.sh` and LIVING-PLAN

---

## Scope Boundaries

- Skip `test_nonreflexive` (requires `test.support.NEVER_EQ`)
- Skip `Deviant1` mutation-during-compare case (Tier B stress)
- No golden harness changes

---

## Implementation Units

- U1. `test/cpython-derived/contains-protocol.test.ts`
- U2. `src/runtime/dispatch/protocols.ts` — only if R3 requires `null` slot guard
- U3. `scripts/cpython/mine-lib-tests.sh`, `validation-ladder.md`, `LIVING-PLAN.md`

---

## Test Scenarios

| Scenario | Expected |
|----------|----------|
| myset `__contains__` | `contains(b, 1)` true; `contains(b, 0)` false |
| seq `__getitem__` only | iteration fallback finds element |
| base_set no protocol | `contains` throws TypeError |
| str `'c' in 'abc'` | true/false via builtin |
| list/tuple int members | in/not in |
| BlockContains `__contains__ = null` | TypeError, not false |

---

## Sources & References

- `vendor/cpython/Lib/test/test_contains.py`
- `src/runtime/dispatch/protocols.ts` — `contains()`
- `test/dispatch/protocols.test.ts` — existing contains coverage
