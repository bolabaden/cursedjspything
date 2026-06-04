---
title: "feat: None __hash__ evidence (plan 566)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 564
---

# None __hash__ evidence

## Summary

CPython: `None` is hashable with a fixed hash. pyrt uses sentinel `0x345678` (same seed as empty `tuple` hashing). Add `none-hash.test.ts` and validation-ladder row.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `hash(pyNone)` → `0x345678` |
| R2 | Repeated `hash(pyNone)` is stable |
| R3 | `pyNone` singleton always yields the same hash |
| R4 | validation-ladder documents `none-hash.test.ts` (plan 566) |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; CPython per-process `hash(None)` numeric parity.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/none-hash.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
