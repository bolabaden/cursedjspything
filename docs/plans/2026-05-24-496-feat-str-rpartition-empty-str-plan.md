---
title: "feat: str.rpartition empty string (plan 496)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 494
---

# str.rpartition empty string parity

## Summary

`str-partition.test.ts` covers `partition("", sep)`; add matching `rpartition("", sep)` evidence in `str-rpartition.test.ts`. Update validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `rpartition("", ",")` → `["", "", ""]` |
| R2 | validation-ladder updated |
| R3 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime; bytes.partition; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-rpartition.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
