---
title: "feat: str isidentifier/isdecimal/isnumeric/isprintable (plan 847)"
type: feat
status: completed
date: 2026-05-24
origin: COMPATIBILITY §8 niche str API; LIVING-PLAN post-846
---

# str extended Unicode predicates

## Summary

Implement four missing **`str`** methods — **`isidentifier`**, **`isdecimal`**, **`isnumeric`**, **`isprintable`** — matching CPython Unicode rules used by existing predicate helpers (`\p{L}`, `\p{Nd}`, etc.). Extend **`str-predicates.test.ts`**, sync §8 str API evidence, validation-ladder, LIVING-PLAN.

## Problem Frame

`str.ts` exposes `isalpha`…`isascii` but not `isidentifier` / `isdecimal` / `isnumeric` / `isprintable`. `getAttr(pyStr('x'), 'isidentifier')` fails at runtime.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `isidentifier`: PEP 3131 XID rules + leading `_`; empty → False |
| R2 | `isdecimal`: all `\p{Nd}`, non-empty required |
| R3 | `isnumeric`: all `\p{Number}`, non-empty required |
| R4 | `isprintable`: empty → True; reject `\p{Cc}` and `\p{Cf}` |
| R5 | Return `pyTrue`/`pyFalse` singletons |
| R6 | Vitest + docs + merge PR #514 first |
| R7 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `str.ts` + tests + docs only
- Do not change existing `isdigit` Nd-only semantics in this slice

## Implementation Units

- U1. Four predicate helpers + typeDict entries in `str.ts`
- U2. Extend `str-predicates.test.ts`
- U3. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
