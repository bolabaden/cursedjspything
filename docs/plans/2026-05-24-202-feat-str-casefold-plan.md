---
title: "feat: str casefold"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 201 next steps
---

# str casefold

## Summary

Add **`str.casefold()`** returning a casefolded copy for caseless matching, with CPython-aligned behavior on derived test samples.

---

## Problem Frame

Plan 201 landed `str.join`. LIVING-PLAN next priority is `casefold` before `format`. Unlike `lower`, casefold maps eszett, ligatures, micro sign, combining iota, and final sigma per Unicode case folding.

---

## Requirements

- R1. `'hello'.casefold()` → `'hello'`; `'hELlo'.casefold()` → `'hello'`
- R2. `'ß'.casefold()` → `'ss'`; `'ﬁ'.casefold()` → `'fi'`
- R3. `'\u03a3'.casefold()` → `'\u03c3'`; `'A\u0345\u03a3'.casefold()` → `'a\u03b9\u03c3'`
- R4. `'\u00b5'.casefold()` → `'\u03bc'`
- R5. Add `test/cpython-derived/str-casefold.test.ts` (from CPython `test_str.test_casefold`)
- R6. validation-ladder + LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No full Unicode CaseFolding.txt table — targeted map + NFD walk + `toLowerCase` fallback for derived samples
- No `str.format` in this slice

---

## Implementation Units

- U1. `casefoldStr` helper + register on `strType` (after `lower`)
- U2. Vitest evidence in `str-casefold.test.ts`
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. ASCII identity and mixed case
- T2. Eszett and fi ligature
- T3. Greek sigma, combining iota + sigma
- T4. Micro sign to mu

---

## Patterns

Follow `upper`/`lower` registration in `str.ts`; casefold uses NFD iteration with a small `CASEFOLD_OVERRIDES` map for multi-code-point folds.
