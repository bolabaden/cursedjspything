---
title: "feat: slice __bool__ evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 345 next steps
---

# slice __bool__ evidence

## Summary

Add explicit **`slice.__bool__`** (`Slot.bool` always `true`, matching CPython) and Vitest coverage. §8.15 docs deferred to plan 348.

---

## Problem Frame

`bool(pySlice(...))` is already truthy via pyrt default object truthiness (no `__bool__`/`__len__`), but `sliceType` lacks explicit `Slot.bool` unlike other builtins in §8.15. CPython treats all slice objects as truthy.

---

## Requirements

- R1. `Slot.bool` on `sliceType` returns `true` for any slice
- R2. Vitest `slice-bool.test.ts`; LIVING-PLAN delta
- R3. `bool(slice(0,0,0))` → `true` (CPython parity)

---

## Scope Boundaries

- No change to truthiness semantics (already true); make hook explicit
- Docs deferred to plan 348
- PEP 3118 out of scope

---

## Implementation Units

- U1. `src/runtime/collections/slice.ts` — add `Slot.bool`
- U2. `test/cpython-derived/slice-bool.test.ts`
- U3. Feature branch + PR

---

## Validation

- `npm run check && npm test && npm run golden:keys`
