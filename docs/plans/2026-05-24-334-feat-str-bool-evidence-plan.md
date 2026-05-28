---
title: "feat: str __bool__ evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 333 next steps
---

# str __bool__ evidence

## Summary

Add Vitest coverage for existing **`str.__bool__`** (`Slot.bool` on `strType`). Runtime hook already exists; §8.15 and validation-ladder sync deferred to plan 336.

---

## Problem Frame

`bool(pyStr(...))` works via explicit `Slot.bool` on `strType`, but there is no `str-bool.test.ts`. Bytes and other built-in sequences/containers have dedicated `__bool__` Vitest files; str is the remaining built-in with explicit length-based truthiness and no derived test file.

---

## Requirements

- R1. `bool(empty str)` → `false`; `bool(non-empty str)` → `true`
- R2. Vitest `str-bool.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- No runtime changes unless tests expose a bug
- COMPATIBILITY §8.15 + validation-ladder sync deferred to plan 336
- PEP 3118 out of scope

---

## Implementation Units

- U1. `test/cpython-derived/str-bool.test.ts` (mirror `bytes-bool.test.ts` using `pyStr`)
- U2. Feature branch + PR

---

## Test Scenarios

- T1. empty str is falsy
- T2. non-empty str is truthy
- T3. str containing only NUL or space is truthy

---

## Validation

- `npm run check && npm test && npm run golden:keys`
