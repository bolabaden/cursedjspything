---
title: "feat: sequence repeat non-int TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/COMPATIBILITY_AND_GAPS.md §8.15 remaining gap
---

# Sequence repeat non-int TypeError evidence

## Summary

Add CPython-derived Vitest coverage proving **list**, **tuple**, and **str** `__mul__` reject **float** repeat counts via **`PyTypeError`**, and sync KB inventory for current test suite (220+ tests on main).

---

## Problem Frame

`sequenceRepeatCount` returns `null` for float operands; dispatch raises `PyTypeError` with `unsupported operand type(s) for *`. Behavior exists but lacks dedicated evidence; COMPATIBILITY §8.15 lists sequence vs unrelated scalar gaps. KB docs still cite 207–213 tests in places.

---

## Requirements

- R1. Add `test/cpython-derived/sequence-repeat-nonint.test.ts` (list/tuple/str × float)
- R2. Update COMPATIBILITY §8.15 evidence list
- R3. Update `validation-ladder.md` (add `operator-zerodivision`, `sequence-repeat-nonint`; 220 tests)
- R4. Update `runtime-overview.md` and `parity-gaps-priorities.md` test counts
- R5. LIVING-PLAN delta
- R6. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only — no runtime changes
- Do not chase CPython-exact message text (`can't multiply sequence by non-int`)

---

## Implementation Units

- U1. Vitest file
- U2. COMPATIBILITY + KB docs

---

## Test Scenarios

- T1–T3. list/tuple/str mul with `pyFloat(2)` throws `PyTypeError` with dispatch message

---

## Sources & References

- CPython `Lib/test/test_operator.py` / sequence repeat spirit
- `docs/plans/2026-05-24-027-feat-str-scalar-cross-type-evidence-plan.md`
