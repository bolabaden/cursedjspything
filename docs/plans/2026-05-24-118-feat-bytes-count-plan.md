---
title: "feat: bytes count"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 117 next steps
---

# Bytes count

## Summary

Add **`bytes.count(sub[, start[, end]])`** returning non-negative `int` count of non-overlapping occurrences in the slice.

---

## Problem Frame

Plan 117 next step lists further bytes/str API. `count` pairs with find/index search methods.

---

## Requirements

- R1. `b'abcabcabc'.count(b'bc')` → `3`; missing sub → `0`
- R2. Non-overlapping: `b'aaa'.count(b'aa')` → `1`
- R3. Empty `sub`: `len(slice) + 1` when `start <= end`, else `0`
- R4. Optional `start` / `end`; reuse `requireFindSub` / `bytesSliceBounds`
- R5. Non-bytes `sub` → same `TypeError` as `find`
- R6. Add `test/cpython-derived/bytes-count.test.ts`
- R7. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R8. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `replace` or codec handlers

---

## Implementation Units

- U1. `countSubInRange` + `countBytes` slot in `bytes.ts`
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Repeated subbytes count
- T2. Non-overlapping semantics
- T3. Bounded slice; zero when absent
- T4. Empty sub edge cases
- T5. Str sub → `TypeError`

---

## Patterns

Reuse `requireFindSub` / `bytesSliceBounds`; return `pyInt`; unbound method tests.
