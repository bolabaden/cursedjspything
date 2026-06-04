---
title: "feat: str/bytes ljust width zero (plan 522)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 520
---

# str/bytes.ljust width zero

## Summary

`rjust(0)` is already covered; CPython treats `ljust(0)` the same (no padding). Add `str`/`bytes` derived tests for `ljust(0)` on non-empty and empty input; sync validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"abc".ljust(0)` → `"abc"`; `"".ljust(0)` → `""` |
| R2 | `b"abc".ljust(0)` / `b"".ljust(0)` same no-op |
| R3 | validation-ladder notes plan 522 on ljust/rjust rows |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- PEP 3118; runtime unless tests fail.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-ljust-rjust.test.ts`, `test/cpython-derived/bytes-ljust-rjust.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
