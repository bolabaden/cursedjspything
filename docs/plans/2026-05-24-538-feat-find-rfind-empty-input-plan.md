---
title: "feat: find/rfind on empty str/bytes (plan 538)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 536
---

# str/bytes.find and rfind on empty input

## Summary

CPython returns `-1` for `"".find(sub)` and `"".rfind(sub)` when `sub` is non-empty and absent, and the same for `b""`. Derived tests cover non-empty haystack only. Add evidence and validation-ladder notes.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"".find("a")` and `"".rfind("a")` → `-1` |
| R2 | `b"".find(b"a")` and `b"".rfind(b"a")` → `-1` |
| R3 | validation-ladder notes plan 538 on find rows |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; `index`/`rfind` empty-substring edge cases (covered elsewhere).

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-find.test.ts`, `test/cpython-derived/bytes-find.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
