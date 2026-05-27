---
title: "feat: str.title"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 165 next steps
---

# str.title

## Summary

Add **`str.title()`** — title-case each word (first cased character upper, following cased lower), mirroring `bytes.title` with Unicode letter detection.

---

## Problem Frame

Str has upper/lower/capitalize; bytes has title (plan 124 area). Next str case-conversion slice from LIVING-PLAN.

---

## Requirements

- R1. `"hello world".title()` → `"Hello World"`; `"hello WORLD".title()` → `"Hello World"`
- R2. `"49abc".title()` → `"49Abc"`; `"a1b".title()` → `"A1B"`; `""` unchanged
- R3. `"café WORLD".title()` → `"Café World"`
- R4. `test/cpython-derived/str-title.test.ts`
- R5. validation-ladder + LIVING-PLAN delta
- R6. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No swapcase/istitle in this slice
- Exotic title mappings (e.g. ß → Ss) deferred unless engine matches CPython in tests

---

## Implementation Units

- U1. `strTitle` helper + method on `strType`
- U2. Vitest evidence mirroring `bytes-title.test.ts`
- U3. Docs + feature branch + PR
