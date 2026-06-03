---
title: "feat: tuple↔bytes mul and list↔bytes eq/ne (plan 446)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 445
---

# Tuple↔bytes mul and list↔bytes eq/ne

## Summary

Extend canonical `operator-list-tuple-cross-type.test.ts` with tuple↔bytes `mul` rejects and list↔bytes eq/ne non-coercion (list `mul` already landed in plan 444).

## Problem Frame

LIVING-PLAN next step calls out tuple↔bytes and list↔bytes eq/ne companions. list↔bytes `mul` exists; tuple↔bytes `mul` and list↔bytes eq/ne do not.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | tuple↔bytes `mul` TypeError both orders in `test/cpython-derived/operator-list-tuple-cross-type.test.ts` |
| R2 | list↔bytes eq/ne both orders in same file |
| R3 | validation-ladder row for list-tuple file notes bytes coverage |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` pass |

## Scope Boundaries

### Outside scope

- Runtime; golden expansion; PEP 3118; tuple↔bytes eq/ne (optional follow-up).

## Key Technical Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| KTD1 | Keep all sequence↔bytes evidence in list-tuple file | Plan 428 canonical path for list/tuple binary rejects. |

## Implementation Units

### U1. tuple↔bytes mul

**Files:** `test/cpython-derived/operator-list-tuple-cross-type.test.ts`

**Test scenarios:** TS-U1-1 `mul(tuple, bytes)`; TS-U1-2 `mul(bytes, tuple)`.

### U2. list↔bytes eq/ne

**Files:** `test/cpython-derived/operator-list-tuple-cross-type.test.ts`

**Test scenarios:** TS-U2-1 eq/ne false/true both operand orders.

### U3. Docs

**Files:** `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
