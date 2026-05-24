---
title: "feat: rounding/truncation TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 060 next steps
---

# Rounding/truncation TypeError evidence

## Summary

Add CPython-derived Vitest proving **`round`**, **`trunc`**, **`floor`**, and **`ceil`** raise **`PyTypeError`** on types without the corresponding hooks (test `list`).

---

## Problem Frame

Rounding helpers in `src/runtime/dispatch/operators/numeric.ts` dispatch `__round__`, `__trunc__`, `__floor__`, and `__ceil__`. Happy paths for float exist in `test/dispatch/operators.test.ts`; no dedicated CPython-derived error coverage.

---

## Requirements

- R1. Add `test/cpython-derived/operator-rounding-evidence.test.ts`
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only
- No runtime changes

---

## Implementation Units

- U1. **Vitest** — list rejected by round, trunc, floor, ceil

- U2. **Docs** — COMPATIBILITY, validation-ladder, LIVING-PLAN

---

## Test Scenarios

- T1. `round(pyList([]))` → `PyTypeError` with `doesn't define __round__ method`
- T2. `trunc(pyList([]))` → `PyTypeError` with `doesn't define __trunc__ method`
- T3. `floor(pyList([]))` → `PyTypeError` with `doesn't define __floor__ method`
- T4. `ceil(pyList([]))` → `PyTypeError` with `doesn't define __ceil__ method`

---

## Sources & References

- CPython rounding builtin spirit
- `src/runtime/dispatch/operators/numeric.ts`
- `docs/plans/2026-05-24-060-feat-numeric-conversion-evidence-plan.md`
