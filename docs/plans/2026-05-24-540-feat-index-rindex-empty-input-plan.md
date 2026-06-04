---
title: "feat: index/rindex on empty str/bytes (plan 540)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 538
---

# str/bytes.index and rindex on empty input

## Summary

Complements plan 538 (`find`/`rfind` → `-1`). CPython raises `ValueError` for `"".index(sub)` and `"".rindex(sub)` when `sub` is non-empty and absent (same for `b""`). Add derived evidence and validation-ladder notes.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"".index("a")` and `"".rindex("a")` raise `ValueError` with substring-not-found message |
| R2 | `b"".index(b"a")` and `b"".rindex(b"a")` raise `ValueError` with subsection-not-found message |
| R3 | validation-ladder notes plan 540 on index rows |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; empty-substring index behavior (covered elsewhere).

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-index.test.ts`, `test/cpython-derived/bytes-index.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
