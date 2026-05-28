---
title: "feat: set frozenset named algebra methods"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 281 next steps
---

# set/frozenset union, intersection, difference, symmetric_difference methods

## Summary

Add string-key algebra methods on **`set`** and **`frozenset`** mirroring `|`, `&`, `-`, `^` with cross-type operands and result-type rules from plan 260.

---

## Problem Frame

Operator slots cover set algebra; CPython also exposes `union()`, `intersection()`, `difference()`, and `symmetric_difference()` as methods. pyrt lacks these named entry points despite shared helpers in `set-algebra.ts`.

---

## Requirements

- R1. Methods return `set` when lhs is set, `frozenset` when lhs is frozenset (cross-type rhs)
- R2. Non-set-like rhs → `TypeError` via `requireSetLikeOperand`
- R3. Vitest `frozenset-set-named-algebra.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- Single-other operand per method (matches operator arity)
- Reuse `set-algebra.ts` item helpers; PEP 3118 out of scope
- COMPATIBILITY docs sync deferred to follow-on docs slice

---

## Implementation Units

- U1. Methods on `setType` and `frozensetType` in respective builtin modules
- U2. Vitest; feature branch + PR

---

## Test Scenarios

- T1. frozenset.union(set) → frozenset; set.union(frozenset) → set
- T2. intersection, difference, symmetric_difference cross-type
- T3. Non-set-like rhs raises TypeError

---

## Patterns

Mirror `issubset` string-key methods (plan 274); reuse `requireSetLikeOperand` and algebra helpers (plan 260).
