---
title: "feat: tuple↔bytes eq/ne companion (plan 448)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 447
---

# Tuple↔bytes eq/ne companion

## Summary

Add tuple↔bytes eq/ne non-coercion in `operator-list-tuple-cross-type.test.ts` beside existing list↔bytes companion and tuple↔bytes `mul` (plan 446).

## Problem Frame

Plan 446 added list↔bytes eq/ne and tuple↔bytes `mul`. tuple↔bytes eq/ne remains the LIVING-PLAN §8.15 gap.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | tuple↔bytes eq/ne both operand orders in `test/cpython-derived/operator-list-tuple-cross-type.test.ts` |
| R2 | validation-ladder list-tuple row notes tuple↔bytes eq/ne |
| R3 | `npm run check`, `npm test`, `npm run golden:keys` pass |

## Scope Boundaries

### Outside scope

- Runtime; golden expansion; PEP 3118; operator-file deletion audit (follow-up).

## Implementation Units

### U1. tuple↔bytes eq/ne

**Files:** `test/cpython-derived/operator-list-tuple-cross-type.test.ts`

**Test scenarios:** TS-U1-1 eq false both orders; TS-U1-2 ne true both orders.

### U2. Docs

**Files:** `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
