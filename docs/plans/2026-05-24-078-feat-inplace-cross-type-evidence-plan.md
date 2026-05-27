---
title: "feat: inplace cross-type TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 077 next steps (inplace / bytes §8.15)
---

# inplace cross-type TypeError evidence

## Summary

Add CPython-derived Vitest coverage proving **in-place operators** (`+=`, `-=`) reject incompatible cross-type pairs with **`PyTypeError`**, matching binary-op fallthrough in `inplaceOp`.

---

## Problem Frame

§8.15 documents cross-type binary delegation; inplace ops fall back to binary dispatch when `__iadd__`/`__isub__` return `NotImplemented`. No cpython-derived tests lock this for scalar/sequence mismatches on main.

---

## Requirements

- R1. Add `test/cpython-derived/operator-inplace-cross-type.test.ts`
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only
- No runtime changes
- Skip `int * str` / `*=`: str `__rmul__` accepts numeric repeat counts

---

## Implementation Units

- U1. **Vitest** — `iadd`/`isub` on int↔str, str↔int, list↔int, str↔bool → `PyTypeError`

- U2. **Docs** — COMPATIBILITY, validation-ladder, LIVING-PLAN

---

## Test Scenarios

- T1. `iadd(int, str)` → `PyTypeError` / `+=`
- T2. `isub(int, str)` → `PyTypeError` / `-=`
- T3. `iadd(str, int)` → `PyTypeError` / `+=`
- T4. `iadd(list, int)` → `PyTypeError` / `+=`
- T5. `iadd(str, bool)` → `PyTypeError` / `+=`

---

## Sources & References

- `src/runtime/dispatch/operators/numeric.ts` — `inplaceOp`
- `test/cpython-derived/operator-str-scalar.test.ts`
