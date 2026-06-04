---
title: "feat: str↔float add canonical in str-float (plan 476)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 474
---

# str↔float add canonical

## Summary

Move str↔float **add** evidence to `operator-str-float.test.ts` alongside eq/ne/contains/ordering; remove duplicate from `operator-float-str-remaining-binary.test.ts`. Mirrors plan 474 bool pattern.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | str-float: add rejects str↔float both orders |
| R2 | float-str-remaining: remove add block |
| R3 | validation-ladder + COMPATIBILITY updated |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime; mul/sub moves; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/operator-str-float.test.ts`, `test/cpython-derived/operator-float-str-remaining-binary.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/COMPATIBILITY_AND_GAPS.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
