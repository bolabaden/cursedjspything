---
title: "feat: expandtabs on empty str/bytes (plan 530)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 528
---

# str/bytes.expandtabs on empty input

## Summary

CPython returns empty output for `"".expandtabs()` and `b"".expandtabs()` regardless of tabsize. Add derived evidence and sync validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"".expandtabs()` and `"".expandtabs(4)` → `""` |
| R2 | `b"".expandtabs()` and `b"".expandtabs(4)` → `b""` |
| R3 | validation-ladder notes plan 530 on expandtabs rows |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-expandtabs.test.ts`, `test/cpython-derived/bytes-expandtabs.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
