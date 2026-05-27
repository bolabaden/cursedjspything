---
title: "feat: bytes split"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 101 next steps
---

# Bytes split

## Summary

Add **`bytes.split(sep=None, maxsplit=-1)`** returning a `list` of `pyBytes`, extending the bytes method surface beyond decode/join/getitem.

---

## Problem Frame

Plan 101 next step lists further bytes API. `bytes.join` landed in plan 098; split is the complementary sequence helper for parsing byte payloads.

---

## Requirements

- R1. `b'a,b,c'.split(b',')` → list `[b'a', b'b', b'c']`
- R2. `split(b',', maxsplit=1)` limits splits; remainder stays in last element
- R3. `split()` with no sep splits on ASCII whitespace runs (CPython bytes semantics)
- R4. Empty `sep` → `ValueError`
- R5. Non-bytes `sep` → `TypeError` (bytes-like required)
- R6. `maxsplit=0` → single-element list of original bytes
- R7. Add `test/cpython-derived/bytes-split.test.ts`
- R8. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R9. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `rsplit`, `splitlines`, `partition`, or str methods
- No new codec error handlers

---

## Implementation Units

- U1. Add `splitBytes` helper + `split` slot in `src/runtime/builtins/bytes.ts`
- U2. Vitest evidence in `test/cpython-derived/bytes-split.test.ts`
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. `b'a,b,c'.split(b',')` → `[b'a', b'b', b'c']`
- T2. `b'a,b,c'.split(b',', 1)` → `[b'a', b'b,c']`
- T3. `b'a  b'.split()` → `[b'a', b'b']`
- T4. `b'aaa'.split(b'aa')` → `[b'', b'a']`
- T5. `b'x'.split(b'')` → `ValueError`
- T6. `b'a b c'.split(maxsplit=0)` → `[b'a b c']`
- T7. `b'hi'.split(',')` (str sep) → `TypeError`

---

## Patterns

Follow `bytes.join` in `src/runtime/builtins/bytes.ts` and test style in `test/cpython-derived/bytes-join.test.ts` (unbound method via `getAttr`).
