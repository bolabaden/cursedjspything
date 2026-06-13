---
title: "docs: scalar-complex pow fold review (plan 925)"
type: docs
status: completed
date: 2026-06-12
origin: docs/knowledgebase/50-execution/operator-evidence-audit.md (plan 920 P3 backlog)
---

# Scalar-complex pow fold review (P3)

## Summary

Doc-only slice closing P3 backlog from plan 920 audit: review whether `operator-scalar-complex-pow-edges` and `operator-scalar-complex-truediv-pow-modulo` should fold into `operator-scalar-complex-pow-floordiv`, record the **keep separate** decision, and add §8.15 **Scalar-complex pow evidence** canonical-home bullets. No test moves or runtime changes.

## Problem Frame

Plan 920 overlap matrix flags int/float `**` complex as **shared-tuple** across three scalar-complex pow files and proposes aggressive fold into `pow-floordiv` (high risk, −10 to −20 cases). Readers need explicit canonical homes and a fold decision before any future dedupe plan with full `npm test` + golden.

## Requirements

| ID | Requirement | Origin |
|----|-------------|--------|
| R1 | Record fold decision: **keep** three scalar-complex pow files separate | audit § Merge proposals #1 |
| R2 | Add §8.15 **Scalar-complex pow evidence** bullets mapping concern → canonical Vitest file | audit overlap matrix |
| R3 | Disambiguate shared-tuple `**` vs `/`, divmod, three-arg pow modulo | plans 901/902/909 |
| R4 | Cross-link complex-side pow homes (eq-pow, pow-floordiv, pow-complex) for int/float/complex exponent split | audit complex cluster |
| R5 | Update LIVING-PLAN with plan 925 landed delta | convention |
| R6 | No test moves, no runtime changes | audit R8 |

## Scope Boundaries

### In scope

- `docs/COMPATIBILITY_AND_GAPS.md` §8.15 scalar-complex pow bullets + fold decision
- `docs/knowledgebase/LIVING-PLAN.md`

### Deferred

- File merges into `operator-scalar-complex-pow-floordiv` (rejected this slice)
- §8.15 complex cluster bullet sync (plan 921 / PR #589)

## Implementation Units

### U1. §8.15 scalar-complex pow index bullets

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`

**Verification:** Each of the three scalar-complex pow files appears once as primary cite; fold decision stated.

### U2. Living plan delta

**Files:** `docs/knowledgebase/LIVING-PLAN.md`

## Verification

```bash
npm run check
```
