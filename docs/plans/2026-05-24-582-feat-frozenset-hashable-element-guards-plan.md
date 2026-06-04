---
title: "feat: frozenset build and contains hash guards (plan 582)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 580
---

# frozenset hashable element guards

## Summary

Plan 580 guards set mutation paths. Frozenset still accepts unhashable elements at `pyFrozenSet()` build and in `__contains__` probes. Share `requireHashableSetElement` with set; validate in `pyFrozenSet` and frozenset `__contains__`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `pyFrozenSet([pyList([])])` raises `unhashable type: 'list'` at construction |
| R2 | `pyFrozenSet([badHashKey])` raises `__hash__ method should return an integer` at construction |
| R3 | `contains(frozenset, unhashable)` raises same errors as set |
| R4 | Extract shared helper; set imports unchanged behavior |
| R5 | Extend `frozenset-hash.test.ts`; validation-ladder (plan 582) |
| R6 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Frozenset algebra rebuilding (elements already hash-checked if from valid frozensets); PEP 3118.

## Implementation Units

### U1. Shared helper + frozenset

**Files:** `src/runtime/builtins/hashable-element.ts`, `src/runtime/builtins/set.ts`, `src/runtime/builtins/frozenset.ts`

### U2. Tests + docs

**Files:** `test/cpython-derived/frozenset-hash.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
