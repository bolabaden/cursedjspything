---
title: "feat: inplace bool↔bytes remaining ops (plan 424)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 423
---

# Inplace bool↔bytes remaining ops

## Summary

Extend `operator-inplace-cross-type.test.ts` with inplace reject set for bool↔bytes (`+=` through `**=`, both orders; `*=` omitted — mul repeat fallback).

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | New describe: seven inplace ops reject bool↔bytes both orders |
| R2 | validation-ladder + LIVING-PLAN |
| R3 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime; golden; binary bytes↔bool; PEP 3118
