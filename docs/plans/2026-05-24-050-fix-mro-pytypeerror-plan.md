---
title: "fix: inconsistent C3 MRO raises PyTypeError"
type: fix
status: completed
date: 2026-05-24
origin: docs/COMPATIBILITY_AND_GAPS.md §8.17 remaining gap
---

# C3 MRO inconsistency TypeError parity

## Summary

Replace JS `TypeError` in `computeC3` / C3 `merge` with **`PyTypeError`** when linearization fails — aligning class-creation errors with the rest of the runtime exception model (plans 048–049).

---

## Problem Frame

`src/runtime/core/object.ts` `merge()` throws `new TypeError("Cannot create a consistent method resolution order (MRO)")` on inconsistent bases. `makeClass` and `PyType` construction call `computeC3`, so invalid inheritance surfaces a native JS exception instead of `PyTypeError`. `class.ts` already uses `PyTypeError` for metaclass conflict and `__prepare__` errors.

---

## Requirements

- R1. Import `PyTypeError` in `object.ts`; throw it from `merge()` with the same message text
- R2. Add Vitest in `test/core/object-model.test.ts`: classic inconsistent MRO (A: X,Y + B: Y,X → C(A,B) fails) asserts `PyTypeError` and message substring
- R3. Update COMPATIBILITY (§8.1 or §8.17) + LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Exception type swap only — no CPython-style `for bases A, B` message suffix
- No golden JSON changes

---

## Implementation Units

- U1. `object.ts` — `PyTypeError` in `merge`
- U2. `object-model.test.ts` — inconsistent MRO case
- U3. COMPATIBILITY + LIVING-PLAN

---

## Test Scenarios

- T1. `makeClass` with inconsistent diamond order throws `PyTypeError`
- T2. Message matches `/Cannot create a consistent method resolution order \(MRO\)/`
- T3. Existing valid C3 tests unchanged

---

## Sources & References

- CPython `Objects/typeobject.c` MRO failure path
- `docs/plans/2026-05-24-049-fix-slice-valueerror-plan.md`
