---
title: "feat: frozenset __hash__"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 257 next steps
---

# frozenset __hash__

## Summary

Add **`frozenset.__hash__`** with order-independent element hash mixing; **`set`** remains unhashable (CPython parity).

---

## Problem Frame

Plan 252–254 landed frozenset repr/format/eq. Frozenset lacks `Slot.hash`, so `hash(frozenset(...))` raises and frozenset cannot be dict keys. LIVING-PLAN lists frozenset hash as next surface work.

---

## Requirements

- R1. `hash(frozenset())` returns stable 32-bit int (pyrt `| 0` convention)
- R2. Equal frozensets (same elements) share hash; order of insertion irrelevant
- R3. `hash(set())` → `TypeError: unhashable type: 'set'`
- R4. Vitest in `test/cpython-derived/frozenset-hash.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- Hash only — no set algebra
- Exact CPython hash values not required (32-bit truncation); consistency and eq→same-hash required
- PEP 3118 out of scope

---

## Implementation Units

- U1. `frozensetHash` + `Slot.hash` in `src/runtime/builtins/frozenset.ts` (XOR element hashes + size mix)
- U2. Vitest; feature branch + PR

---

## Test Scenarios

- T1. Empty frozenset hash stable across calls
- T2. Populated frozenset hash order-independent
- T3. Equal frozensets same hash
- T4. set remains unhashable

---

## Patterns

Use `hash()` from `compare.ts` per element like tuple; XOR mixing for set order independence; `-1` → `-2` guard like CPython.
