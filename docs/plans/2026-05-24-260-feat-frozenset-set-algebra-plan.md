---
title: "feat: frozenset set algebra"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 259 next steps
---

# frozenset set algebra (|, &, -, ^)

## Summary

Add **`frozenset`** bitwise set ops (`__and__`, `__or__`, `__sub__`, `__xor__`) and allow **`set`** ops to accept **frozenset** operands. frozenset results stay frozenset; set results stay set (CPython parity).

---

## Problem Frame

`set` has `Slot.and/or/sub/xor` for set-only operands. frozenset lacks algebra; cross-type set↔frozenset ops return NotImplemented. LIVING-PLAN lists this as next frozenset surface work.

---

## Requirements

- R1. `frozenset({1,2}) & frozenset({2,3})` → `{2}` as frozenset
- R2. `frozenset({1}) | set({2})` → frozenset; `set({1}) | frozenset({2})` → set
- R3. `-` and `^` work cross-type with same result-type rules
- R4. Extend `set.ts` to accept frozenset rhs; shared helpers in `set-algebra.ts`
- R5. Vitest `frozenset-set-algebra.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- Forward ops only (no inplace on frozenset); ordering comparisons deferred
- Element membership via native Set identity (existing set behavior)
- PEP 3118 out of scope

---

## Implementation Units

- U1. `set-algebra.ts` item helpers; wire frozenset + update set slots
- U2. Vitest; feature branch + PR

---

## Test Scenarios

- T1. frozenset & frozenset, frozenset | set (frozenset result)
- T2. set | frozenset (set result), set - frozenset
- T3. frozenset ^ set
- T4. Non-set-like rhs → TypeError via dispatch

---

## Patterns

Mirror existing `set.ts` slot bodies; `isSetLikeTypeName` guard like eq (plan 254).
