---
title: "feat: GoldenHarnessError for golden run.ts (plan 472)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 470
---

# Golden harness typed errors

## Summary

Replace plain `Error` in `scripts/golden/run.ts` with `GoldenHarnessError` (mirrors existing `KeyParityError`); narrow COMPATIBILITY §8.17 remaining-gap note.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `GoldenHarnessError` in `scripts/golden/errors.ts` with stable `name` |
| R2 | `run.ts` throws `GoldenHarnessError` for cases.py failure and missing Python |
| R3 | §8.17 documents golden harness typed errors; test mock `Error` stubs unchanged |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Vitest mock `throw new Error("IndexError")` stubs; PEP 3118; runtime Py* changes.

## Implementation Units

### U1. Harness errors + docs

**Files:** `scripts/golden/errors.ts`, `scripts/golden/run.ts`, `docs/COMPATIBILITY_AND_GAPS.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
