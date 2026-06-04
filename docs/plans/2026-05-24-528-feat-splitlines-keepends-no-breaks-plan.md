---
title: "feat: splitlines keepends without line breaks (plan 528)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 526
---

# str/bytes.splitlines keepends with no line breaks

## Summary

When there are no line breaks, CPython returns one segment; with `keepends=True` that segment is unchanged (e.g. `"x".splitlines(True)` → `["x"]`). Extend existing “single segment” tests; sync validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"abc".splitlines(True)` → `["abc"]`; `"x".splitlines(True)` → `["x"]` |
| R2 | `b"abc".splitlines(True)` → `[b"abc"]` |
| R3 | validation-ladder notes plan 528 on splitlines rows |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-splitlines.test.ts`, `test/cpython-derived/bytes-splitlines.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
