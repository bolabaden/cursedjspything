---
title: "feat: dict.keys values items views (plan 606)"
type: feat
status: active
date: 2026-05-24
origin: plan 604; dict method surface
---

# dict.keys / values / items views

## Summary

Add **`dict.keys()`**, **`dict.values()`**, and **`dict.items()`** returning live view objects (`dict_keys`, `dict_values`, `dict_items`) with **`len`**, **`iter`**, and **`__contains__`** (keys via `dictHas`; values/items via `eq`). Vitest + §8.5 / §10.6 docs.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `keys()` view `len` matches dict size; iter yields insertion-order keys |
| R2 | `keys()` view reflects dict mutation (`len` grows after insert) |
| R3 | `key in keys_view` uses hash+eq (`dictHas`) |
| R4 | `values()` iter yields values in insertion order |
| R5 | `items()` iter yields `(key, value)` tuples |
| R6 | `dict-keys-values-items-views.test.ts`; COMPATIBILITY + validation-ladder |
| R7 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Full CPython view repr/set algebra; `MappingProxyType`; mutation during iteration edge cases.

## Implementation Units

### U1. `src/runtime/builtins/dict-views.ts`

- View native holds parent `PyObject` (dict).
- Factory `dictKeysView` / `dictValuesView` / `dictItemsView`.

### U2. `src/runtime/builtins/dict.ts`

- Wire `keys`, `values`, `items` methods.

### U3. Tests and docs

- `test/cpython-derived/dict-keys-values-items-views.test.ts`
- `docs/COMPATIBILITY_AND_GAPS.md` §8.5 and §10.6
- `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
