---
title: "feat: bool __hash__ evidence (plan 560)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 558
---

# bool __hash__ evidence

## Summary

CPython: `bool` is hashable; `hash(False)` is `0`, `hash(True)` is `1`. Add `bool-hash.test.ts` mirroring `int-hash.test.ts` and validation-ladder row.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `hash(pyFalse)` → `0`, `hash(pyTrue)` → `1` |
| R2 | Same bool object returns stable hash |
| R3 | Repeated `pyFalse` / `pyTrue` references share hash |
| R4 | `False` and `True` hashes differ |
| R5 | validation-ladder documents `bool-hash.test.ts` (plan 560) |
| R6 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; float hash slice (separate plan).

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/bool-hash.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
