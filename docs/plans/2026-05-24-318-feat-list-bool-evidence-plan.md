---
title: "feat: list __bool__ evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 317 next steps
---

# list __bool__ evidence

## Summary

Add Vitest coverage for existing **`list.__bool__`** (`Slot.bool` on `listType`). Runtime hook already exists; §8.15 and validation-ladder sync deferred to plan 320.

---

## Problem Frame

`bool(pyList(...))` works via explicit `Slot.bool` on `listType`, but there is no `list-bool.test.ts`. Bytes `__bool__` has dedicated Vitest evidence (`bytes-bool.test.ts`); list is the next built-in container with explicit truthiness and no derived test file.

---

## Requirements

- R1. `bool(empty list)` → `false`; `bool(non-empty list)` → `true`
- R2. Vitest `list-bool.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- No runtime changes unless tests expose a bug
- COMPATIBILITY §8.15 + validation-ladder sync deferred to plan 320
- PEP 3118 out of scope

---

## Implementation Units

- U1. `test/cpython-derived/list-bool.test.ts` (mirror `bytes-bool.test.ts` using `pyList` / `pyInt`)
- U2. Feature branch + PR

---

## Test Scenarios

- T1. empty list is falsy
- T2. non-empty list is truthy
- T3. single-element list is truthy

---

## Validation

- `npm run check && npm test && npm run golden:keys`
