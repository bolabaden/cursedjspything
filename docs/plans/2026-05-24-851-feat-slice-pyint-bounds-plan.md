---
title: "feat: slice object pyInt/__index__ bounds parity (plan 851)"
type: feat
status: completed
date: 2026-05-24
origin: slice native fields are JS numbers only; subscript ignores pyInt bounds on slice objects
---

# slice `start`/`stop`/`step` pyInt/`__index__` parity

## Summary

`pySlice` stores `start`/`stop`/`step` as raw JS numbers. CPython `slice` objects hold optional `int` (or `None`) and accept `__index__` at subscript time. Extend `SliceFields` to allow `PyObject` bounds, resolve via `pyIndexAsInteger` when sequences subscript with a slice, update repr, add Vitest + docs.

## Problem Frame

- `getItem(lst, pySlice(pyInt(1), pyInt(3), null))` treats `pyInt` as truthy object in native storage or fails coercion today.
- `str`/`bytes` `parseBoundIndex` already resolves index objects for method `start`/`end`, but `__getitem__(slice(...))` reads numeric fields only.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `SliceBound` type and `resolvedSliceFields()` in `slice.ts` using `pyIndexAsInteger` |
| R2 | `pySlice()` accepts `SliceBound` arguments; repr shows numeric text for int/bool bounds |
| R3 | `str`/`bytes`/`list`/`tuple` `__getitem__` slice path uses `resolvedSliceFields` |
| R4 | Extend `slice-with.test.ts` + str/bytes slice tests with `pyInt`/`__index__` bounds |
| R5 | §8.15 docs, validation-ladder, LIVING-PLAN |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No `slice.indices()` method (separate slice if needed).
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
