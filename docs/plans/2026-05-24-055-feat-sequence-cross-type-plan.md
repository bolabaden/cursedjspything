---
title: "feat: sequence cross-type add/mul TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/COMPATIBILITY_AND_GAPS.md §8.15
---

# Sequence cross-type operator TypeError evidence

## Summary

Add Vitest coverage for **list**/**str** add and **list** mul with incompatible operand types, proving **`PyTypeError`** via dispatch when slots return `NotImplemented`.

---

## Problem Frame

CPython rejects `[] + 1`, `[1] + 'a'`, `'a' + [1]`, and `[] * 'a'` with `TypeError`. pyrt behavior exists through slot guards + `binaryOp`, but lacks dedicated cpython-derived tests beyond str-scalar numeric cases.

---

## Requirements

- R1. Add `test/cpython-derived/sequence-cross-type.test.ts` (list+int, list+str, str+list, list*str)
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta; bump KB counts to match `npm test` after add
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only
- No CPython-exact message strings required

---

## Implementation Units

- U1. Vitest
- U2. COMPATIBILITY + validation-ladder + LIVING-PLAN

---

## Test Scenarios

- T1–T4. Cross-type add/mul raise `PyTypeError` with `unsupported operand type(s)`

---

## Sources & References

- CPython `Lib/test/test_operator.py` spirit
- `docs/plans/2026-05-24-054-feat-sequence-repeat-nonint-plan.md`
