---
title: "feat: frozenset↔bytes and list↔bytes mul evidence (plan 444)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 443
---

# Frozenset↔bytes and list↔bytes mul

## Summary

Close LIVING-PLAN §8.15 gaps: full set/bytes-style cross-type block for frozenset↔bytes in `operator-container-cross-type.test.ts`, and list↔bytes `mul` rejects in canonical `operator-list-tuple-cross-type.test.ts`.

## Problem Frame

Plan 442 added set↔bytes. frozenset↔bytes and list↔bytes `mul` remain untested despite being called out in LIVING-PLAN next steps.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | frozenset↔bytes `add`, `eq`/`ne`, `mul`, ordering both orders in `test/cpython-derived/operator-container-cross-type.test.ts` |
| R2 | list↔bytes `mul` both orders in `test/cpython-derived/operator-list-tuple-cross-type.test.ts` |
| R3 | validation-ladder rows updated for both files |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` pass |

## Scope Boundaries

### Outside scope

- Runtime; golden expansion; PEP 3118; ops/LIVING-PLAN (post-merge).

## Key Technical Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| KTD1 | Mirror set/bytes describe for frozenset/bytes | Identical CPython rejection surface; keeps container file consistent. |
| KTD2 | list↔bytes mul in list-tuple file | Plan 428 made that file canonical for list binary rejects. |

## Implementation Units

### U1. frozenset↔bytes

**Files:** `test/cpython-derived/operator-container-cross-type.test.ts`

**Test scenarios:** TS-U1-1 through TS-U1-4 — add/mul/eq/ordering both orders (mirror plan 442 set/bytes).

### U2. list↔bytes mul

**Files:** `test/cpython-derived/operator-list-tuple-cross-type.test.ts`

**Test scenarios:** TS-U2-1 `mul(list, bytes)`; TS-U2-2 `mul(bytes, list)`.

### U3. Docs

**Files:** `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
