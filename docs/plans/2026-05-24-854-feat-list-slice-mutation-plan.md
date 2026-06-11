---
title: "feat: list slice __setitem__/__delitem__ parity (plan 854)"
type: feat
status: completed
date: 2026-05-24
origin: list getitem accepts slice but setitem/delitem only integer keys
---

# list slice assignment and deletion

## Summary

`list.__getitem__(slice)` works; `__setitem__` and `__delitem__` reject slice keys. Implement CPython-style slice mutation: contiguous splice (`step=1`), extended assignment (`step≠1`), slice deletion, accepting `pyList`/`pyTuple` values.

## Problem Frame

- `delItem(pyList([1,2,3]), pySlice(1, 2))` → `TypeError: list indices must be integers`.
- `setItem(lst, pySlice(1, 3), pyList([9]))` same.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `listItemsFromIterable` — `pyList`/`pyTuple` only; else `TypeError` |
| R2 | `__delitem__(slice)` — delete indices from `sliceIndices` (high to low) |
| R3 | `__setitem__(slice, iterable)` — `step=1` via `sliceAdjustIndices` + `splice`; else extended assign with size check |
| R4 | `list-slice-mutation.test.ts` — delete, replace, insert, extended, errors |
| R5 | §8.15 docs, validation-ladder, LIVING-PLAN |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No arbitrary iterable protocol beyond list/tuple.
- str/bytes slice mutation out of scope.
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
