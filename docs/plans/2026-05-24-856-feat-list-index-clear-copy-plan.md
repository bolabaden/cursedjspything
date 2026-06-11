---
title: "feat: list index/count/clear/copy methods (plan 856)"
type: feat
status: completed
date: 2026-05-24
origin: plan 855 deferred list search and shallow-copy helpers
---

# list `index` / `count` / `clear` / `copy`

## Summary

pyrt `list` has `append`/`extend`/`insert`/`pop` (plan 855) but lacks `index`, `count`, `clear`, and `copy`. Add CPython-parity methods: `eq()`-based search with optional `start`/`stop` bounds, `ValueError` when `index` misses, shallow `copy` via `pyList`, and in-place `clear`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `index(value, start?, stop?)` — first `eq()` match in `[start, stop)`; `PyValueError("list.index(x): x not in list")` on miss |
| R2 | `count(value, start?, stop?)` — count `eq()` matches in range; return `pyInt` |
| R3 | `start`/`stop` accept `pyInt`, `bool`, `__index__`; slice-style negative/clamp bounds (mirror `strSliceBounds`) |
| R4 | `clear()` — empty list in place; return `pyNone` |
| R5 | `copy()` — shallow copy via `pyList([...arr])` |
| R6 | `list-index-clear-copy.test.ts` + update §8.17 / LIVING-PLAN |
| R7 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `remove`/`reverse`/`sort` deferred.
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
