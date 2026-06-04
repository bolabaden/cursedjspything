---
title: "feat: set mutation rejects unhashable elements (plan 580)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 578
---

# set mutation unhashable element guards

## Summary

CPython `set.add` / `remove` / `discard` / `__contains__` / `update` hash PyObject elements. pyrt currently accepts unhashable items via JS `Set`. Validate hashability before mutating or probing set membership.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `set.add(pyList([]))` raises `TypeError` with `unhashable type: 'list'` |
| R2 | `set.add(badHashKey)` raises `__hash__ method should return an integer` |
| R3 | `remove`, `discard`, and `__contains__` reject same probe keys |
| R4 | `update(pyList([unhashable]))` raises on the bad element |
| R5 | Extend `set-mutation.test.ts`; validation-ladder note (plan 580) |
| R6 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Full CPython hash-based set equality; frozenset constructor at build time; PEP 3118.

## Implementation Units

### U1. Runtime

**Files:** `src/runtime/builtins/set.ts` — `requireHashableSetElement` via `hash()` before add/remove/discard/contains/update item insert.

### U2. Tests + docs

**Files:** `test/cpython-derived/set-mutation.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
