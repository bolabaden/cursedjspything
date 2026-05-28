---
title: "feat: set inplace ops with frozenset operands"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 269 next steps
---

# set inplace bitwise ops (|=, &=, -=, ^=)

## Summary

Add **`set`** inplace slots (`__ior__`, `__iand__`, `__isub__`, `__ixor__`) that mutate the native backing set and accept **frozenset** operands. frozenset remains immutable (no inplace slots).

---

## Problem Frame

Set binary algebra accepts frozenset (plan 260), but inplace ops fall back to binary dispatch and return new `set` objects without mutating lhs. CPython mutates sets in place; LIVING-PLAN lists inplace as next frozenset-adjacent surface work.

---

## Requirements

- R1. `ior(set({1}), frozenset({2}))` mutates lhs in place; returns same PyObject
- R2. `iand`, `isub`, `ixor` mutate with cross-type frozenset/set operands
- R3. Non-set-like rhs → TypeError via dispatch
- R4. Vitest `set-frozenset-inplace.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- set inplace only — frozenset has no inplace ops (immutable)
- Element membership via native Set identity (mirror binary set ops)
- PEP 3118 out of scope; COMPATIBILITY docs sync deferred to follow-on docs slice

---

## Implementation Units

- U1. Inplace slots on `setType` in `src/runtime/builtins/set.ts` using set-algebra item helpers
- U2. Vitest; feature branch + PR

---

## Test Scenarios

- T1. ior mutates set identity; set |= frozenset cross-type
- T2. iand, isub, ixor mutate in place
- T3. Non-set-like rhs raises TypeError

---

## Patterns

Mirror `list.ts` `Slot.iadd` (mutate native, return self); `isSetLikeTypeName` guard like binary algebra (plan 260).
