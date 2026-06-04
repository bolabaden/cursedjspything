---
title: "feat: join empty separator single element (plan 526)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 524
---

# str/bytes.join empty separator with one element

## Summary

Plans 510/518 cover empty-separator concat and empty iterable; CPython also defines `"".join(["a"])` → `"a"` with no inserted separator. Add derived evidence and sync validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"".join(["a"])` → `"a"` |
| R2 | `b"".join([b"hi"])` → `b"hi"` |
| R3 | validation-ladder notes plan 526 on join rows |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-join.test.ts`, `test/cpython-derived/bytes-join.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
