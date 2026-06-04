---
title: "feat: rjust(0) on empty str/bytes (plan 534)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 532
---

# str/bytes.rjust width zero on empty input

## Summary

Plan 522 locked `ljust(0)` on empty input; `rjust(0)` on empty is the symmetric gap. CPython returns empty for `"".rjust(0)` and `b"".rjust(0)` (with or without fill). Add derived tests and validation-ladder notes; fix runtime only if tests fail.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"".rjust(0)` and `"".rjust(0, "x")` → `""` |
| R2 | `b"".rjust(0)` and `b"".rjust(0, b"x")` → `b""` |
| R3 | validation-ladder notes plan 534 on ljust/rjust rows |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; `ljust(0)` (plan 522).

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-ljust-rjust.test.ts`, `test/cpython-derived/bytes-ljust-rjust.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
