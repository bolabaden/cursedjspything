---
title: "feat: cross-type ordering test helper (plan 452)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 451
---

# Cross-type ordering test helper

## Summary

Extract shared `lt`/`le`/`gt`/`ge` bidirectional TypeError registration into `test/cpython-derived/helpers/cross-type-ordering.ts`; refactor `operator-container-cross-type` and `operator-list-tuple-cross-type` to use it.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Helper registers four ordering tests with both-order TypeError messages |
| R2 | `operator-container-cross-type.test.ts` uses helper for all ordering loops |
| R3 | `operator-list-tuple-cross-type.test.ts` list↔tuple ordering uses helper |
| R4 | Test count unchanged; `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Other operator-* files; runtime; golden expansion; PEP 3118.

## Implementation Units

### U1. Helper module

**Files:** `test/cpython-derived/helpers/cross-type-ordering.ts`

### U2. Refactor container + list-tuple tests

**Files:** `test/cpython-derived/operator-container-cross-type.test.ts`, `test/cpython-derived/operator-list-tuple-cross-type.test.ts`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
