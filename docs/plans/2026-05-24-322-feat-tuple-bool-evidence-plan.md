---
title: "feat: tuple __bool__ evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 321 next steps
---

# tuple __bool__ evidence

## Summary

Add Vitest coverage for existing **`tuple.__bool__`** (`Slot.bool` on `tupleType`). Runtime hook already exists; §8.15 and validation-ladder sync deferred to plan 324.

---

## Problem Frame

`bool(pyTuple(...))` works via explicit `Slot.bool` on `tupleType`, but there is no `tuple-bool.test.ts`. List and bytes have dedicated `__bool__` Vitest files; tuple is the next built-in sequence with explicit truthiness and no derived test file.

---

## Requirements

- R1. `bool(empty tuple)` → `false`; `bool(non-empty tuple)` → `true`
- R2. Vitest `tuple-bool.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- No runtime changes unless tests expose a bug
- COMPATIBILITY §8.15 + validation-ladder sync deferred to plan 324
- PEP 3118 out of scope

---

## Implementation Units

- U1. `test/cpython-derived/tuple-bool.test.ts` (mirror `list-bool.test.ts` using `pyTuple`)
- U2. Feature branch + PR

---

## Test Scenarios

- T1. empty tuple is falsy
- T2. non-empty tuple is truthy
- T3. single-element tuple is truthy

---

## Validation

- `npm run check && npm test && npm run golden:keys`
