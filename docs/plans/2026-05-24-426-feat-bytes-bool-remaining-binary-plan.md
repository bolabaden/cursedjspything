---
title: "feat: bytes↔bool remaining binary ops (plan 426)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 425
---

# Bytes↔bool remaining binary ops

## Summary

Extend canonical `operator-bytes-remaining-cross-type.test.ts` with bytes↔bool binary and ordering TypeError evidence (both orders). Omit `mul` — bool/bytes repeat may succeed via `__rmul__` (same as int↔bytes).

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Binary rejects: add/sub/truediv/floordiv/mod/divmod/pow bytes↔bool both orders |
| R2 | Ordering lt/le/gt/ge bytes↔bool both orders |
| R3 | validation-ladder + LIVING-PLAN |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- `mul` bytes↔bool; eq/ne split file; runtime; golden; PEP 3118
