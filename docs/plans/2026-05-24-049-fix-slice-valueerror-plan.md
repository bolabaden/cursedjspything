---
title: "fix: slice step zero raises PyValueError"
type: fix
status: completed
date: 2026-05-24
origin: docs/COMPATIBILITY_AND_GAPS.md §8.7, §8.17 remaining gap
---

# Slice step zero ValueError parity

## Summary

Replace `RangeError("slice step cannot be zero")` in `sliceIndices` with **`PyValueError`** and CPython message text — continuing typed-exception normalization after plan 048 (`PyZeroDivisionError`).

---

## Problem Frame

`sliceIndices` in `src/runtime/collections/slice.ts` throws a JS `RangeError` when `step === 0`. CPython raises **`ValueError: slice step cannot be zero`** for list/tuple/str slice subscripts with zero step. `PyValueError` already exists in `errors.ts` and is exported from `lookup.ts` / `stable.ts`.

---

## Requirements

- R1. In `slice.ts`, throw `PyValueError("slice step cannot be zero")` instead of `RangeError`
- R2. Add Vitest coverage in `test/collections/slice-with.test.ts` (or dedicated cpython-derived file) for list and tuple slice with `step=0` via `getItem(list, pySlice(null, null, 0))`
- R3. Update COMPATIBILITY §8.7 to note typed `PyValueError`; LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- `sliceIndices` only — no changes to slice repr or golden JSON
- No new exception class

---

## Implementation Units

- U1. `slice.ts` — swap exception type
- U2. Vitest — list + tuple zero-step cases asserting `PyValueError` + message
- U3. COMPATIBILITY §8.7 + LIVING-PLAN

---

## Test Scenarios

- T1. `getItem(pyList([...]), pySlice(null, null, 0))` throws `PyValueError` with message `slice step cannot be zero`
- T2. Same for `pyTuple`
- T3. Normal slice still works (existing test unchanged)

---

## Sources & References

- CPython `Objects/sliceobject.c` / `Lib/test/test_slice.py` spirit
- `docs/plans/2026-05-24-048-fix-zerodivision-error-plan.md` (prior typed-exception pattern)
