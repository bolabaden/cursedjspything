---
title: "feat: §8.15 inplace cross-type bidirectional evidence (plan 400)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 399
---

# Inplace cross-type bidirectional TypeError evidence

## Summary

Complete **both operand orders** for remaining one-way cases in `operator-inplace-cross-type.test.ts`: `isub` str↔int, `iadd` int↔list, `iadd` bool↔str.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `isub` rejects str and int (reverse of int/str) |
| R2 | `iadd` rejects int and list (reverse of list/int) |
| R3 | `iadd` rejects bool and str (reverse of str/bool) |
| R4 | validation-ladder + LIVING-PLAN 3-delta |
| R5 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes; golden keys; container `iadd` (already bidirectional in `operator-container-cross-type.test.ts`)
