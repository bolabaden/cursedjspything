---
title: "feat: str↔bytes contains symmetry evidence (plan 464)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 462
---

# str↔bytes contains symmetry evidence

## Summary

Complete canonical str↔bytes `contains` coverage in `operator-str-bytes-cross-type.test.ts` (bytes lhs rejects `str` rhs); sync validation-ladder and §8.15 prose. Runtime already names rhs type for both directions.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `operator-str-bytes-cross-type.test.ts` asserts `contains(bytes, str)` → `PyTypeError` with `not 'str'` |
| R2 | Existing str→bytes contains test from plan 462 retained |
| R3 | `validation-ladder.md` and COMPATIBILITY §8.15 cite str-bytes for eq/ne/ordering/contains |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes; removing `bytes-isascii-contains` str case; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/operator-str-bytes-cross-type.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/COMPATIBILITY_AND_GAPS.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
