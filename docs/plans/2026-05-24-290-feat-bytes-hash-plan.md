---
title: "feat: bytes __hash__"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 289 next steps
---

# bytes __hash__

## Summary

Add **`bytes.__hash__`** using the same 31-polynomial rolling hash as **`str`**, applied to byte values (0–255), matching CPython hashability semantics.

---

## Problem Frame

Bytes is a sequence type with rich methods and `__iter__`, but `hash(pyBytes(...))` raises `TypeError: unhashable type: 'bytes'`. CPython bytes are hashable; empty bytes hash to `0`.

---

## Requirements

- R1. `hash(pyBytes(...))` returns a stable 32-bit integer; empty bytes → `0`
- R2. Equal bytes content yields equal hash (order-sensitive byte sequence)
- R3. Vitest `bytes-hash.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- Mirror `str` hash algorithm on `Uint8Array` bytes
- COMPATIBILITY docs sync deferred to plan 292 (even docs after odd merge)
- PEP 3118 out of scope

---

## Implementation Units

- U1. `Slot.hash` on `bytesType` in `src/runtime/builtins/bytes.ts`
- U2. Vitest; feature branch + PR

---

## Test Scenarios

- T1. empty bytes hash is `0`
- T2. same bytes content → same hash; separate equal objects match
- T3. different bytes → different hash (non-empty samples)
