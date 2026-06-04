---
title: "feat: dict.pop and dict.popitem (plan 604)"
type: feat
status: active
date: 2026-05-24
origin: plan 602; dict method surface
---

# dict.pop and dict.popitem

## Summary

Add **`dict.pop(key[, default])`** (remove via `dictGet`/`dictDelete`; `KeyError` or default) and **`dict.popitem()`** (remove last inserted pair; return `(key, value)` tuple). Vitest + §8.5 docs.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `pop` removes matching key and returns value |
| R2 | `pop` raises `KeyError` when key absent and no default |
| R3 | `pop` returns `default` when key absent and default provided |
| R4 | Equal-but-distinct keys: `pop(k2)` removes entry stored under `k1` |
| R5 | `popitem` returns `(key, value)` for last inserted item; shrinks dict |
| R6 | `popitem` on empty dict raises `KeyError` |
| R7 | `dict-pop-popitem.test.ts`; COMPATIBILITY + validation-ladder |
| R8 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- `keys`/`values`/`items` views; arbitrary popitem ordering beyond JS `Map` insertion order.

## Implementation Units

### U1. `src/runtime/builtins/dict.ts`

- `pop`: `dictGet` → `dictDelete` → return; else default or `PyKeyError`.
- `popitem`: if empty `KeyError`; else last `Map` entry → delete → `pyTuple([k, v])`.
- Import `pyTuple` from `tuple.js`.

### U2. Tests and docs

- `test/cpython-derived/dict-pop-popitem.test.ts`
- `docs/COMPATIBILITY_AND_GAPS.md` §8.5
- `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
