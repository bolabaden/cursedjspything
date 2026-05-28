---
title: "feat: bytes __iter__ yielding int elements"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 285 next steps
---

# bytes __iter__

## Summary

Add **`bytes.__iter__`** yielding **`int`** elements (0–255) via existing `__getitem__` integer path, matching CPython iteration semantics.

---

## Problem Frame

Bytes has rich method surface and `__getitem__`, but lacks `__iter__`, blocking `iter(bytes)` and for-loops over bytes in pyrt embedder code. §8.15 lists bytes as still missing parts of the full method surface.

---

## Requirements

- R1. `iter(pyBytes(...))` yields `pyInt` byte values in order; empty bytes → immediate `StopIteration`
- R2. Iterator `__iter__` returns self
- R3. Vitest `bytes-iter.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- Reuse `makeSequenceIterator` + existing integer `__getitem__`
- PEP 3118 out of scope; COMPATIBILITY docs sync deferred

---

## Implementation Units

- U1. `Slot.iter` on `bytesType` in `src/runtime/builtins/bytes.ts`
- U2. Vitest; feature branch + PR

---

## Test Scenarios

- T1. iter + next over non-empty bytes yields ints
- T2. empty bytes StopIteration on first next
- T3. iterator __iter__ returns self

---

## Patterns

Mirror `frozenset-iter.test.ts`; use `makeSequenceIterator` like list/tuple when `__getitem__` accepts int indices.
