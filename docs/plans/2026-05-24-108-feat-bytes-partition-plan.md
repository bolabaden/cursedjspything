---
title: "feat: bytes partition and rpartition"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 107 next steps
---

# Bytes partition / rpartition

## Summary

Add **`bytes.partition(sep)`** and **`bytes.rpartition(sep)`** returning a 3-tuple of `pyBytes` `(before, sep, after)` for the first / last separator occurrence.

---

## Problem Frame

Plan 107 next step lists `partition`. Split/rsplit/startswith landed; partition is the next common bytes parsing helper.

---

## Requirements

- R1. `b'a,b,c'.partition(b',')` → `(b'a', b',', b'b,c')`
- R2. `b'a,b,c'.rpartition(b',')` → `(b'a,b', b',', b'c')`
- R3. Separator not found: `partition` → `(self, b'', b'')`; `rpartition` → `(b'', b'', self)`
- R4. Empty `sep` → `ValueError`; non-bytes `sep` → `TypeError`
- R5. Add `test/cpython-derived/bytes-partition.test.ts`
- R6. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `splitlines` or codec handlers
- No str methods

---

## Implementation Units

- U1. `partitionBytes` / `rpartitionBytes` + slots in `src/runtime/builtins/bytes.ts`
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. `partition` / `rpartition` on comma-separated bytes
- T2. Sep not found returns self + empty pair (partition) or empty pair + self (rpartition)
- T3. `b'aaa'.partition(b'aa')` → `(b'', b'aa', b'a')`
- T4. Empty sep → `ValueError`
- T5. Str sep → `TypeError`

---

## Patterns

Return `pyTuple` of three `pyBytes`; follow `test/cpython-derived/bytes-split.test.ts` unbound method style.
