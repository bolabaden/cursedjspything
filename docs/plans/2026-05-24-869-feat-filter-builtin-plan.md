---
title: "feat: filter builtin (plan 869)"
type: feat
status: completed
date: 2026-05-24
origin: plan 868 map landed; filter deferred
---

# builtin `filter`

## Summary

pyrt has `map` (plan 868) but no `filter`. Add CPython-parity `filter(func, iterable)` returning an iterator that yields items passing the predicate; `filter(None, iterable)` keeps truthy items.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `filter(func, iterable)` — yield `item` when `bool(func(item))` |
| R2 | `filter(None, iterable)` — yield `item` when `bool(item)` |
| R3 | Wrong arity → `TypeError: filter expected 2 arguments, got N` |
| R4 | Non-callable `func` (except `None`) → `TypeError` |
| R5 | Non-iterable → `TypeError` from `iter()`; iterator `__iter__` returns self |
| R6 | New `filter-iterator.ts`; export `filter` from `barrel/stable.ts` |
| R7 | `filter-builtin.test.ts` + docs |
| R8 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
