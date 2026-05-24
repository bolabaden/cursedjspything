---
title: "feat: bool↔float cross-type compare and arithmetic"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/40-operational-risk/parity-gaps-priorities.md
---

# Bool↔float cross-type parity

## Summary

Complete the numeric tower slice after plan 023: `True == 1.0`, `True + 1.0 → 2.0`, matching CPython bool-as-int semantics with float promotion.

---

## Problem Frame

`float.ts` accepts only `int` and `float`; `bool.__eq__` accepts `int` but not `float`. CPython treats bool as numeric; `True + 1.0` works today in CPython but not pyrt.

---

## Requirements

- R1. Export `isNumericOperand` / `numericOperand` from `int.ts` for reuse in `float.ts`
- R2. `float.ts` compare and arithmetic slots accept bool via shared coercion
- R3. `bool.__eq__` accepts `floatType` with numeric compare
- R4. `eq(pyTrue, pyFloat(1.0))` and `add(pyTrue, pyFloat(1.0))` match CPython
- R5. Vitest `test/cpython-derived/operator-bool-float.test.ts`
- R6. Golden keys `bool_float_eq`, `bool_float_add` in both emitters; refresh snapshots
- R7. `npm run check`, `npm test`, `npm run golden:keys`, `npm run golden`
- R8. LIVING-PLAN + parity-gaps row #8 wording update

---

## Scope Boundaries

- `int.ts`, `float.ts`, `bool.ts`, golden builders, tests, docs only
- No str/sequence cross-type

---

## Implementation Units

- U1. Export numeric helpers from int.ts
- U2. float.ts uses shared helpers
- U3. bool eq accepts float
- U4. Vitest + golden + docs

---

## Test Scenarios

- T1. `True == 1.0`, `False == 0.0`
- T2. `True + 1.0` → float 2.0; `1.0 + True` reflected
- T3. Golden bool_float_* on 3.14 profile
