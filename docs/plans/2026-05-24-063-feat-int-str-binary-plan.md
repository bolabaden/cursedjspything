---
title: "feat: int/str binary arithmetic TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 062 next steps
---

# int/str binary arithmetic TypeError evidence

## Summary

Extend CPython-derived §8.15 coverage: prove **`sub`**, **`floordiv`**, **`mod`**, and **`truediv`** reject **int↔str** pairs with **`PyTypeError`** (complements existing `add` cases in `operator-str-scalar.test.ts`).

---

## Problem Frame

`operator-str-scalar.test.ts` documents str↔int **add** and comparisons; other binary numeric ops on int/str lack dedicated cpython-derived tests.

---

## Requirements

- R1. Add `test/cpython-derived/operator-int-str-binary.test.ts`
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only
- No runtime changes

---

## Implementation Units

- U1. **Vitest** — int-str sub, floordiv, mod, truediv TypeError (forward and reflected where applicable)

- U2. **Docs** — COMPATIBILITY, validation-ladder, LIVING-PLAN

---

## Test Scenarios

- T1. `sub(int, str)` and `sub(str, int)` → `PyTypeError`
- T2. `floordiv(int, str)` → `PyTypeError`
- T3. `mod(int, str)` → `PyTypeError`
- T4. `truediv(int, str)` → `PyTypeError`

---

## Sources & References

- `test/cpython-derived/operator-str-scalar.test.ts`
- `docs/plans/2026-05-24-062-feat-unary-evidence-plan.md`
