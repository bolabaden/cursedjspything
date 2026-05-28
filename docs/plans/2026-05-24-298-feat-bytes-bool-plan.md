---
title: "feat: bytes __bool__"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 297 next steps
---

# bytes __bool__

## Summary

Add explicit **`bytes.__bool__`** (empty bytes falsy, non-empty truthy), matching **`str`** and CPython.

---

## Problem Frame

`bool(pyBytes(...))` currently falls back to `__len__` because `bytesType` lacks `Slot.bool`. CPython bytes implement explicit `__bool__`; pyrt should match for protocol completeness.

---

## Requirements

- R1. `bool(empty bytes)` → `false`; `bool(non-empty bytes)` → `true` (including `b'\x00'`)
- R2. Vitest `bytes-bool.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- Mirror `str` truthiness (`length > 0`)
- COMPATIBILITY docs sync deferred to plan 300
- PEP 3118 out of scope

---

## Implementation Units

- U1. `Slot.bool` on `bytesType` in `src/runtime/builtins/bytes.ts`
- U2. Vitest; feature branch + PR

---

## Test Scenarios

- T1. empty bytes is falsy
- T2. non-empty bytes including zero byte is truthy
