---
title: "feat: tuple __hash__ unhashable element strictness (plan 586)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 584
---

# tuple __hash__ unhashable element strictness

## Summary

`tuple.__hash__` currently treats elements without `__hash__` as hash `0`, so `hash(([],))` succeeds incorrectly. Use `hash()` per element (like `frozensetHash`) so unhashable and invalid-`__hash__` elements raise `TypeError`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `hash(pyTuple([pyList([])]))` raises `unhashable type: 'list'` |
| R2 | `hash(pyTuple([badHashKey]))` raises `__hash__ method should return an integer` |
| R3 | Empty tuple and int tuples still match existing sentinel/order tests |
| R4 | Extend `tuple-hash.test.ts`; validation-ladder (plan 586) |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- `pyTuple` construction guards (CPython allows unhashable tuple elements until hashed); PEP 3118.

## Implementation Units

### U1. Runtime

**Files:** `src/runtime/builtins/tuple.ts` — call `hash()` from `compare.ts` per element in `__hash__`.

### U2. Tests + docs

**Files:** `test/cpython-derived/tuple-hash.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
