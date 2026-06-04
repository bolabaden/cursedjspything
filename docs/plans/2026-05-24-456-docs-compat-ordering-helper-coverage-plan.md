---
title: "docs: §8.15 ordering helper coverage note (plan 456)"
type: docs
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 454
---

# COMPATIBILITY §8.15 ordering helper coverage

## Summary

Document that cross-type `lt`/`le`/`gt`/`ge` TypeError matrices in operator tests are centralized in `helpers/cross-type-ordering.ts`; note the sole bespoke ordering loop in `richcmp-incomparable.test.ts`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | §8.15 prose mentions `registerCrossTypeOrderingRejects` and plans 452–454 |
| R2 | Evidence list includes `helpers/cross-type-ordering.ts` and names the six consumer operator files |
| R3 | Prose states `richcmp-incomparable.test.ts` is intentionally outside the helper (incomparable / NotImplemented semantics) |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green (no test changes) |

## Scope Boundaries

### Outside scope

- Runtime; helper API changes; `richcmp-incomparable` refactor; PEP 3118.

## Implementation Units

### U1. Update COMPATIBILITY §8.15

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
