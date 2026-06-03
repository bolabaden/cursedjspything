---
title: "feat: inplace float↔bytes remaining ops (plan 422)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 421
---

# Inplace float↔bytes remaining ops

## Summary

Extend `operator-inplace-cross-type.test.ts` with full inplace reject set for float↔bytes (`+=` through `**=`, both orders), mirroring plan 420 int↔bytes.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | New describe: eight inplace ops reject float↔bytes both orders |
| R2 | validation-ladder + LIVING-PLAN |
| R3 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- binary `mul` bytes↔int (valid repeat in pyrt); runtime; golden; PEP 3118
