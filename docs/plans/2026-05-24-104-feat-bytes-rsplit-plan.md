---
title: "feat: bytes rsplit"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 103 next steps
---

# Bytes rsplit

## Summary

Add **`bytes.rsplit(sep=None, maxsplit=-1)`** returning a `list` of `pyBytes`, mirroring `bytes.split` but splitting from the right.

---

## Problem Frame

Plan 103 next step lists `rsplit` among further bytes methods. Plan 102 landed forward `split`; `rsplit` is the paired parser helper.

---

## Requirements

- R1. `b'a,b,c'.rsplit(b',')` → `[b'a', b'b', b'c']`
- R2. `rsplit(b',', maxsplit=1)` → `[b'a,b', b'c']` (split from right)
- R3. `rsplit()` with no sep splits on ASCII whitespace from the right
- R4. Empty `sep` → `ValueError`; non-bytes `sep` → `TypeError`
- R5. `maxsplit=0` → single-element list of original bytes
- R6. Reuse `splitMaxsplitArg` / `splitSepArg` helpers from split
- R7. Add `test/cpython-derived/bytes-rsplit.test.ts`
- R8. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R9. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `splitlines`, `partition`, `startswith`, or str methods
- No new codec error handlers

---

## Implementation Units

- U1. Add `rsplitWithSep`, `rsplitWhitespace`, `rsplitBytes` + `rsplit` slot in `src/runtime/builtins/bytes.ts`
- U2. Vitest evidence in `test/cpython-derived/bytes-rsplit.test.ts`
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. `b'a,b,c'.rsplit(b',')` → `[b'a', b'b', b'c']`
- T2. `b'a,b,c'.rsplit(b',', 1)` → `[b'a,b', b'c']`
- T3. `b'a  b  c'.rsplit(maxsplit=1)` → `[b'a  b', b'c']`
- T4. `b'aaa'.rsplit(b'aa')` → `[b'a', b'']` (CPython rightmost non-overlapping match)
- T5. `b'x'.rsplit(b'')` → `ValueError`
- T6. `b'a b c'.rsplit(maxsplit=0)` → `[b'a b c']`
- T7. Empty bytes whitespace rsplit → `[]`; empty bytes with sep → `[b'']`

---

## Patterns

Reuse split helpers and test style from `test/cpython-derived/bytes-split.test.ts`.
