---
title: "feat: dedupe sequence cross-type operator tests (plan 428)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 427
---

# Dedupe sequence cross-type operator test overlap

## Summary

Merge list/tuple scalar `add` rejects into canonical `operator-list-tuple-cross-type.test.ts`; delete redundant `operator-sequence-cross-type-add.test.ts` and `sequence-cross-type.test.ts`; remove duplicate tuple↔int `add` block from `operator-container-cross-type.test.ts`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | list-tuple gains add rejects: list↔int, list↔str, str↔list, tuple↔int (both orders) |
| R2 | Delete two legacy sequence test files |
| R3 | Remove container tuple/scalar add duplicate |
| R4 | validation-ladder + LIVING-PLAN; tests green |

## Scope Boundaries

### Outside scope

- bytes eq/ne; runtime; golden; PEP 3118
