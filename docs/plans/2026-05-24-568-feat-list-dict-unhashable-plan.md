---
title: "feat: list/dict unhashable __hash__ evidence (plan 568)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 566
---

# list and dict unhashable __hash__ evidence

## Summary

CPython: `list` and `dict` are not hashable; `hash()` raises `TypeError`. pyrt omits `__hash__` and `hash()` reports `unhashable type`. Add derived tests (set already covered in `frozenset-hash.test.ts`).

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `hash(pyList([]))` raises `TypeError` with `unhashable type: 'list'` |
| R2 | `hash(pyList([pyInt(1)]))` raises same |
| R3 | `hash(pyDict([]))` raises `TypeError` with `unhashable type: 'dict'` |
| R4 | `hash(pyDict([[pyStr('a'), pyInt(1)]]))` raises same |
| R5 | validation-ladder documents new test file (plan 568) |
| R6 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; duplicating set unhashable (plan frozenset-hash).

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/list-dict-unhashable.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
