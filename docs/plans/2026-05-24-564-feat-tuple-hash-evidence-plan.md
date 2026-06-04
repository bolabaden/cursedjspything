---
title: "feat: tuple __hash__ evidence (plan 564)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 562
---

# tuple __hash__ evidence

## Summary

CPython: `tuple` is hashable; empty tuple has a fixed seed hash; equal tuples hash equally; order matters. Add `tuple-hash.test.ts` and validation-ladder row.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Empty `tuple` hash is stable and equal across `pyTuple([])` instances |
| R2 | Same tuple object returns stable hash |
| R3 | Equal tuples built separately share hash |
| R4 | Different element tuples differ in hash |
| R5 | Order-dependent: `(1, 2)` and `(2, 1)` differ |
| R6 | validation-ladder documents `tuple-hash.test.ts` (plan 564) |
| R7 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; CPython numeric hash parity for empty tuple; None hash (separate slice).

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/tuple-hash.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
