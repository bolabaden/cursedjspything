---
title: "docs: §8.15 inplace operator index (plan 923)"
type: docs
status: completed
date: 2026-06-12
origin: docs/knowledgebase/50-execution/operator-evidence-audit.md (branch docs/operator-consolidation-audit-920)
---

# Inplace operator evidence index (P3)

## Summary

Doc-only slice from plan 920 audit P3 backlog: add §8.15 **Inplace operator evidence** subsection mapping augmented-assignment concern → canonical Vitest file. `operator-inplace-cross-type.test.ts` stays monolithic; file split deferred per audit §4.

## Problem Frame

Inplace parity evidence spans six file families (monolithic scalar/container inplace, sequence `iadd`/`imul`/`isub`, complex inplace, set inplace). §8.15 prose and flat bullet lists cite files but do not index canonical homes, making navigation harder for readers and future dedupe plans.

## Requirements

| ID | Requirement | Origin |
|----|-------------|--------|
| R1 | Add §8.15 **Inplace operator evidence** bullet list with canonical file per inplace family | audit P3 backlog |
| R2 | Note monolithic `operator-inplace-cross-type` scope and deferred split | audit §4 |
| R3 | Cross-link sequence inplace files (`sequence-iadd`, `sequence-imul`, `sequence-sub`) | audit inventory |
| R4 | Include complex and set inplace canonical homes | validation-ladder |
| R5 | Update LIVING-PLAN with plan 923 landed delta | convention |
| R6 | No test moves, no runtime changes | audit R8 |

## Scope Boundaries

### In scope

- `docs/COMPATIBILITY_AND_GAPS.md` §8.15 Evidence subsection
- `docs/knowledgebase/LIVING-PLAN.md`

### Deferred

- P3 complex pow dedupe merges
- Splitting `operator-inplace-cross-type.test.ts`

## Implementation Units

### U1. §8.15 inplace index bullets

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`

**Verification:** Each inplace family from audit inventory appears once as primary cite.

### U2. Living plan delta

**Files:** `docs/knowledgebase/LIVING-PLAN.md`

## Verification

```bash
npm run check
```
