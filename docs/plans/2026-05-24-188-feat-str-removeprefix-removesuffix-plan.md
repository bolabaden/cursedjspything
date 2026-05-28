---
title: "feat: str removeprefix and removesuffix"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 187 next steps
---

# str removeprefix / removesuffix

## Summary

Add **`str.removeprefix(prefix)`** and **`str.removesuffix(suffix)`** returning `pyStr` with affix stripped when present (Python 3.9+), mirroring landed `bytes.removeprefix` / `removesuffix`.

---

## Problem Frame

Plan 187 next step lists removeprefix/center. Replace and affix search landed in plans 184–186. These pair with `str.startswith` / `str.endswith` and reuse existing str affix helpers.

---

## Requirements

- R1. `"hello".removeprefix("he")` → `"llo"`; no match → unchanged
- R2. `"hello".removesuffix("lo")` → `"hel"`; no match → unchanged
- R3. Empty affix → unchanged str
- R4. Prefix/suffix must be `str`; wrong type → `PyTypeError` (`must be str, not …`)
- R5. Add `test/cpython-derived/str-removeprefix-removesuffix.test.ts`
- R6. validation-ladder + LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No tuple affixes (CPython rejects for removeprefix/removesuffix)
- No `str.center` in this slice

---

## Implementation Units

- U1. `requireAffixStr`, `removePrefixStr` / `removeSuffixStr` + register on `strType`
- U2. Vitest evidence in `str-removeprefix-removesuffix.test.ts`
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Strip matching prefix/suffix
- T2. No match and empty affix unchanged
- T3. Non-str affix → `PyTypeError`
- T4. Unicode affix stripping

---

## Patterns

Reuse `strStartsWithSlice` / `strEndsWithSlice`; mirror `removePrefixBytes` / `removeSuffixBytes` in `bytes.ts`.
