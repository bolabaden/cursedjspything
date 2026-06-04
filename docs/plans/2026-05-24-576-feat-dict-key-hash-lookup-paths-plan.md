---
title: "feat: dict key hash on delitem and contains (plan 576)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 574
---

# dict key hash on remaining lookup paths

## Summary

Plan 574 validated invalid `__hash__` and insert paths. Complete dict key strictness evidence for **`delItem`**, **`contains`**, and **unhashable** PyObject keys (`list`) on the same `dictFindKey` / `dictKeyHash` paths.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `delItem(dict, badHashKey)` raises `TypeError` with `__hash__ method should return an integer` |
| R2 | `contains(dict, badHashKey)` raises same |
| R3 | `setItem` / `getItem` / `delItem` / `contains` with `pyList([])` raise `unhashable type: 'list'` |
| R4 | Extend `test/builtins/dict-keys.test.ts`; validation-ladder note (plan 576) |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes unless tests fail; PEP 3118; set/frozenset hash tables.

## Implementation Units

### U1. Tests + docs

**Files:** `test/builtins/dict-keys.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
