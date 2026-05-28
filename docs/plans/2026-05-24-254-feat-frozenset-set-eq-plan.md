---
title: "feat: frozenset set cross-type equality"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 253 next steps
---

# frozenset ↔ set equality

## Summary

Wire **cross-type equality** between **`frozenset`** and **`set`** so `frozenset({1}) == {1}` and `{1} == frozenset({1})` match CPython.

---

## Problem Frame

Plan 252 added minimal frozenset; `__eq__` only compares same-type frozensets. CPython treats set and frozenset as equal when contents match. LIVING-PLAN lists set↔frozenset comparisons as next frozenset surface work.

---

## Requirements

- R1. `eq(frozenset({1}), set({1}))` → `true`
- R2. `eq(set({1,2}), frozenset({1,2}))` → `true`; mismatched contents → `false`
- R3. `eq(frozenset(), set({1}))` → `false`
- R4. Non-set-like rhs still `NotImplemented` / `false` via rich compare
- R5. Vitest in `test/cpython-derived/frozenset-set-eq.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- Equality only — no ordering, hash, or set algebra
- PEP 3118 out of scope

---

## Implementation Units

- U1. Shared set-contents helper; update `Slot.eq` in `frozenset.ts` and `set.ts` (name-based type guard to avoid circular imports)
- U2. CPython-derived eq tests; feature branch + PR

---

## Test Scenarios

- T1. frozenset == set same elements
- T2. set == frozenset same elements
- T3. Empty vs non-empty false
- T4. frozenset == int → false (NotImplemented path)

---

## Patterns

Mirror list-eq cross-type guard style; compare native `Set` contents like existing same-type eq slots.
