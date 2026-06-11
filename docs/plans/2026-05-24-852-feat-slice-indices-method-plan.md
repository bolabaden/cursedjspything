---
title: "feat: slice.indices(length) parity (plan 852)"
type: feat
status: completed
date: 2026-05-24
origin: plan 851 deferred slice.indices(); subscript normalization exists in sliceIndices only
---

# `slice.indices(length)` CPython parity

## Summary

CPython `slice.indices(length)` returns `(start, stop, step)` after normalizing bounds for a sequence of given length. pyrt has internal `sliceIndices` but no method. Extract shared `sliceAdjustIndices`, add `slice.indices` returning `pyTuple` of `pyInt`, accept `pyInt`/`__index__` length, add Vitest + docs.

## Problem Frame

- `getAttr(pySlice(1, 3), "indices")(pyInt(10))` missing today.
- Normalization logic is embedded in `sliceIndices` without a reusable triple export.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `sliceAdjustIndices(length, start, stop, step)` → `[start, stop, step]`; refactor `sliceIndices` to use it |
| R2 | `slice.indices(length)` uses `resolvedSliceFields` + integer length via `pyIndexAsInteger` |
| R3 | Negative length → `ValueError`; zero step → `ValueError`; non-integer length → `TypeError` |
| R4 | `test/cpython-derived/slice-indices.test.ts` with CPython-derived samples |
| R5 | §8.15 docs, validation-ladder, LIVING-PLAN |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No mapping slice / `__getitem__` on dict changes.
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
