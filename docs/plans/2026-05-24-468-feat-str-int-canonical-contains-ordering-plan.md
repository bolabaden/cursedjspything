---
title: "feat: canonical str↔int contains and ordering (plan 468)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 466
---

# Canonical str↔int contains and ordering

## Summary

Move str↔int ordering from `operator-int-str-remaining-binary.test.ts` into `operator-str-scalar.test.ts` (contains already there); sync docs. Mirrors plans 466/464/458.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `operator-str-scalar.test.ts` registers str↔int ordering via helper |
| R2 | `operator-int-str-remaining-binary.test.ts` drops ordering describe |
| R3 | validation-ladder + COMPATIBILITY §8.15 cite str-scalar for eq/ne/add/contains/ordering |
| R4 | Test count unchanged; `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime; moving `add` out of str-scalar; PEP 3118.

## Implementation Units

### U1. Test consolidation + docs

**Files:** `test/cpython-derived/operator-str-scalar.test.ts`, `test/cpython-derived/operator-int-str-remaining-binary.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/COMPATIBILITY_AND_GAPS.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
