---
title: "feat: range slice __getitem__ (plan 887)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN deferred parity after plan 885 int builtin
---

# `range` slice `__getitem__`

## Summary

`range.__getitem__` accepts integer indices but rejects `slice` keys with `TypeError`. CPython returns a new `range` object for slice subscripts. Implement slice indexing mirroring CPython semantics.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `range[slice]` returns a new `range` object (not list/tuple) |
| R2 | Contiguous and stepped slices map to correct `(start, stop, step)` |
| R3 | Empty slice returns empty `range` with CPython-aligned bounds (e.g. `range(5)[5:10]` → `range(5, 5)`) |
| R4 | `slice step == 0` → `ValueError: slice step cannot be zero` |
| R5 | Non-int/non-slice key keeps existing `TypeError` messages |
| R6 | Extend `range-builtin.test.ts`; update compatibility + living-plan + validation-ladder |
| R7 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `list.extend` from arbitrary iterables deferred to follow-up plan.
- No `range` slice assignment (immutable type).

## Implementation Units

### U1. Slice subscript in `rangeGetItem`

**Files:** `src/runtime/builtins/range.ts`

**Approach:** Use `isSlice`, `resolvedSliceFields`, `sliceIndices`, `sliceAdjustIndices` on `rangeLength(fields)`. Map selected logical indices to values; compute `new_start`, `new_stop`, `new_step = fields.step * sliceStep`.

### U2. Tests and docs

**Files:** `test/cpython-derived/range-builtin.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/LIVING-PLAN.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
