---
title: "feat: frozenset builtin (plan 872)"
type: feat
status: completed
date: 2026-05-24
origin: plan 871 deferred frozenset() constructor
---

# builtin `frozenset`

## Summary

pyrt has `pyFrozenSet` but no CPython-style `frozenset()` builtin. Add `frozenset()` → empty frozenset, `frozenset(iterable)` → materialized immutable set via existing `pyFrozenSet`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `frozenset()` — return empty `pyFrozenSet` |
| R2 | `frozenset(iterable)` — materialize and dedupe via `pyFrozenSet` |
| R3 | 2+ args → `TypeError: frozenset expected at most 1 argument, got N` |
| R4 | Non-iterable → `TypeError` from `iter()`; unhashable propagates |
| R5 | Export from `barrel/stable.ts`; `frozenset-builtin.test.ts` + docs |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `dict()` deferred.
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
