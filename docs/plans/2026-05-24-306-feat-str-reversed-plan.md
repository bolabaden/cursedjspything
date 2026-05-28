---
title: "feat: str __reversed__"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 305 next steps
---

# str __reversed__

## Summary

Add explicit **`str.__reversed__`** via `makeReversedIterator`, yielding one-character strings in reverse index order per CPython.

---

## Problem Frame

`reversed(pyStr(...))` works today through the generic `__len__` + `__getitem__` fallback in `protocols.reversed`, but `strType` lacks an explicit `Hook.reversed` slot. §8.15 str protocol coverage should document reversible strings explicitly, matching the bytes pattern (plan 302).

---

## Requirements

- R1. `reversed(pyStr(...))` yields one-char strings high-to-low; empty str → immediate `StopIteration`
- R2. Iterator `__iter__` returns self
- R3. Vitest `str-reversed.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- Reuse `makeReversedIterator` + integer `__getitem__`
- COMPATIBILITY docs sync deferred to plan 308
- PEP 3118 out of scope

---

## Implementation Units

- U1. `Hook.reversed` on `strType` in `src/runtime/builtins/str.ts`
- U2. Vitest; feature branch + PR

---

## Test Scenarios

- T1. reversed + next over non-empty str yields one-char strings in reverse
- T2. empty str StopIteration on first next
- T3. iterator __iter__ returns self
