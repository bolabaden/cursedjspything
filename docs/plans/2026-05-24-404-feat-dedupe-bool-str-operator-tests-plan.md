---
title: "feat: dedupe bool↔str operator tests (plan 404)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 403
---

# Dedupe bool↔str operator tests

## Summary

Merge `operator-bool-str-binary.test.ts` into `operator-bool-str-remaining-binary.test.ts` and delete the split file (plan 402 pattern).

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Remaining file covers add/sub/truediv/floordiv/mod/divmod/pow both orders |
| R2 | Delete `operator-bool-str-binary.test.ts` |
| R3 | validation-ladder + LIVING-PLAN |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes; golden keys; further dedupe
