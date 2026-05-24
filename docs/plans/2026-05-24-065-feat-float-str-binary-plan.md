---
title: "feat: float/str binary arithmetic TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 064 next steps
---

# float/str binary arithmetic TypeError evidence

## Summary

Add CPython-derived Vitest proving **`add`**, **`sub`**, and **`truediv`** reject **float↔str** pairs with **`PyTypeError`** (mirrors int↔str coverage; `operator-str-scalar.test.ts` only exercises int+str for add).

---

## Problem Frame

Numeric tower tests cover int↔float and int↔bool; int↔str ops are landing across plans 063–064. **float↔str** binary ops lack dedicated cpython-derived error tests.

---

## Requirements

- R1. Add `test/cpython-derived/operator-float-str-binary.test.ts`
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only
- No runtime changes

---

## Implementation Units

- U1. **Vitest** — float-str add (both orders), sub, truediv TypeError

- U2. **Docs** — COMPATIBILITY, validation-ladder, LIVING-PLAN

---

## Test Scenarios

- T1. `add(float, str)` and `add(str, float)` → `PyTypeError`
- T2. `sub(float, str)` → `PyTypeError`
- T3. `truediv(float, str)` → `PyTypeError`

---

## Sources & References

- `test/cpython-derived/operator-str-scalar.test.ts`
- `docs/plans/2026-05-24-064-feat-int-str-divmod-pow-plan.md`
