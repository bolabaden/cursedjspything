---
title: "fix: str __contains__ raises PyTypeError"
type: fix
status: completed
date: 2026-05-24
origin: test/cpython-derived/operator-str-scalar.test.ts
---

# Str __contains__ PyTypeError parity

## Summary

Replace plain `Error` with `PyTypeError` in str `__contains__` (and `__getitem__` type guard) so membership failures match other builtin TypeError paths; tighten operator-str-scalar test and validation-ladder entry.

---

## Problem Frame

Plan 027 added str/scalar Vitest but `contains(pyStr, pyInt)` threw generic `Error` with a `TypeError:` message prefix. Dispatch and cpython-derived tests expect `PyTypeError` instances like other operator paths.

---

## Requirements

- R1. `str.ts` `__contains__` throws `PyTypeError` with same message text
- R2. `str.ts` `__getitem__` non-int key throws `PyTypeError` (same message)
- R3. `operator-str-scalar.test.ts` asserts `PyTypeError` for str contains
- R4. `validation-ladder.md` L2 lists `operator-str-scalar.test.ts`
- R5. `npm run check`, `npm test`, `npm run golden:keys`
- R6. LIVING-PLAN delta

---

## Scope Boundaries

- `src/runtime/builtins/str.ts` only (not list/tuple `Error` throws)
- Test + docs touch
- No golden changes

---

## Implementation Units

- U1. Import and use `PyTypeError` in `str.ts`
- U2. Update `operator-str-scalar.test.ts`
- U3. validation-ladder + LIVING-PLAN

---

## Test Scenarios

- T1. `contains(pyStr("abc"), pyInt(97))` throws `PyTypeError`
- T2. Existing str/scalar eq/ne/add tests still pass
- T3. Full suite green

---

## Sources & References

- `src/runtime/core/errors.ts`
- `test/cpython-derived/operator-str-scalar.test.ts`
