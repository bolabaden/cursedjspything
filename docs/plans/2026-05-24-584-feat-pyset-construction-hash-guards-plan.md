---
title: "feat: pySet construction hash guards (plan 584)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 582
---

# pySet construction hash guards

## Summary

Plan 582 guards `pyFrozenSet` construction. `pySet(items)` still accepts unhashable elements. Mirror frozenset: validate each item in `pySet` via `requireHashableElement`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `pySet([pyList([])])` raises `unhashable type: 'list'` at construction |
| R2 | `pySet([badHashKey])` raises `__hash__ method should return an integer` at construction |
| R3 | Extend `set-mutation.test.ts`; validation-ladder note (plan 584) |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- PEP 3118; set algebra result types (operands already guarded when built via pySet).

## Implementation Units

### U1. Runtime

**Files:** `src/runtime/builtins/set.ts` — hash-check items in `pySet`.

### U2. Tests + docs

**Files:** `test/cpython-derived/set-mutation.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
