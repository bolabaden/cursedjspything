---
title: "feat: int float bool __bool__ evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 337 next steps
---

# int, float, and bool __bool__ evidence

## Summary

Add Vitest coverage for existing **`int.__bool__`**, **`float.__bool__`**, and **`bool.__bool__`** (`Slot.bool` on builtin types). Runtime hooks already exist; §8.15 and validation-ladder sync deferred to plan 340.

---

## Problem Frame

`bool(pyInt(...))` etc. work via explicit `Slot.bool`, but only generic `operators.test.ts` touches int truthiness. Dedicated cpython-derived files exist for containers and str/bytes; numeric builtins lack explicit `__bool__` Vitest evidence.

---

## Requirements

- R1. `int`: 0 falsy; non-zero (positive and negative) truthy
- R2. `float`: 0.0 falsy; non-zero truthy
- R3. `bool`: `False` falsy; `True` truthy
- R4. Vitest `int-bool.test.ts`, `float-bool.test.ts`, `bool-bool.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- No runtime changes unless tests expose a bug
- COMPATIBILITY §8.15 + validation-ladder sync deferred to plan 340
- PEP 3118 out of scope

---

## Implementation Units

- U1. `test/cpython-derived/int-bool.test.ts`
- U2. `test/cpython-derived/float-bool.test.ts`
- U3. `test/cpython-derived/bool-bool.test.ts`
- U4. Feature branch + PR

---

## Test Scenarios

- T1. int 0 falsy; int -1 and positive non-zero truthy
- T2. float 0.0 falsy; float non-zero truthy
- T3. pyFalse falsy; pyTrue truthy

---

## Validation

- `npm run check && npm test && npm run golden:keys`
