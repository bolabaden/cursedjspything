---
title: "feat: replace on empty str/bytes with missing old (plan 546)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 544
---

# str/bytes.replace on empty input with non-empty old

## Summary

Plan 512 covered empty-old insertion on empty haystack. CPython also returns empty output for `"".replace("a", "b")` and `b"".replace(b"a", b"b")` when `old` is non-empty and absent. Add derived evidence and extend validation-ladder replace rows.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"".replace("a", "b")` and `"".replace("a", "b", 0)` → `""` |
| R2 | `b"".replace(b"a", b"b")` and `b"".replace(b"a", b"b", 0)` → `b""` |
| R3 | validation-ladder notes plan 546 on replace rows |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; empty-old replace (plan 512).

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-replace.test.ts`, `test/cpython-derived/bytes-replace.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
