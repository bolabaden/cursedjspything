---
title: "feat: bytes find and rfind"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 113 next steps
---

# Bytes find / rfind

## Summary

Add **`bytes.find(sub[, start[, end]])`** and **`bytes.rfind(sub[, start[, end]])`** returning `int` index or `-1`.

---

## Problem Frame

Plan 113 next step lists further bytes/str API. Search helpers complement split/partition/startswith.

---

## Requirements

- R1. `b'abcabc'.find(b'bc')` → `1`; `rfind(b'bc')` → `4`
- R2. Optional `start` / `end` slice bounds; not found → `-1`
- R3. Empty `sub`: `find` → `start` when `start < end`; `rfind` → `end - 1`
- R4. Non-bytes `sub` → CPython-style `TypeError`
- R5. Add `test/cpython-derived/bytes-find.test.ts`
- R6. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `index` / `rindex` (raise on miss) or codec handlers

---

## Implementation Units

- U1. `findBytes` / `rfindBytes` + slots in `src/runtime/builtins/bytes.ts`
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Forward / reverse find on repeated subbytes
- T2. Bounded `start` / `end`
- T3. Missing sub → `-1`
- T4. Empty sub edge cases
- T5. Str sub → `TypeError`

---

## Patterns

Reuse `bytesSliceBounds`; return `pyInt`; unbound method tests.
