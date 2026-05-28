---
title: "feat: dict __bool__ evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 325 next steps
---

# dict __bool__ evidence

## Summary

Add Vitest coverage for existing **`dict.__bool__`** (`Slot.bool` on `dictType`). Runtime hook already exists; §8.15 and validation-ladder sync deferred to plan 328.

---

## Problem Frame

`bool(pyDict(...))` works via explicit `Slot.bool` on `dictType`, but there is no `dict-bool.test.ts`. List, tuple, and bytes have dedicated `__bool__` Vitest files; dict is the next built-in mapping with explicit truthiness and no derived test file.

---

## Requirements

- R1. `bool(empty dict)` → `false`; `bool(non-empty dict)` → `true`
- R2. Vitest `dict-bool.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- No runtime changes unless tests expose a bug
- COMPATIBILITY §8.15 + validation-ladder sync deferred to plan 328
- PEP 3118 out of scope

---

## Implementation Units

- U1. `test/cpython-derived/dict-bool.test.ts` (mirror `list-bool.test.ts` using `pyDict`)
- U2. Feature branch + PR

---

## Test Scenarios

- T1. empty dict is falsy
- T2. non-empty dict is truthy
- T3. single-entry dict is truthy even when value is falsy scalar

---

## Validation

- `npm run check && npm test && npm run golden:keys`
