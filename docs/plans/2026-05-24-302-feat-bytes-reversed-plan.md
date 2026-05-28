---
title: "feat: bytes __reversed__"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 301 next steps
---

# bytes __reversed__

## Summary

Add explicit **`bytes.__reversed__`** via `makeReversedIterator`, yielding int elements in reverse index order per CPython.

---

## Problem Frame

`reversed(pyBytes(...))` works today through the generic `__len__` + `__getitem__` fallback in `protocols.reversed`, but `bytesType` lacks an explicit `Hook.reversed` slot. §8.15 bytes protocol coverage should document reversible bytes explicitly.

---

## Requirements

- R1. `reversed(pyBytes(...))` yields int byte values high-to-low; empty bytes → immediate `StopIteration`
- R2. Iterator `__iter__` returns self
- R3. Vitest `bytes-reversed.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- Reuse `makeReversedIterator` + integer `__getitem__`
- COMPATIBILITY docs sync deferred to plan 304
- PEP 3118 out of scope

---

## Implementation Units

- U1. `Hook.reversed` on `bytesType` in `src/runtime/builtins/bytes.ts`
- U2. Vitest; feature branch + PR

---

## Test Scenarios

- T1. reversed + next over non-empty bytes yields ints in reverse
- T2. empty bytes StopIteration on first next
- T3. iterator __iter__ returns self
