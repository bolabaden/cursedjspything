---
title: "feat: tuple __reversed__"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 309 next steps
---

# tuple __reversed__

## Summary

Add explicit **`tuple.__reversed__`** via `makeReversedIterator`, yielding elements in reverse index order per CPython.

---

## Problem Frame

`reversed(pyTuple(...))` works today through the generic `__len__` + `__getitem__` fallback in `protocols.reversed`, but `tupleType` lacks an explicit `Hook.reversed` slot. §8.15 sequence protocol coverage should document reversible tuples explicitly (list already has `Hook.reversed`; tuple is the next gap).

---

## Requirements

- R1. `reversed(pyTuple(...))` yields elements high-to-low; empty tuple → immediate `StopIteration`
- R2. Iterator `__iter__` returns self
- R3. Vitest `tuple-reversed.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- Reuse `makeReversedIterator` + integer `__getitem__`
- COMPATIBILITY docs sync deferred to plan 312
- PEP 3118 out of scope

---

## Implementation Units

- U1. `Hook.reversed` on `tupleType` in `src/runtime/builtins/tuple.ts`
- U2. Vitest; feature branch + PR

---

## Test Scenarios

- T1. reversed + next over non-empty tuple yields elements in reverse
- T2. empty tuple StopIteration on first next
- T3. iterator __iter__ returns self
