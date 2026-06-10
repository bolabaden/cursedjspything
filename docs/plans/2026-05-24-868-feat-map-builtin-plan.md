---
title: "feat: map builtin (plan 868)"
type: feat
status: completed
date: 2026-05-24
origin: plan 867 min/max landed; map missing from protocols
---

# builtin `map`

## Summary

pyrt has iterable builtins through `zip` (plans 859–867) but no `map`. Add CPython-parity `map(func, *iterables)` returning an iterator that applies `func` to each item (or aligned items), stopping when the shortest input is exhausted.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `map(func, iterable)` — yield `func(item)` for each item |
| R2 | `map(func, iter1, iter2, ...)` — yield `func(a, b, ...)` until shortest exhausted |
| R3 | Fewer than 2 args → `TypeError: map() must have at least two arguments` |
| R4 | Non-callable `func` → `TypeError`; non-iterable → `TypeError` from `iter()` |
| R5 | Iterator `__iter__` returns self |
| R6 | New `map-iterator.ts`; export `map` from `barrel/stable.ts` |
| R7 | `map-builtin.test.ts` + docs |
| R8 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `filter()` deferred to a follow-on slice.
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
