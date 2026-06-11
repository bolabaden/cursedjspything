---
title: "feat: list/tuple builtins (plan 870)"
type: feat
status: completed
date: 2026-05-24
origin: iterable builtins landed; list()/tuple() missing
---

# builtin `list` / `tuple`

## Summary

pyrt exposes `pyList`/`pyTuple` constructors but no CPython-style `list()` / `tuple()` builtins. Add `list()` → empty list, `list(iterable)` → materialized copy; same for `tuple`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `list()` — return empty `pyList` |
| R2 | `list(iterable)` — materialize via `iter`/`next`; return new `pyList` |
| R3 | `tuple()` — return empty `pyTuple` |
| R4 | `tuple(iterable)` — materialize; return new `pyTuple` |
| R5 | 2+ args → `TypeError: list()/tuple() expected at most 1 argument, got N` |
| R6 | Non-iterable → `TypeError` from `iter()` |
| R7 | Export from `barrel/stable.ts`; `list-tuple-builtin.test.ts` + docs |
| R8 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `list(iterable, strict=)` / `dict()` / `set()` deferred.
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
