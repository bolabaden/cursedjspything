---
title: "feat: dedupe int↔str / float↔str operator tests (plan 402)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 401
---

# Dedupe overlapping int↔str / float↔str operator tests

## Summary

Remove five legacy split files whose cases are fully covered by `operator-*-remaining-binary.test.ts`. Merge float↔str `add`/`sub` into the canonical remaining file.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Delete `operator-int-str-binary`, `operator-int-str-divmod-pow` |
| R2 | Delete `operator-float-str-binary`, `operator-float-str-floordiv-mod`, `operator-float-str-divmod-pow` |
| R3 | `operator-float-str-remaining-binary` includes add/sub |
| R4 | validation-ladder + LIVING-PLAN |
| R5 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- bool↔str dedupe; runtime changes; golden keys
