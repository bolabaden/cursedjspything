---
title: "feat: str count"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 181 next steps
---

# str count

## Summary

Add **`str.count`** with optional `start`/`end` bounds and non-overlapping semantics, mirroring `bytes.count`.

---

## Problem Frame

Find/index landed in plans 178–180. Count is the next search slice from LIVING-PLAN.

---

## Requirements

- R1. `"abcabcabc".count("bc")` → 3; missing sub → 0
- R2. Non-overlapping: `"aaa".count("aa")` → 1
- R3. Respects `start`/`end`; empty sub → CPython empty-match count rules
- R4. Non-str sub → `PyTypeError` (`must be str, not …`)
- R5. `test/cpython-derived/str-count.test.ts` mirroring `bytes-count.test.ts`
- R6. validation-ladder + LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No startswith/endswith in this slice

---

## Implementation Units

- U1. `countSubInStrRange`, `countStr` reusing find helpers + register on `strType`
- U2. Vitest evidence in `str-count.test.ts`
- U3. Docs + feature branch + PR
