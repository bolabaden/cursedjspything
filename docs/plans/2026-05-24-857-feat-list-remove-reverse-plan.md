---
title: "feat: list remove/reverse methods (plan 857)"
type: feat
status: completed
date: 2026-05-24
origin: plan 856 deferred list.remove and list.reverse
---

# list `remove` / `reverse`

## Summary

pyrt `list` has search and shallow-copy helpers (plan 856) but not `remove` or `reverse`. Add CPython-parity methods: `remove` deletes the first `eq()` match (or raises `ValueError`); `reverse` reverses elements in place and returns `None`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `remove(value)` — first `eq()` match removed via `splice`; return `pyNone` |
| R2 | Missing value → `PyValueError("list.remove(x): x not in list")` |
| R3 | `reverse()` — in-place `Array.reverse()`; return `pyNone` |
| R4 | Reuse `listItemEq` from plan 856 |
| R5 | `list-remove-reverse.test.ts` + update §8.17 / LIVING-PLAN |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `sort` deferred (richcompare sort is a larger slice).
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
