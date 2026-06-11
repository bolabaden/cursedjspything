---
title: "feat: reversed(range) (plan 876)"
type: feat
status: completed
date: 2026-05-24
origin: plan 875 deferred reversed(range) / range __reversed__
---

# `reversed(range)`

## Summary

Plan 875 landed `range()` with forward iteration. Add `range.__reversed__` so builtin `reversed(range(...))` yields elements last-to-first, matching CPython for positive, negative, and empty ranges.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `reversed(range(n))` yields `n-1 .. 0` |
| R2 | `reversed(range(start, stop, step))` walks indices from `len-1` down to `0` |
| R3 | Empty range → immediate `PyStopIteration` on first `next` |
| R4 | Iterator `__iter__` returns self |
| R5 | Extend `range-builtin.test.ts`; update docs |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `range` equality / hashing still deferred.
- PEP 3118 out of scope.

## Implementation Units

### U1. `range.__reversed__`

**Goal:** Reverse iterator via index walk.

**Requirements:** R1–R4

**Files:** `src/runtime/builtins/range.ts`

**Approach:** Add `Hook.reversed` on `rangeType` returning a `range_iterator` that decrements logical index from `len-1` to `0`, computing `start + index * step` each step.

**Test scenarios:** forward/reverse pairs for `range(5)`, `range(5,0,-1)`, `range(0,10,2)`, empty `range(0)`.

### U2. Docs

**Requirements:** R5, R6

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/LIVING-PLAN.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
