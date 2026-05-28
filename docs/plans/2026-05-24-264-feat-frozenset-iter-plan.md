---
title: "feat: frozenset __iter__"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 263 next steps
---

# frozenset __iter__

## Summary

Add **`frozenset.__iter__`** returning a frozenset iterator, mirroring **`set`** iteration protocol.

---

## Problem Frame

`set` has `Slot.iter`; frozenset does not. LIVING-PLAN lists frozenset iter as next surface work. Without `__iter__`, protocol `iter(frozenset(...))` falls back or fails.

---

## Requirements

- R1. `iter(frozenset({a,b}))` yields each element once; `StopIteration` after exhaustion
- R2. Iterator is its own `__iter__` (returns self)
- R3. Vitest in `test/cpython-derived/frozenset-iter.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- Iteration only — ordering comparisons deferred
- PEP 3118 out of scope

---

## Implementation Units

- U1. `Slot.iter` on `frozensetType` in `src/runtime/builtins/frozenset.ts` (mirror `set.ts`)
- U2. Vitest; feature branch + PR

---

## Test Scenarios

- T1. iter/next over populated frozenset
- T2. empty frozenset raises StopIteration on first next
- T3. iterator __iter__ returns self

---

## Patterns

Copy `set.ts` iterator closure pattern; name iterator `frozenset_iterator`.
