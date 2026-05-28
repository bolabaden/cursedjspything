---
title: "feat: frozenset ordering comparisons"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 265 next steps
---

# frozenset ordering comparisons (<=, <, >=, >)

## Summary

Add **`frozenset`** rich ordering slots (`__le__`, `__lt__`, `__ge__`, `__gt__`) and extend **`set`** ordering to accept **frozenset** operands (CPython subset/superset semantics).

---

## Problem Frame

`set` has `Slot.le/lt/ge/gt` for set-only operands. frozenset lacks ordering comparisons; cross-type set↔frozenset ordering returns NotImplemented. LIVING-PLAN lists this as next frozenset surface work.

---

## Requirements

- R1. `frozenset({1}) <= frozenset({1,2})` → true; `<` when proper subset
- R2. `frozenset({1}) <= set({1,2})` and `set({1}) <= frozenset({1,2})` cross-type
- R3. `>=` and `>` mirror superset / proper superset
- R4. Shared helpers in `set-ordering.ts`; update `set.ts` to use `isSetLikeTypeName`
- R5. Vitest `frozenset-set-ordering.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- Ordering only — inplace set ops remain set-only; PEP 3118 out of scope
- Element membership via native Set identity (mirror existing `set.ts` ordering)
- No COMPATIBILITY doc sync this slice (feat-only; docs slice can follow)

---

## Implementation Units

- U1. `set-ordering.ts` subset/superset helpers; wire frozenset + update set slots
- U2. Vitest; feature branch + PR

---

## Test Scenarios

- T1. frozenset <= frozenset, frozenset < frozenset (proper subset)
- T2. frozenset <= set and set <= frozenset cross-type
- T3. frozenset >= / > frozenset and cross-type
- T4. Non-set-like rhs → TypeError via dispatch

---

## Patterns

Mirror `set.ts` slot bodies (lines 88–117); `isSetLikeTypeName` guard like eq/algebra (plans 254, 260).
