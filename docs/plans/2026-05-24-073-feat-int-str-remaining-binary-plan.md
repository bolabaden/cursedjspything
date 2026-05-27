---
title: "feat: int/str remaining binary TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 072 next steps (bytes / remaining §8.15)
---

# int/str remaining binary TypeError evidence

## Summary

Complete int↔str §8.15 coverage beyond `operator-str-scalar.test.ts` (add only): prove **`sub`**, **`truediv`**, **`floordiv`**, **`mod`**, **`divmod`**, and **`pow`** reject incompatible int/str pairs with **`PyTypeError`**.

---

## Problem Frame

`operator-str-scalar.test.ts` locks str↔int add and comparison non-coercion. Other binary ops on int/str lack cpython-derived tests. (`int * str` is valid via str `__rmul__` — out of scope.)

---

## Requirements

- R1. Add `test/cpython-derived/operator-int-str-remaining-binary.test.ts`
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only
- No runtime changes
- Skip `mul` (numeric repeat via str `__rmul__`)

---

## Implementation Units

- U1. **Vitest** — sub, truediv, floordiv, mod, divmod, pow int↔str TypeError

- U2. **Docs** — COMPATIBILITY, validation-ladder, LIVING-PLAN

---

## Test Scenarios

- T1. `sub(int, str)` → `PyTypeError` with `'int'` and `'str'`
- T2. `truediv(int, str)` → `PyTypeError`
- T3. `floordiv(int, str)` → `PyTypeError`
- T4. `mod(int, str)` → `PyTypeError`
- T5. `divmod(int, str)` and `divmod(str, int)` → `PyTypeError`
- T6. `pow(int, str)` and `pow(str, int)` → `PyTypeError`

---

## Sources & References

- `test/cpython-derived/operator-str-scalar.test.ts`
- `docs/COMPATIBILITY_AND_GAPS.md` §8.15
