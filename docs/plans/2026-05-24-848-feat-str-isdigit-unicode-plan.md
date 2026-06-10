---
title: "feat: str.isdigit CPython Unicode digit parity (plan 848)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN plan 847 next; Nd-only isdigit gap
---

# str.isdigit Unicode digit parity

## Summary

`str.isdigit` currently accepts only `\p{Nd}` (decimal digits). CPython also treats 128 **compatibility digit** codepoints (superscripts, circled digits, etc.) as digits while excluding vulgar fractions (`½`). Add `isUnicodeDigitCodePoint` with Nd + curated ranges from CPython 3.14 `str.isdigit`, update **`strIsalnum`** to match, extend **`str-predicates.test.ts`**, sync docs.

## Problem Frame

- `pyStr('³').isdigit()` → False; CPython → True.
- `isdecimal` stays Nd-only; `isnumeric` stays `\p{Number}` (plan 847).
- `bytes.isdigit` remains ASCII `0-9` only (CPython parity).

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `str.isdigit` True for Nd + 128 non-Nd digit codepoints (20 ranges) |
| R2 | `½`, `Ⅷ`, `〇` remain False for isdigit |
| R3 | `str.isalnum` uses same digit classifier |
| R4 | Vitest + validation-ladder + LIVING-PLAN |
| R5 | Merge PR #515; `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `str.ts` + tests + docs only
- No `bytes.isdigit` change

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
