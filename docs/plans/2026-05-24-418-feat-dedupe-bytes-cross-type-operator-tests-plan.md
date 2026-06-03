---
title: "feat: dedupe bytes cross-type operator tests (plan 418)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 417
---

# Dedupe bytes cross-type operator test overlap

## Summary

Remove duplicate cross-type reject cases from `operator-bytes-cross-type.test.ts`; keep that file for bytes+bytes add and bytes*int mul happy paths only. Move missing `add` bytes↔int and `mul` bytes↔float rejects into canonical `operator-bytes-remaining-cross-type.test.ts`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `operator-bytes-remaining-cross-type` gains add bytes↔int and mul bytes↔float both orders |
| R2 | `operator-bytes-cross-type` retains only happy-path add/mul (no duplicate rejects) |
| R3 | validation-ladder + LIVING-PLAN |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes; golden keys; PEP 3118
