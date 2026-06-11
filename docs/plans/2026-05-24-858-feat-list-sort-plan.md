---
title: "feat: list sort method (plan 858)"
type: feat
status: completed
date: 2026-05-24
origin: plan 857 deferred list.sort
---

# list `sort`

## Summary

pyrt `list` has mutation/search helpers but no `sort`. Add in-place stable sort using `lt`/`gt` rich comparison (CPython default ordering), optional `reverse` bool/`pyTrue`/`pyFalse`, return `None`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `sort(reverse=False)` — in-place stable sort via `lt`/`gt`; return `pyNone` |
| R2 | `reverse` accepts JS `boolean`, `pyTrue`, `pyFalse`; invalid type → `TypeError` |
| R3 | Incomparable elements propagate `TypeError` from rich compare |
| R4 | `list-sort.test.ts` + update §8.17 / LIVING-PLAN |
| R5 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `key=` and builtin `sorted()` deferred (no general callable invoke on list methods yet).
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
