---
title: "feat: list/tuple repetition accepts bool operands"
type: feat
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-035-feat-str-mul-bool-plan.md
---

# List/tuple repetition bool parity

## Summary

Extend bool-as-repeat-count parity to `list` and `tuple` `__mul__`, extracting shared `sequenceRepeatCount` helper used by str/list/tuple.

---

## Problem Frame

Plan 035 fixed `str * True`; `list` and `tuple` still reject bool with TypeError despite bool subclassing int.

---

## Requirements

- R1. Export `sequenceRepeatCount` from `int.ts` (int + bool → repeat count)
- R2. Refactor `str.ts` to use shared helper
- R3. `list.ts` and `tuple.ts` `__mul__` use helper
- R4. Vitest `sequence-repeat-bool.test.ts` for list/tuple
- R5. Sync KB Vitest counts; `npm run check`, `npm test`, `npm run golden:keys`
- R6. LIVING-PLAN delta

---

## Scope Boundaries

- int/str/list/tuple only + tests
- No golden keys

---

## Implementation Units

- U1. `sequenceRepeatCount` in int.ts
- U2. str/list/tuple mul slots
- U3. Tests + KB counts + LIVING-PLAN

---

## Test Scenarios

- T1. `mul(pyList([pyInt(1)]), pyTrue)` length 1
- T2. `mul(pyTuple([pyInt(1)]), pyFalse)` empty tuple
- T3. str plan 035 tests still pass

---

## Sources & References

- Plan 035 str mul bool
- CPython sequence repetition
