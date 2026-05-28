---
title: "feat: str replace"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 185 next steps
---

# str replace

## Summary

Add **`str.replace`** with optional `count`, non-overlapping semantics, and empty-old insertion rules, mirroring `bytes.replace`.

---

## Problem Frame

Affix/search slice landed in plans 178–184. Replace is next from LIVING-PLAN.

---

## Requirements

- R1. `"abcabc".replace("bc", "x")` → `"axax"`; count limits replacements
- R2. Non-overlapping: `"aaa".replace("aa", "x")` → `"xa"`
- R3. Empty old inserts new between characters; empty new removes matches
- R4. Non-str old/new → `PyTypeError` (`must be str, not …`)
- R5. `test/cpython-derived/str-replace.test.ts` mirroring `bytes-replace.test.ts`
- R6. validation-ladder + LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No removeprefix/removesuffix in this slice

---

## Implementation Units

- U1. `replaceStr` helpers reusing `findStrSepIndex` + `splitMaxsplitArg` + register on `strType`
- U2. Vitest evidence in `str-replace.test.ts`
- U3. Docs + feature branch + PR
