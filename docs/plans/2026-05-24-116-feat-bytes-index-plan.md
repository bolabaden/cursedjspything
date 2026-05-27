---
title: "feat: bytes index and rindex"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 115 next steps
---

# Bytes index / rindex

## Summary

Add **`bytes.index(sub[, start[, end]])`** and **`bytes.rindex(sub[, start[, end]])`** returning `int` index or raising **`ValueError: subsection not found`**.

---

## Problem Frame

Plan 115 next step lists further bytes/str API. `index`/`rindex` pair with landed `find`/`rfind`.

---

## Requirements

- R1. `b'abcabc'.index(b'bc')` → `1`; `rindex(b'bc')` → `4`
- R2. Missing sub → `ValueError: subsection not found`
- R3. Optional `start` / `end`; reuse `findSubInRange` / `requireFindSub`
- R4. Empty sub and bounds match `find`/`rindex` CPython semantics
- R5. Non-bytes `sub` → same `TypeError` as `find`
- R6. Add `test/cpython-derived/bytes-index.test.ts`
- R7. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R8. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No codec handlers or PEP 3118

---

## Implementation Units

- U1. `indexBytes` / `rindexBytes` delegating to `findSubInRange`; slots in `bytes.ts`
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Forward / reverse index on repeated subbytes
- T2. Bounded `start` / `end`
- T3. Missing sub → `ValueError`
- T4. Empty sub edge cases
- T5. Str sub → `TypeError`

---

## Patterns

Reuse `findSubInRange`; return `pyInt`; unbound method tests; `PyValueError` message verbatim.
