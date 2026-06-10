---
title: "feat: zip builtin (plan 866)"
type: feat
status: completed
date: 2026-05-24
origin: plan 865 enumerate landed; zip missing from protocols
---

# builtin `zip`

## Summary

pyrt has iterable builtins through `enumerate` (plans 859–865) but no `zip`. Add CPython-parity `zip(*iterables)` returning an iterator that yields tuples of aligned items, stopping when the shortest input is exhausted.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `zip(iter1, iter2, ...)` — yield `pyTuple` of next items from each iterable |
| R2 | Single iterable yields 1-tuples |
| R3 | Zero args → `TypeError: zip() expected at least 1 argument, got 0` |
| R4 | Stops at shortest iterable (`PyStopIteration` when any input exhausted) |
| R5 | Non-iterable arg → `TypeError` from `iter()` |
| R6 | Iterator `__iter__` returns self |
| R7 | New `zip-iterator.ts`; export `zip` from `barrel/stable.ts` |
| R8 | `zip-builtin.test.ts` + docs |
| R9 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `strict=` (Python 3.10+) deferred.
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
