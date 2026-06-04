---
title: "feat: frozenset hash unhashable element evidence (plan 578)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 576
---

# frozenset hash unhashable element

## Summary

`frozensetHash` mixes `hash()` of each element. CPython raises when any element is unhashable. Add evidence that `hash(pyFrozenSet([pyList(...)]))` and frozensets holding invalid-`__hash__` user keys raise the expected `TypeError`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `hash(pyFrozenSet([pyList([])]))` raises `TypeError` with `unhashable type: 'list'` |
| R2 | `hash(pyFrozenSet([badHashKey]))` raises `__hash__ method should return an integer` |
| R3 | Extend `test/cpython-derived/frozenset-hash.test.ts`; validation-ladder row (plan 578) |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; set.add unhashable guard; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/frozenset-hash.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
