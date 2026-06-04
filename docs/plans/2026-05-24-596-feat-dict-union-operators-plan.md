---
title: "feat: dict | and |= union operators (plan 596)"
type: feat
status: active
date: 2026-05-24
origin: plan 594; CPython 3.9+ dict merge
---

# Dict union operators (`|` / `|=`)

## Brainstorm

| CPython 3.9+ | pyrt before 596 |
|--------------|-----------------|
| `d1 \| d2` new dict, rhs overwrites | `TypeError` (no `__or__`) |
| `d1 \|= d2` in-place merge | `TypeError` (no `__ior__`) |

Must use **`dictSet`** / **`dictFindKey`** so equal-but-distinct keys merge like other dict paths (plans 574–588).

## Summary

Implement `dict.__or__` / `__ror__` (via `NotImplemented` on wrong types) and `__ior__` on `dictType`; Vitest + §8.5/8.6 docs.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `bitwiseOr(d1, d2)` returns new dict; rhs keys overwrite lhs |
| R2 | `ior(d1, d2)` mutates lhs in place |
| R3 | `dict \| list` and `list \| dict` still `TypeError` |
| R4 | Equal `__eq__`/`__hash__` keys: merge updates value, no duplicate keys |
| R5 | `dict-union.test.ts`; COMPATIBILITY + validation-ladder |
| R6 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- General mapping protocol; `collections.ChainMap`; PEP 3118.

## Implementation Units

### U1. `dict.ts` — `Slot.or`, `Slot.ior`

### U2. Tests + docs

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
