---
title: "feat: str.isascii"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 157 next steps
---

# str.isascii

## Summary

Add **`str.isascii()`** returning whether all code points are ASCII (≤ U+007F), mirroring `bytes.isascii` and CPython 3.7+.

---

## Problem Frame

Bytes gained `isascii` in plan 146; str predicates are the next incremental str API slice.

---

## Requirements

- R1. `"hello".isascii()` → `True`; `"café".isascii()` → `False`; `""` → `True`
- R2. Returns `pyTrue` / `pyFalse` singletons
- R3. `test/cpython-derived/str-isascii.test.ts`
- R4. validation-ladder + LIVING-PLAN delta
- R5. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No other str predicates (isalpha, etc.) in this slice

---

## Implementation Units

- U1. `strIsascii` + method on `strType`
- U2. Vitest evidence
- U3. Docs + feature branch + PR
