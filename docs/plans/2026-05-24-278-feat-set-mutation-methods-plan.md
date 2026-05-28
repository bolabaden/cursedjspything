---
title: "feat: set mutation methods and frozenset copy"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 277 next steps
---

# set add/remove/discard/pop/clear/copy/update + frozenset copy

## Summary

Add **`set`** mutation methods (`add`, `remove`, `discard`, `pop`, `clear`, `copy`, `update`) and **`frozenset.copy()`** returning a new frozenset with the same elements.

---

## Problem Frame

Frozenset/set stack covers algebra, ordering, inplace ops, and subset methods, but `set` still lacks basic mutators CPython exposes. This is the next frozenset-adjacent builtin surface gap before moving to bytes or exception-normalization work.

---

## Requirements

- R1. `add` mutates set; `remove` raises `PyKeyError` when missing; `discard` is silent
- R2. `pop` removes and returns an element; empty set → `PyKeyError`
- R3. `clear` empties set; `copy` returns shallow duplicate (`set` / `frozenset`)
- R4. `update` accepts set/frozenset or iterable via `iter`/`next`
- R5. Vitest `set-mutation.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- set mutation + frozenset `copy` only
- Native Set membership (same identity model as existing set ops)
- PEP 3118 out of scope; COMPATIBILITY docs sync deferred to follow-on docs slice

---

## Implementation Units

- U1. Methods on `setType` in `src/runtime/builtins/set.ts`; `copy` on `frozensetType`
- U2. Vitest; feature branch + PR

---

## Test Scenarios

- T1. add/remove/discard/pop/clear mutate set as expected
- T2. remove/pop KeyError paths; copy returns equal new object
- T3. update with frozenset and list iterable; non-iterable TypeError

---

## Patterns

Mirror string-key methods on set (plan 274); reuse `isSetLikeTypeName` / `requireSetLikeOperand` where applicable; iterable update pattern from `bytes.ts` join.
