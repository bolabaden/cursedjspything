---
title: "fix: list/tuple subscript type guards raise PyTypeError"
type: fix
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md
---

# List/tuple subscript PyTypeError parity

## Summary

Replace plain `Error` with `PyTypeError` for list/tuple non-integer subscript keys, completing the sequence builtin exception cleanup started in plan 029 (str).

---

## Problem Frame

LIVING-PLAN plan 029 partial: list/tuple still throw generic `Error` with `TypeError:` message prefixes. Dispatch and tests expect `PyTypeError` instances for type errors.

---

## Requirements

- R1. `list.ts` `__getitem__`, `__setitem__`, `__delitem__` non-int keys throw `PyTypeError("list indices must be integers")`
- R2. `tuple.ts` `__getitem__` non-int keys throw `PyTypeError("tuple indices must be integers")`
- R3. Vitest: `test/cpython-derived/sequence-index-type.test.ts` for list/tuple getItem/setItem
- R4. `validation-ladder.md` L2 entry for new test file
- R5. `npm run check`, `npm test`, `npm run golden:keys`
- R6. LIVING-PLAN delta

---

## Scope Boundaries

- TypeError guards only (IndexError out-of-range stays plain `Error` for now)
- list.ts, tuple.ts, tests, docs
- No golden changes

---

## Implementation Units

- U1. PyTypeError in list.ts and tuple.ts
- U2. Vitest sequence-index-type.test.ts
- U3. validation-ladder + LIVING-PLAN

---

## Test Scenarios

- T1. `getItem(pyList([...]), pyStr("x"))` throws `PyTypeError`
- T2. `getItem(pyTuple([...]), pyStr("x"))` throws `PyTypeError`
- T3. `setItem` on list with non-int key throws `PyTypeError`
- T4. Regression: slice getItem and int index still work

---

## Sources & References

- `docs/plans/2026-05-24-029-fix-str-contains-pytypeerror-plan.md`
- `src/runtime/builtins/list.ts`, `tuple.ts`
