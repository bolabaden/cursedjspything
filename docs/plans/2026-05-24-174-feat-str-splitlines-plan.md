---
title: "feat: str.splitlines"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 173 next steps
---

# str.splitlines

## Summary

Add **`str.splitlines(keepends=False)`** returning a list of lines split on Unicode line breaks, mirroring `bytes.splitlines`.

---

## Problem Frame

Str has split/rsplit/partition/rpartition; bytes has splitlines. Next str splitting slice from LIVING-PLAN.

---

## Requirements

- R1. `"a\nb\r\nc".splitlines()` → `["a","b","c"]`; `keepends=True` retains breaks
- R2. `"".splitlines()` → `[]`; lone `"\n"` → `[""]`
- R3. Splits on Unicode line breaks (e.g. U+2028)
- R4. Non-bool `keepends` → `TypeError`
- R5. `test/cpython-derived/str-splitlines.test.ts`
- R6. validation-ladder + LIVING-PLAN delta; `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No find/index/count in this slice

---

## Implementation Units

- U1. Line-break helpers + `splitlinesStr` + method on `strType`
- U2. Vitest evidence mirroring `bytes-splitlines.test.ts` plus Unicode break
- U3. Docs + feature branch + PR
