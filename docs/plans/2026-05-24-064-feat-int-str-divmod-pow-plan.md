---
title: "feat: int/str divmod and pow TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 063 next steps
---

# int/str divmod and pow TypeError evidence

## Summary

Complete int↔str §8.15 binary-op coverage: prove **`divmod`** and **`pow`** reject incompatible int/str pairs with **`PyTypeError`** (follow-on to plan 063 sub/div/mod and plan 027 str-scalar add).

---

## Problem Frame

`operator-str-scalar.test.ts` covers add; plan 063 (PR #42) covers sub/floordiv/mod/truediv. **`divmod`** and **`pow`** on int/str remain untested in cpython-derived suite.

---

## Requirements

- R1. Add `test/cpython-derived/operator-int-str-divmod-pow.test.ts`
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only
- No runtime changes

---

## Implementation Units

- U1. **Vitest** — divmod and pow int↔str TypeError (both orders)

- U2. **Docs** — COMPATIBILITY, validation-ladder, LIVING-PLAN

---

## Test Scenarios

- T1. `divmod(int, str)` and `divmod(str, int)` → `PyTypeError`
- T2. `pow(int, str)` and `pow(str, int)` → `PyTypeError`

---

## Sources & References

- `test/cpython-derived/operator-str-scalar.test.ts`
- `docs/plans/2026-05-24-063-feat-int-str-binary-plan.md`
