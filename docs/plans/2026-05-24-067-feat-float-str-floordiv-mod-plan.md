---
title: "feat: float/str floordiv and mod TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 066 next steps
---

# float/str floordiv and mod TypeError evidence

## Summary

Fill remaining float↔str §8.15 gap: prove **`floordiv`** and **`mod`** reject incompatible float/str pairs with **`PyTypeError`** (plan 065 covers add/sub/truediv; plan 066 covers divmod/pow).

---

## Problem Frame

Int↔str floordiv/mod are covered in plan 063. Float↔str add/sub/truediv (065) and divmod/pow (066) are in flight; **`floordiv`** and **`mod`** on float/str lack cpython-derived tests on main.

---

## Requirements

- R1. Add `test/cpython-derived/operator-float-str-floordiv-mod.test.ts`
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only
- No runtime changes

---

## Implementation Units

- U1. **Vitest** — floordiv and mod float↔str TypeError

- U2. **Docs** — COMPATIBILITY, validation-ladder, LIVING-PLAN

---

## Test Scenarios

- T1. `floordiv(float, str)` → `PyTypeError`
- T2. `mod(float, str)` → `PyTypeError`

---

## Sources & References

- `docs/plans/2026-05-24-065-feat-float-str-binary-plan.md`
- `docs/plans/2026-05-24-063-feat-int-str-binary-plan.md`
