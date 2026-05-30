---
title: "feat: float↔str bidirectional binary TypeError evidence (plan 388)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 387; STRATEGY.md Evidence track
deepened: 2026-05-24
---

# float↔str bidirectional binary TypeError evidence

## Summary

Mirror plans 384–386 for **float↔str**: assert **`truediv`**, **`floordiv`**, and **`mod`** in both operand orders in `operator-float-str-remaining-binary.test.ts` and `operator-str-float-remaining-binary.test.ts`; complete **str-float** `sub` and `mul` both-order coverage. Tests and docs only.

## Problem Frame

`divmod`/`pow` and ordering are already bidirectional in the str-float file. **truediv/floordiv/mod** remain lhs-only in both float-centric and str-centric files — same asymmetry fixed for int↔str in plans 384–386.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `operator-float-str-remaining-binary.test.ts`: truediv, floordiv, mod both orders |
| R2 | `operator-str-float-remaining-binary.test.ts`: truediv, floordiv, mod both orders; sub and mul both orders |
| R3 | validation-ladder rows + LIVING-PLAN 3-delta |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Key Technical Decisions

1. Two-file update keeps float-forward vs str-forward ownership (existing pattern).
2. Defer **bytes↔scalar** bidirectional truediv/floordiv/mod/add to plan 389.

## Scope Boundaries

### In scope

- Vitest + validation-ladder + LIVING-PLAN

### Deferred

- `operator-bytes-remaining-cross-type.test.ts` bidirectional gaps (plan 389)

### Outside scope

- Runtime changes; PEP 3118

---

## Implementation Units

### U1. float-str-remaining-binary bidirectional div ops

**Files:** `test/cpython-derived/operator-float-str-remaining-binary.test.ts`

### U2. str-float-remaining-binary bidirectional div/sub/mul

**Files:** `test/cpython-derived/operator-str-float-remaining-binary.test.ts`

### U3. Documentation

**Files:** `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/knowledgebase/LIVING-PLAN.md`
