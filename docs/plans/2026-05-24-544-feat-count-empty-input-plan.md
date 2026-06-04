---
title: "feat: count on empty str/bytes (plan 544)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 542
---

# str/bytes.count on empty input

## Summary

CPython returns `0` for `"".count(sub)` and `b"".count(sub)` when `sub` is non-empty (empty-sub `count("", "")` → `1` is already covered). Add derived evidence for the missing-sub-on-empty-haystack case and validation-ladder notes.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"".count("a")` → `0` |
| R2 | `b"".count(b"a")` → `0` |
| R3 | validation-ladder notes plan 544 on count rows |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; empty-sub count (already in tests).

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-count.test.ts`, `test/cpython-derived/bytes-count.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
