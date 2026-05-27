---
title: "feat: unary operator TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 061 next steps
---

# Unary operator TypeError evidence

## Summary

Add CPython-derived Vitest proving unary **`neg`**, **`pos`**, **`invert`**, and **`abs`** raise **`PyTypeError`** on types without the corresponding slots (test `list`).

---

## Problem Frame

Unary helpers in `src/runtime/dispatch/operators/numeric.ts` use `unaryOp` with `bad operand type for unary …` messages. No dedicated CPython-derived coverage for error paths.

---

## Requirements

- R1. Add `test/cpython-derived/operator-unary-evidence.test.ts`
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only
- No runtime changes

---

## Implementation Units

- U1. **Vitest** — list rejected by neg, pos, invert, abs

- U2. **Docs** — COMPATIBILITY, validation-ladder, LIVING-PLAN

---

## Test Scenarios

- T1. `neg(pyList([]))` → `PyTypeError` with `bad operand type for unary -: 'list'`
- T2. `pos(pyList([]))` → `PyTypeError` with `bad operand type for unary +: 'list'`
- T3. `invert(pyList([]))` → `PyTypeError` with `bad operand type for unary ~: 'list'`
- T4. `abs(pyList([]))` → `PyTypeError` with `bad operand type for unary abs(): 'list'`

---

## Sources & References

- CPython unary operator spirit
- `src/runtime/dispatch/operators/numeric.ts` — `unaryOp`
- `docs/plans/2026-05-24-061-feat-rounding-evidence-plan.md`
