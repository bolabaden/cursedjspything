---
title: "feat: dict.fromkeys (plan 608)"
type: feat
status: active
date: 2026-05-24
origin: plan 606; dict method surface
---

# dict.fromkeys

## Summary

Add **`dict.fromkeys(iterable[, value])`** on `dictType`, building a new dict with keys from the iterable and each value defaulting to **`None`**. Keys use **`dictSet`** (hash+eq dedupe). Vitest + §8.5 docs.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `fromkeys` creates dict with one entry per distinct iterable key |
| R2 | Default value is `None` when omitted |
| R3 | Explicit `value` used for all keys |
| R4 | Equal-but-distinct keys in iterable collapse to one entry |
| R5 | Non-iterable raises `TypeError` |
| R6 | `dict-fromkeys.test.ts`; COMPATIBILITY + validation-ladder |
| R7 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Subclass `fromkeys` hooks; `MappingProxyType`.

## Implementation Units

### U1. `src/runtime/builtins/dict.ts` + `src/runtime/core/lookup.ts`

- `fromkeys` on `dictType.typeDict`; iterate via `iter`/`next`; `dictSet` each key.
- `defaultGetAttr`: resolve attributes on `PyType` via the type's own MRO (enables `getAttr(dictType, "fromkeys")`).

### U2. Tests and docs

- `test/cpython-derived/dict-fromkeys.test.ts`
- `docs/COMPATIBILITY_AND_GAPS.md` §8.5
- `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
