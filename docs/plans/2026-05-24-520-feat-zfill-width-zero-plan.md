---
title: "feat: str/bytes zfill width zero (plan 520)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 518
---

# str/bytes.zfill width zero

## Summary

CPython leaves the value unchanged when `width <= len(s)`; `width=0` is the edge for non-empty strings and signed numerics. Add derived tests for `str.zfill(0)` / `bytes.zfill(0)` and sync validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"abc".zfill(0)` → `"abc"`; `"-42".zfill(0)` → `"-42"`; `"".zfill(0)` → `""` |
| R2 | `b"abc".zfill(0)` / signed bytes same no-op |
| R3 | validation-ladder notes plan 520 on zfill rows |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- PEP 3118; center/ljust (already have width-0 elsewhere).

## Implementation Units

### U1. Tests + docs (runtime only if tests fail)

**Files:** `test/cpython-derived/str-zfill.test.ts`, `test/cpython-derived/bytes-zfill.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
