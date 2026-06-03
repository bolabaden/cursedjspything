---
title: "feat: dict↔slice and dict↔int eq/ne companion (plan 438)"
type: feat
status: in_progress
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 437
---

# Dict↔slice eq/ne companion

## Summary

Extend `operator-container-scalar-cross-type.test.ts` with dict↔slice and dict↔int eq/ne non-coercion; update validation-ladder companion row.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | dict↔slice eq/ne both operand orders |
| R2 | dict↔int eq/ne both operand orders |
| R3 | validation-ladder notes slice/int coverage |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime; golden expansion; PEP 3118
