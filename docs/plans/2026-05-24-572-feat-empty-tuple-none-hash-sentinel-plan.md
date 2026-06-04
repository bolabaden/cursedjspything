---
title: "feat: empty tuple hash matches None sentinel (plan 572)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 570
---

# empty tuple hash matches None sentinel

## Summary

pyrt uses seed `0x345678` for `None.__hash__` and as the initial accumulator for empty `tuple` hashing (`none.ts`, `tuple.ts`). Extend `tuple-hash.test.ts` to prove `hash(()) == hash(None)`; update validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `hash(pyTuple([])) === hash(pyNone)` |
| R2 | validation-ladder `tuple-hash` row notes sentinel linkage (plan 572) |
| R3 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; CPython numeric hash equality for `()` vs `None` (they differ in CPython).

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/tuple-hash.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
