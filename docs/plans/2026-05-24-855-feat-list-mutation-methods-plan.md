---
title: "feat: list append/extend/insert/pop methods (plan 855)"
type: feat
status: completed
date: 2026-05-24
origin: list lacks CPython mutation methods after slice subscript parity
---

# list `append` / `extend` / `insert` / `pop`

## Summary

pyrt `list` supports subscript mutation but not `append`, `extend`, `insert`, or `pop`. Add methods mirroring CPython: `append`/`extend` return `None`; `insert` clamps index; `insert`/`pop` accept `pyInt`/`__index__`; `pop` raises `IndexError` on empty list.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `append(item)` — push; return `pyNone` |
| R2 | `extend(iterable)` — reuse `listItemsFromIterable`; return `pyNone` |
| R3 | `insert(index, item)` — clamped index via `listIndexKey`; `pyInt`/`__index__` |
| R4 | `pop(index?)` — default last; `IndexError` if empty or OOR |
| R5 | `list-mutation-methods.test.ts` + docs |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `extend` accepts `pyList`/`pyTuple` only (same as plan 854).
- `clear`/`copy`/`index`/`count` deferred.
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
