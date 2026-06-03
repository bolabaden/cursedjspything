---
title: "feat: dedupe str↔int operator tests (plan 406)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 405
---

# Dedupe str↔int operator test overlap

## Summary

Remove duplicate arithmetic coverage in `operator-str-int-remaining-binary.test.ts`; merge ordering into canonical `operator-int-str-remaining-binary.test.ts`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `operator-int-str-remaining-binary` includes lt/le/gt/ge both orders |
| R2 | Delete `operator-str-int-remaining-binary.test.ts` |
| R3 | validation-ladder + LIVING-PLAN |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- str↔float dedupe; runtime changes; golden keys
