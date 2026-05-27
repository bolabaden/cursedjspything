---
title: "feat: str classification predicates"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 175 next steps
---

# str classification predicates

## Summary

Add **`str.isalpha`**, **`isdigit`**, **`isalnum`**, **`islower`**, **`isupper`**, **`istitle`**, and **`isspace`** with Unicode-aware checks, mirroring `bytes` predicate methods.

---

## Problem Frame

Str has `isascii`; bytes has full predicate set. Next str API slice from LIVING-PLAN.

---

## Requirements

- R1. `"abc".isalpha()` → True; `"123".isdigit()` → True; `"a1".isalnum()` → True; `""` → False for all
- R2. `"abc".islower()` → True; `"ABC".isupper()` → True; `"Hello World".istitle()` → True
- R3. `" \t\n".isspace()` → True; `"café".isalpha()` → True
- R4. `test/cpython-derived/str-predicates.test.ts`
- R5. validation-ladder + LIVING-PLAN delta
- R6. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No find/index/count in this slice

---

## Implementation Units

- U1. Predicate helpers + methods on `strType`
- U2. Vitest evidence mirroring `bytes-predicates.test.ts`
- U3. Docs + feature branch + PR
