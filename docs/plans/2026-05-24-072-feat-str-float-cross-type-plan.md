---
title: "feat: str/float cross-type TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 071 next steps (str↔float / bytes §8.15)
---

# str/float cross-type TypeError evidence

## Summary

Extend §8.15 scalar cross-type coverage with CPython-derived Vitest proving **str↔float** pairs reject arithmetic with **`PyTypeError`** and comparisons do not coerce (mirrors `operator-str-scalar.test.ts` int path).

---

## Problem Frame

`operator-str-scalar.test.ts` locks str↔int non-coercion; float is another numeric scalar excluded from str slots. No dedicated evidence file for str↔float arithmetic TypeErrors.

---

## Requirements

- R1. Add `test/cpython-derived/operator-str-float.test.ts`
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only
- No runtime changes

---

## Implementation Units

- U1. **Vitest** — str↔float eq/ne non-coercion; add/sub/mul TypeError

- U2. **Docs** — COMPATIBILITY, validation-ladder, LIVING-PLAN

---

## Test Scenarios

- T1. `eq`/`ne` on str vs float → no coercion (false/true)
- T2. `add(str, float)` and `add(float, str)` → `PyTypeError`
- T3. `sub(str, float)` → `PyTypeError`
- T4. `mul(str, float)` → `PyTypeError`

---

## Sources & References

- `test/cpython-derived/operator-str-scalar.test.ts`
- `src/runtime/builtins/str.ts`, `float.ts`
