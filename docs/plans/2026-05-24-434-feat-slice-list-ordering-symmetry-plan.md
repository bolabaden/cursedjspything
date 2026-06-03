---
title: "feat: slice↔list ordering symmetry in container cross-type"
type: feat
status: in_progress
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 433
---

# Slice↔list ordering symmetry

## Summary

Align `slice`↔`list` cross-type ordering tests with `slice`↔`tuple` and other container pairs: bidirectional `lt`/`le`/`gt`/`ge` TypeError evidence plus `ne` on eq.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Replace single-direction `lt` test with four-op loop both orders |
| R2 | `eq`/`ne` for slice↔list matches tuple pattern |
| R3 | `add` slice↔int tests both operand orders |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime; golden expansion; PEP 3118
