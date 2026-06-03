---
title: "feat: slice↔int eq/ne/ordering and dict↔slice ordering (plan 440)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 439
---

# Slice↔int and dict↔slice ordering symmetry

## Summary

Add slice↔int eq/ne and bidirectional ordering in `operator-container-cross-type`; add dict↔slice `lt`/`le`/`gt`/`ge` both orders in dict/scalar block.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | slice↔int eq/ne and four-op ordering both orders |
| R2 | dict↔slice ordering both orders |
| R3 | validation-ladder note on container file |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime; golden expansion; PEP 3118
