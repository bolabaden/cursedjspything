---
title: "feat: NoneType __bool__ evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 341 next steps
---

# NoneType __bool__ evidence

## Summary

Add Vitest coverage for existing **`NoneType.__bool__`** (`Slot.bool` on `noneType`). Runtime hook already exists; §8.15 and validation-ladder sync deferred to plan 344.

---

## Problem Frame

`bool(pyNone)` works via explicit `Slot.bool` returning `false`, but only generic `operators.test.ts` mentions it. Other builtins with explicit `__bool__` have dedicated cpython-derived files; `NoneType` is the remaining builtin with explicit falsy `__bool__` and no derived test file.

---

## Requirements

- R1. `bool(None)` → `false`
- R2. Vitest `none-bool.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- No runtime changes unless tests expose a bug
- `slice` lacks explicit `Slot.bool` — out of scope for this slice
- COMPATIBILITY sync deferred to plan 344
- PEP 3118 out of scope

---

## Implementation Units

- U1. `test/cpython-derived/none-bool.test.ts`
- U2. Feature branch + PR

---

## Validation

- `npm run check && npm test && npm run golden:keys`
