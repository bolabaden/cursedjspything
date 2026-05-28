---
title: "feat: bytes __bytes__"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 293 next steps
---

# bytes __bytes__

## Summary

Add **`bytes.__bytes__`** returning **`self`**, so the **`bytes()`** builtin accepts bytes objects per CPython.

---

## Problem Frame

`bytes(pyBytes(...))` raises `TypeError: cannot convert 'bytes' object to bytes` because `bytesType` lacks `Hook.bytes`. CPython `bytes(b'abc')` returns the same bytes object.

---

## Requirements

- R1. `bytes(pyBytes(...))` returns the input bytes object (identity)
- R2. Existing `bytes(str)` and rejection of non-bytes-capable types unchanged
- R3. Vitest `bytes-bytes.test.ts`; LIVING-PLAN delta

---

## Scope Boundaries

- `Hook.bytes` returns `self` only — no copy
- COMPATIBILITY docs sync deferred to plan 296
- PEP 3118 out of scope

---

## Implementation Units

- U1. `Hook.bytes` on `bytesType` in `src/runtime/builtins/bytes.ts`
- U2. Vitest; feature branch + PR

---

## Test Scenarios

- T1. `bytes(pyBytes(...))` returns same object
- T2. `bytes(str)` still UTF-8 encodes (regression via existing test file or spot check)
