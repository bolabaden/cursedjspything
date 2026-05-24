---
title: "feat: int↔bool cross-type compare and arithmetic"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/40-operational-risk/parity-gaps-priorities.md
---

# Int↔bool cross-type parity

## Summary

Extend builtin int and bool slots so `1 == True`, `False == 0`, and `True + 1` match CPython, closing a slice of parity gap #8 beyond int↔float.

---

## Problem Frame

`int.ts` rich-compare and arithmetic accept `intType` and `floatType` only; `bool.ts` `__eq__` accepts `boolType` only. CPython treats bool as numeric (subclass of int); pyrt returns `NotImplemented` / false today.

---

## Requirements

- R1. `eq(pyInt(1), pyTrue)` and `eq(pyFalse, pyInt(0))` are `true`
- R2. Rich compare (`lt`, `le`, `gt`, `ge`, `ne`) works for int↔bool pairs with numeric semantics
- R3. `add`, `sub`, `mul` work for int↔bool (result type follows int/float rules: int unless float involved)
- R4. Reflected paths: `eq(pyTrue, pyInt(1))` works via bool slot or rich-compare fallback
- R5. Vitest: `test/cpython-derived/operator-int-bool.test.ts` (matrix from `test_operator.py` spirit)
- R6. Golden keys `bool_int_eq`, `bool_int_add` in `cases.py` + `pyrt-cases.ts`; run `npm run golden:keys` and golden when Python available
- R7. `npm run check`, `npm test`
- R8. LIVING-PLAN delta

---

## Scope Boundaries

- `src/runtime/builtins/int.ts`, `bool.ts`
- `scripts/golden/cases.py`, `pyrt-cases.ts`, expected JSON (if golden run)
- `test/cpython-derived/operator-int-bool.test.ts`
- No str/sequence cross-type in this slice

---

## Implementation Units

- U1. Shared numeric coercion for int/float/bool in int slots
- U2. bool `__eq__` (and rich compare if needed) accepts int
- U3. Vitest matrix
- U4. Golden keys + snapshot refresh
- U5. LIVING-PLAN

---

## Test Scenarios

- T1. eq: (1, True), (0, False), (1, False) false
- T2. lt/le/gt/ge/ne spot checks
- T3. add(1, True) → 2, add(True, 1) reflected via radd or bool path
- T4. Golden bool_int_eq, bool_int_add on 3.14 profile

---

## Sources

- `parity-gaps-priorities.md` row #8
- `operator-int-float.test.ts` pattern
