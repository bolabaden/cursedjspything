---
title: "feat: str format arbitrary bracket keys"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 211 next steps
---

# str format arbitrary bracket keys

## Summary

Relax format field **`[...]`** subscript keys to accept any non-empty string between brackets (hyphens, spaces, punctuation), matching CPython. Keep unsigned integer literals as native list indices.

---

## Problem Frame

Plan 208 limited bracket keys to integer literals and identifiers. CPython accepts `{0[a-b]}`, `{0[space test]}`, `{0[@]}`. LIVING-PLAN next format parity item.

---

## Requirements

- R1. `{0[a-b]}` resolves dict key `a-b`
- R2. `{0[space test]}` resolves dict key with spaces
- R3. Unsigned `{0[0]}` still uses native integer index for lists
- R4. `{0[-1]}` uses string key `"-1"` (dict), not list negative index
- R5. Empty `[]` → `ValueError`
- R6. Extend `test/cpython-derived/str-format.test.ts`
- R7. validation-ladder + LIVING-PLAN delta

---

## Scope Boundaries

- No quoted-string literal parsing (`'key'` / `"key"` inside brackets stays literal if present)
- No expression evaluation inside brackets; PEP 3118 out of scope

---

## Implementation Units

- U1. Simplify bracket key parsing in `parseFieldName`
- U2. Tests + docs + feature branch + PR

---

## Test Scenarios

- T1. Hyphenated dict key `{0[a-b]}`
- T2. Spaced dict key `{0[space test]}`
- T3. String key `-1` on dict vs list TypeError/IndexError parity
- T4. Empty bracket rejected

---

## Patterns

Follow plan 208 `subscriptKeyForGetItem`; only change bracket token acceptance.
