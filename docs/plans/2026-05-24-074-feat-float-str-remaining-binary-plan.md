---
title: "feat: float/str remaining binary TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 073 next steps (float↔str remaining / bytes §8.15)
---

# float/str remaining binary TypeError evidence

## Summary

Add CPython-derived Vitest coverage for **float↔str** division/mod/pow rejection with **`PyTypeError`**, complementing str↔scalar and int↔str evidence paths (add/sub/mul for float covered separately in plan 072 when merged).

---

## Problem Frame

No cpython-derived tests lock float↔str `truediv`, `floordiv`, `mod`, `divmod`, or `pow` TypeErrors on main. §8.15 lists float↔str as a remaining gap.

---

## Requirements

- R1. Add `test/cpython-derived/operator-float-str-remaining-binary.test.ts`
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only
- No runtime changes

---

## Implementation Units

- U1. **Vitest** — truediv, floordiv, mod, divmod, pow float↔str TypeError

- U2. **Docs** — COMPATIBILITY, validation-ladder, LIVING-PLAN

---

## Test Scenarios

- T1. `truediv(float, str)` → `PyTypeError`
- T2. `floordiv(float, str)` → `PyTypeError`
- T3. `mod(float, str)` → `PyTypeError`
- T4. `divmod(float, str)` and `divmod(str, float)` → `PyTypeError`
- T5. `pow(float, str)` and `pow(str, float)` → `PyTypeError`

---

## Sources & References

- `test/cpython-derived/operator-int-str-remaining-binary.test.ts`
- `docs/COMPATIBILITY_AND_GAPS.md` §8.15
