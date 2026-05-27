---
title: "feat: float/str divmod and pow TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 065 next steps
---

# float/str divmod and pow TypeError evidence

## Summary

Complete float↔str §8.15 binary-op coverage: prove **`divmod`** and **`pow`** reject incompatible float/str pairs with **`PyTypeError`** (follow-on to plan 065 add/sub/truediv and int↔str plans 063–064).

---

## Problem Frame

Plan 065 (PR #44) covers float↔str add/sub/truediv. **`divmod`** and **`pow`** on float/str remain untested in the cpython-derived suite.

---

## Requirements

- R1. Add `test/cpython-derived/operator-float-str-divmod-pow.test.ts`
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only
- No runtime changes

---

## Implementation Units

- U1. **Vitest** — divmod and pow float↔str TypeError (both orders)

- U2. **Docs** — COMPATIBILITY, validation-ladder, LIVING-PLAN

---

## Test Scenarios

- T1. `divmod(float, str)` and `divmod(str, float)` → `PyTypeError`
- T2. `pow(float, str)` and `pow(str, float)` → `PyTypeError`

---

## Sources & References

- `docs/plans/2026-05-24-065-feat-float-str-binary-plan.md`
- `docs/plans/2026-05-24-064-feat-int-str-divmod-pow-plan.md`
