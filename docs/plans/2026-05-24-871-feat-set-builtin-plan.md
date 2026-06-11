---
title: "feat: set builtin (plan 871)"
type: feat
status: completed
date: 2026-05-24
origin: plan 870 deferred set() constructor
---

# builtin `set`

## Summary

pyrt has `pySet` but no CPython-style `set()` builtin. Add `set()` → empty set, `set(iterable)` → materialized set with deduplication via existing `pySet`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `set()` — return empty `pySet` |
| R2 | `set(iterable)` — materialize via `iter`/`next`; dedupe via `pySet` |
| R3 | 2+ args → `TypeError: set expected at most 1 argument, got N` |
| R4 | Non-iterable → `TypeError` from `iter()`; unhashable members propagate |
| R5 | Export from `barrel/stable.ts`; `set-builtin.test.ts` + docs |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `frozenset()` / `dict()` deferred.
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
