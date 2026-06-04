---
title: "feat: slice unhashable __hash__ evidence (plan 570)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 568
---

# slice unhashable __hash__ evidence

## Summary

CPython: `slice` objects are not hashable. pyrt omits `__hash__` on `sliceType`. Add `slice-unhashable.test.ts` and validation-ladder row (alongside list/dict/set guards).

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `hash(pySlice())` raises `TypeError` with `unhashable type: 'slice'` |
| R2 | `hash(pySlice(0, 0))` and `hash(pySlice(1, 2, 3))` raise same |
| R3 | validation-ladder documents `slice-unhashable.test.ts` (plan 570) |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; empty tuple / None hash linkage (plans 564/566).

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/slice-unhashable.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
