---
title: "feat: list __reversed__ evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 313 next steps
---

# list __reversed__ evidence

## Summary

Add Vitest coverage for existing **`list.__reversed__`** (`list_reverseiterator` in `list.ts`). Runtime hook already exists; §8.15 and validation-ladder sync deferred to plan 316.

---

## Problem Frame

`reversed(pyList(...))` works via explicit `Hook.reversed` on `listType`, but there is no `list-reversed.test.ts`. Bytes, str, and tuple reversible protocol coverage is documented and tested; list is the remaining built-in sequence with runtime support but no derived CPython test file.

---

## Requirements

- R1. `reversed(pyList(...))` yields elements high-to-low; empty list → immediate `StopIteration`
- R2. Iterator `__iter__` returns self
- R3. Vitest `list-reversed.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- No runtime changes unless tests expose a bug in existing `list_reverseiterator`
- COMPATIBILITY §8.15 + validation-ladder sync deferred to plan 316
- PEP 3118 out of scope

---

## Implementation Units

- U1. `test/cpython-derived/list-reversed.test.ts` (mirror `tuple-reversed.test.ts` using `pyList`)
- U2. Feature branch + PR; prepend LIVING-PLAN delta

---

## Test Scenarios

- T1. reversed + next over non-empty list yields elements in reverse
- T2. empty list StopIteration on first next
- T3. iterator __iter__ returns self

---

## Validation

- `npm run check && npm test && npm run golden:keys`
