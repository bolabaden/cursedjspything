---
title: "feat: str.partition"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 169 next steps
---

# str.partition

## Summary

Add **`str.partition(sep)`** returning a 3-tuple `(before, sep, after)` at the first separator occurrence, mirroring `bytes.partition`.

---

## Problem Frame

Str has split/rsplit; bytes has partition/rpartition. Next str splitting slice from LIVING-PLAN.

---

## Requirements

- R1. `"a,b,c".partition(",")` → `("a", ",", "b,c")`; missing sep → `(whole, "", "")`
- R2. Overlapping sep at start: `"aaa".partition("aa")` → `("", "aa", "a")`
- R3. Empty sep → `ValueError`; non-str sep → `TypeError`
- R4. `test/cpython-derived/str-partition.test.ts`
- R5. validation-ladder + LIVING-PLAN delta
- R6. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No rpartition in this slice

---

## Implementation Units

- U1. Partition helpers + method on `strType`
- U2. Vitest evidence mirroring `bytes-partition.test.ts` (partition cases only)
- U3. Docs + feature branch + PR
