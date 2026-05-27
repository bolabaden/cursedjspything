---
title: "feat: str.upper and str.lower"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 153 next steps
---

# str.upper / str.lower

## Summary

Add **`str.upper()`** and **`str.lower()`** on the builtin str type, mirroring CPython case conversion for common Unicode text via JS case mapping.

---

## Problem Frame

Bytes upper/lower landed in plan 122; str still only exposes encode and core slots. Next str API slice from LIVING-PLAN.

---

## Requirements

- R1. `"AbC".upper()` → `"ABC"`; `"AbC".lower()` → `"abc"`
- R2. Empty str unchanged; non-letters unchanged (`"123"`)
- R3. Unicode samples match CPython (`"café"`, `"Σ"`, `"straße"`)
- R4. `test/cpython-derived/str-upper-lower.test.ts`
- R5. validation-ladder + LIVING-PLAN delta
- R6. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No capitalize/title/swapcase in this slice
- No locale-specific special cases beyond JS engine mapping

---

## Implementation Units

- U1. Methods on `strType` dict in `str.ts`
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. ASCII upper/lower
- T2. empty and non-alpha
- T3. Unicode parity vectors
