---
title: "feat: str.rpartition"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 171 next steps
---

# str.rpartition

## Summary

Add **`str.rpartition(sep)`** returning a 3-tuple at the last separator occurrence, mirroring `bytes.rpartition` and reusing partition helpers from plan 170.

---

## Problem Frame

Plan 170 landed `str.partition`; bytes already has rpartition. Natural paired str splitting slice.

---

## Requirements

- R1. `"a,b,c".rpartition(",")` → `("a,b", ",", "c")`; missing sep → `("", "", whole)`
- R2. Overlapping sep at end: `"aaa".rpartition("aa")` → `("a", "aa", "")`
- R3. Empty sep → `ValueError`; non-str sep → `TypeError`
- R4. `test/cpython-derived/str-rpartition.test.ts`
- R5. validation-ladder + LIVING-PLAN delta
- R6. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No splitlines in this slice

---

## Implementation Units

- U1. `rpartitionStr` + method on `strType` (reuse `requirePartitionStrSep`, `findStrSepIndex`)
- U2. Vitest evidence mirroring `bytes-partition.test.ts` rpartition cases
- U3. Docs + feature branch + PR
