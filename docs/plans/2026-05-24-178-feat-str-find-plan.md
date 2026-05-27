---
title: "feat: str find and rfind"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 177 next steps
---

# str find and rfind

## Summary

Add **`str.find`** and **`str.rfind`** with optional `start`/`end` bounds, mirroring `bytes.find` / `bytes.rfind`.

---

## Problem Frame

Plan 176 deferred find/index/count. Bytes has find/rfind; str lacks them. Next str search slice from LIVING-PLAN.

---

## Requirements

- R1. `"abcabc".find("bc")` → 1; `"abcabc".rfind("bc")` → 4
- R2. Missing sub → -1 for both
- R3. Respects `start`/`end`; empty sub → CPython empty-match rules
- R4. Non-str sub → `PyTypeError` (`must be str, not …`)
- R5. `test/cpython-derived/str-find.test.ts` mirroring `bytes-find.test.ts` plus Unicode sample
- R6. validation-ladder + LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No index/rindex/count/startswith in this slice

---

## Implementation Units

- U1. `strSliceBounds`, `findSubInStrRange`, `findStr`/`rfindStr` + register on `strType` (reuse `findStrSepIndex`)
- U2. Vitest evidence in `str-find.test.ts`
- U3. Docs + feature branch + PR
