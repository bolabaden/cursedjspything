---
title: "feat: inplace int↔bytes remaining ops (plan 420)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 419
---

# Inplace int↔bytes remaining ops

## Summary

Extend `operator-inplace-cross-type.test.ts` with full inplace reject set for int↔bytes (`+=` through `**=`, both orders), mirroring plan 416 bytes↔str block.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | New describe: inplace rejects int↔bytes both orders (`*=` excluded — mul fallback) |
| R2 | validation-ladder + LIVING-PLAN |
| R3 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes; golden keys; float↔bytes inplace; PEP 3118
