---
title: "feat: numeric conversion TypeError evidence (toInt/toFloat/index/toComplex)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 059 next steps
---

# Numeric conversion TypeError evidence

## Summary

Add CPython-derived Vitest proving exported **numeric conversion** helpers raise **`PyTypeError`** on types without the corresponding slot/hook (`toInt`, `toFloat`, `index`, `toComplex` on `list`).

---

## Problem Frame

Conversion helpers in `src/runtime/dispatch/operators/numeric.ts` dispatch `__int__`, `__float__`, `__index__`, and `__complex__`. Smoke happy paths exist in `test/dispatch/operators.test.ts`; parity docs list several exported operators without dedicated CPython-derived error-path coverage.

---

## Requirements

- R1. Add `test/cpython-derived/operator-numeric-conversion-evidence.test.ts`
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only
- No runtime changes

---

## Implementation Units

- U1. **Vitest** — list rejected by toInt, toFloat, index, toComplex

- U2. **Docs** — COMPATIBILITY, validation-ladder, LIVING-PLAN

---

## Test Scenarios

- T1. `toInt(pyList([]))` → `PyTypeError` with `int() argument must be a string or a real number, not 'list'`
- T2. `toFloat(pyList([]))` → `PyTypeError` with `float() argument must be a string or a real number, not 'list'`
- T3. `index(pyList([]))` → `PyTypeError` with `'list' object cannot be interpreted as an integer`
- T4. `toComplex(pyList([]))` → `PyTypeError` with `complex() argument must be a string or a number, not 'list'`

---

## Sources & References

- CPython conversion builtin spirit
- `src/runtime/dispatch/operators/numeric.ts`
- `docs/plans/2026-05-24-059-feat-matmul-evidence-plan.md`
