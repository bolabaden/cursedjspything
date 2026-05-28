---
title: "feat: set and frozenset __bool__ evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 329 next steps
---

# set and frozenset __bool__ evidence

## Summary

Add Vitest coverage for existing **`set.__bool__`** and **`frozenset.__bool__`** (`Slot.bool` on `setType` / `frozensetType`). Runtime hooks already exist; §8.15 and validation-ladder sync deferred to plan 332.

---

## Problem Frame

`bool(pySet(...))` and `bool(pyFrozenSet(...))` work via explicit `Slot.bool`, but there are no `set-bool.test.ts` or `frozenset-bool.test.ts` files. Bytes, list, tuple, and dict truthiness are tested; set types are the remaining built-in containers with explicit `__bool__` and no derived test files.

---

## Requirements

- R1. Empty set/frozenset falsy; non-empty truthy
- R2. Vitest `set-bool.test.ts` and `frozenset-bool.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- No runtime changes unless tests expose a bug
- COMPATIBILITY §8.15 + validation-ladder sync deferred to plan 332
- PEP 3118 out of scope

---

## Implementation Units

- U1. `test/cpython-derived/set-bool.test.ts`
- U2. `test/cpython-derived/frozenset-bool.test.ts`
- U3. Feature branch + PR

---

## Test Scenarios

- T1. empty set/frozenset falsy
- T2. non-empty set/frozenset truthy
- T3. single-element set/frozenset truthy even when element is zero

---

## Validation

- `npm run check && npm test && npm run golden:keys`
