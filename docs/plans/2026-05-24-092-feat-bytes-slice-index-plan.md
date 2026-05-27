---
title: "feat: bytes slice indexing"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 091 next steps
---

# Bytes slice indexing

## Summary

Add **`bytes.__getitem__`** support for **`slice`** keys, returning a new `pyBytes` subsequence (same pattern as list/tuple).

---

## Problem Frame

Plan 091 next step: bytes slice indexing. Integer indexing landed in plan 090; slice keys still raise `TypeError`.

---

## Requirements

- R1. `bytes.__getitem__(slice)` returns `pyBytes` copy of selected range via `sliceIndices`
- R2. Zero step slice → `PyValueError` (shared slice helper)
- R3. Add `test/cpython-derived/bytes-slice-index.test.ts`
- R4. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R5. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `decode()` method yet
- No buffer protocol

---

## Implementation Units

- U1. Extend `src/runtime/builtins/bytes.ts` getitem for slices
- U2. Vitest evidence
- U3. Docs + PR

---

## Test Scenarios

- T1. `b'abcd'[1:3]` → `b'bc'`
- T2. `b'abcd'[::2]` → `b'ac'`
- T3. `b'abcd'[::-1]` → `b'dcba'`
- T4. zero step → `PyValueError`
