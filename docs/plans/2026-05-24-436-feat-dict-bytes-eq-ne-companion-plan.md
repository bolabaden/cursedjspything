---
title: "feat: dict↔bytes eq/ne companion (plan 436)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 435
---

# Dict↔bytes eq/ne companion

## Summary

Add `operator-container-scalar-cross-type.test.ts` for dict↔bytes eq/ne non-coercion; bidirectional `mul` reject for dict↔int in container file; validation-ladder row.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | dict↔bytes eq/ne both operand orders in companion file |
| R2 | dict↔int `mul` TypeError both orders in container file |
| R3 | validation-ladder documents companion file |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime; golden expansion; PEP 3118
