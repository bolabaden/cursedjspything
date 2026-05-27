---
title: "feat: bytes join"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 097 next steps
---

# Bytes join

## Summary

Add **`bytes.join(iterable)`** returning concatenated `pyBytes` with separator `self`, matching CPython’s bytes sequence join.

---

## Problem Frame

Plan 097 next step lists `bytes.join`. Decode/getitem/add/mul exist; join is the common sequence helper for bytes assembly.

---

## Requirements

- R1. `sep.join(iterable)` returns `pyBytes` with `sep` between each bytes element
- R2. Empty iterable → empty `pyBytes`
- R3. Single element → that bytes unchanged (no separator)
- R4. Non-bytes element → `TypeError` with sequence item index
- R5. Non-iterable → `TypeError`
- R6. Add `test/cpython-derived/bytes-join.test.ts`
- R7. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R8. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `str.join` / `str.encode(errors=...)`
- No buffer protocol

---

## Implementation Units

- U1. Add `join` to `src/runtime/builtins/bytes.ts` (use `iter`/`next` from protocols)
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. `b','.join([b'a', b'b', b'c'])` → `b'a,b,c'`
- T2. `b'-'.join([])` → `b''`
- T3. `b'|'.join([b'only'])` → `b'only'`
- T4. `b','.join([b'a', pyStr('x')])` → `TypeError` (via str in list — use bytes + str mix)
- T5. `b','.join(pyInt(1))` → `TypeError`
