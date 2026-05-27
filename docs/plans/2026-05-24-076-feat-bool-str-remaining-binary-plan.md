---
title: "feat: bool/str remaining binary TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 075 next steps (bool↔str remaining / bytes §8.15)
---

# bool/str remaining binary TypeError evidence

## Summary

Complete bool↔str §8.15 coverage beyond plan 075 (add/sub/truediv): prove **`floordiv`**, **`mod`**, **`divmod`**, and **`pow`** reject incompatible bool/str pairs with **`PyTypeError`** and `'bool'` typename.

---

## Problem Frame

Plan 075 / PR #47 covers bool↔str add/sub/truediv. Remaining binary ops lack cpython-derived tests on main.

---

## Requirements

- R1. Add `test/cpython-derived/operator-bool-str-remaining-binary.test.ts`
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only
- No runtime changes

---

## Implementation Units

- U1. **Vitest** — floordiv, mod, divmod, pow bool↔str TypeError

- U2. **Docs** — COMPATIBILITY, validation-ladder, LIVING-PLAN

---

## Test Scenarios

- T1. `floordiv(bool, str)` → `PyTypeError` with `'bool'` and `'str'`
- T2. `mod(bool, str)` → `PyTypeError`
- T3. `divmod(bool, str)` and `divmod(str, bool)` → `PyTypeError`
- T4. `pow(bool, str)` and `pow(str, bool)` → `PyTypeError`

---

## Sources & References

- `docs/plans/2026-05-24-075-feat-bool-str-binary-plan.md`
- `test/cpython-derived/operator-int-str-remaining-binary.test.ts`
