---
title: "feat: set and frozenset issubset/issuperset/isdisjoint"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 273 next steps
---

# set/frozenset issubset, issuperset, isdisjoint

## Summary

Add **`issubset`**, **`issuperset`**, and **`isdisjoint`** methods on **`set`** and **`frozenset`**, cross-type with set-like operands (CPython parity with operator-based subset tests).

---

## Problem Frame

Ordering comparisons and algebra are implemented; method-form subset tests (`s.issubset(t)`) are missing. LIVING-PLAN points to next frozenset/set surface after stack completion.

---

## Requirements

- R1. `frozenset({1}).issubset(frozenset({1,2}))` → true; cross-type with set
- R2. `issuperset` and `isdisjoint` on set and frozenset
- R3. Shared helpers in `set-ordering.ts`; `isSetLikeTypeName` guard
- R4. Vitest `frozenset-set-methods.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- Methods only — no new operators
- Element membership via native Set identity (mirror ordering ops)
- PEP 3118 out of scope; COMPATIBILITY docs sync deferred

---

## Implementation Units

- U1. `areDisjoint` helper; wire methods on `set.ts` and `frozenset.ts`
- U2. Vitest; feature branch + PR

---

## Test Scenarios

- T1. issubset/issuperset frozenset↔set cross-type
- T2. isdisjoint true/false cases
- T3. Non-set-like rhs → TypeError

---

## Patterns

String-key methods like `bytes.ts`; reuse `set-ordering.ts` subset/superset helpers (plan 266).
