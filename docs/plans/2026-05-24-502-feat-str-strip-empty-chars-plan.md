---
title: "feat: str lstrip/rstrip empty chars (plan 502)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 500
---

# str.lstrip / str.rstrip empty chars

## Summary

`str.strip` already tests `chars=""`; extend `str-strip.test.ts` so `lstrip` and `rstrip` match `bytes.strip` empty-chars behavior. Update validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `lstrip("abc", "")` and `rstrip("abc", "")` return `"abc"` |
| R2 | validation-ladder updated |
| R3 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime; bytes.strip (already covered); PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-strip.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
