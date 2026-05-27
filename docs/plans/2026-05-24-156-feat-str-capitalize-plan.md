---
title: "feat: str.capitalize"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 155 next steps
---

# str.capitalize

## Summary

Add **`str.capitalize()`** — first character uppercased, remainder lowercased, matching CPython for common ASCII and Latin samples.

---

## Problem Frame

Plan 154 added upper/lower; capitalize completes the basic case-conversion trio alongside bytes (plan 124).

---

## Requirements

- R1. `"hello WORLD".capitalize()` → `"Hello world"`
- R2. `"49abc".capitalize()` → `"49abc"`; `""` unchanged
- R3. `"café WORLD".capitalize()` → `"Café world"`
- R4. `test/cpython-derived/str-capitalize.test.ts`
- R5. validation-ladder + LIVING-PLAN delta
- R6. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No title/swapcase in this slice
- Exotic case mappings (e.g. ß) deferred unless engine matches CPython in tests

---

## Implementation Units

- U1. `strCapitalize` helper + method on `strType`
- U2. Vitest evidence
- U3. Docs + feature branch + PR
