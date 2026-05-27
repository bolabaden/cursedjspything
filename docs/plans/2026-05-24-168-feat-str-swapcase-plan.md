---
title: "feat: str.swapcase"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 167 next steps
---

# str.swapcase

## Summary

Add **`str.swapcase()`** — invert case of each cased character, mirroring `bytes.swapcase` with Unicode letter detection.

---

## Problem Frame

Str has upper/lower/capitalize/title; bytes has swapcase. Completes the basic case-conversion set on str.

---

## Requirements

- R1. `"AbC".swapcase()` → `"aBc"`; double swap restores original
- R2. Non-letters unchanged; `""` unchanged
- R3. `"café".swapcase()` → `"CAFÉ"`
- R4. `test/cpython-derived/str-swapcase.test.ts`
- R5. validation-ladder + LIVING-PLAN delta
- R6. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No istitle/case predicates in this slice
- Exotic case mappings deferred unless engine matches CPython in tests

---

## Implementation Units

- U1. `strSwapcase` helper + method on `strType`
- U2. Vitest evidence mirroring `bytes-swapcase.test.ts`
- U3. Docs + feature branch + PR
