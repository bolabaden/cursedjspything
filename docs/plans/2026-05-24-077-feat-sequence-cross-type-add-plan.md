---
title: "feat: sequence cross-type add TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 076 next steps (bytes / sequence exotic §8.15)
---

# sequence cross-type add TypeError evidence

## Summary

Add CPython-derived Vitest coverage proving **list/tuple `+`** rejects unrelated scalars and heterogeneous sequences with **`PyTypeError`**, addressing §8.15 “sequences vs unrelated scalars” gap.

---

## Problem Frame

List/tuple `__add__` only accepts homotypic operands. Dispatch raises `PyTypeError`, but main lacks cpython-derived tests for list↔int, tuple↔int, list↔str, list↔tuple.

---

## Requirements

- R1. Add `test/cpython-derived/operator-sequence-cross-type-add.test.ts`
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only
- No runtime changes
- Skip `*` repetition (covered by `sequence-repeat-bool.test.ts`)

---

## Implementation Units

- U1. **Vitest** — `add` on list↔int, int↔list, tuple↔int, list↔str, list↔tuple → `PyTypeError`

- U2. **Docs** — COMPATIBILITY, validation-ladder, LIVING-PLAN

---

## Test Scenarios

- T1. `add(list, int)` → `PyTypeError` / `'list'` and `'int'`
- T2. `add(int, list)` → `PyTypeError` / `'int'` and `'list'`
- T3. `add(tuple, int)` → `PyTypeError` / `'tuple'` and `'int'`
- T4. `add(list, str)` → `PyTypeError` / `'list'` and `'str'`
- T5. `add(list, tuple)` → `PyTypeError` / `'list'` and `'tuple'`

---

## Sources & References

- `src/runtime/builtins/list.ts`, `tuple.ts`
- `docs/COMPATIBILITY_AND_GAPS.md` §8.15
