---
title: "feat: list.extend from arbitrary iterables (plan 888)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN deferred parity after plan 887 range slice getitem
---

# `list.extend` from arbitrary iterables

## Summary

`list.extend` and slice assignment reuse `listItemsFromIterable`, which only accepts `pyList`/`pyTuple`. CPython accepts any iterable (`range`, `set`, `str`, iterators). Wire `iter`/`next` for the general path.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `extend(iterable)` consumes arbitrary iterables via `iter`/`next` |
| R2 | Fast-path `pyList`/`pyTuple` copy preserved |
| R3 | Non-iterable raises `'typename' object is not iterable` (from `iter()`) |
| R4 | Slice `__setitem__` benefits from same helper (str/range assign work) |
| R5 | Update `list-mutation-methods.test.ts` + `list-slice-mutation.test.ts`; docs |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- PEP 3118 out of scope.
- Generator/iterator types without `__iter__` but with `__getitem__` use existing `iter()` fallback.

## Implementation Units

### U1. `listItemsFromIterable` generalization

**Files:** `src/runtime/builtins/list.ts`

### U2. Tests and docs

**Files:** `test/cpython-derived/list-mutation-methods.test.ts`, `test/cpython-derived/list-slice-mutation.test.ts`, living-plan, validation-ladder

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
