---
title: "feat: str index and rindex"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 179 next steps
---

# str index and rindex

## Summary

Add **`str.index`** and **`str.rindex`** with optional `start`/`end` bounds, mirroring `bytes.index` / `bytes.rindex` and complementing plan 178 find/rfind.

---

## Problem Frame

Find/rfind landed in plan 178. Index/rindex raise `ValueError` on miss; next search slice from LIVING-PLAN.

---

## Requirements

- R1. `"abcabc".index("bc")` → 1; `"abcabc".rindex("bc")` → 4
- R2. Missing sub → `PyValueError` (`substring not found`)
- R3. Respects `start`/`end`; empty sub → same empty-match rules as find/rfind
- R4. Non-str sub → `PyTypeError` (`must be str, not …`)
- R5. `test/cpython-derived/str-index.test.ts` mirroring `bytes-index.test.ts`
- R6. validation-ladder + LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No count/startswith in this slice

---

## Implementation Units

- U1. `indexStr`/`rindexStr` reusing `findSubInStrRange` + register on `strType`
- U2. Vitest evidence in `str-index.test.ts`
- U3. Docs + feature branch + PR
