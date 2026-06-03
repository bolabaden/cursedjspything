---
title: "feat: container inplace dedupe and docs sync (plan 432)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 431
---

# Container inplace dedupe and docs sync

## Summary

Move container `iadd` rejects from `operator-container-cross-type.test.ts` into `operator-inplace-cross-type.test.ts`; add validation-ladder row for container-cross-type; prune eight deleted operator files from COMPATIBILITY §8.15 evidence.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Container inplace block lives only in operator-inplace-cross-type |
| R2 | validation-ladder: container-cross-type row; inplace row notes container iadd |
| R3 | COMPATIBILITY evidence drops stale operator-* paths |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime; golden; PEP 3118
