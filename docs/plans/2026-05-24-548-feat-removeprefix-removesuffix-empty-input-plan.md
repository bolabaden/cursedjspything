---
title: "feat: removeprefix/removesuffix on empty str/bytes (plan 548)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 546
---

# str/bytes.removeprefix and removesuffix on empty input

## Summary

CPython returns empty output when the haystack is empty and the affix is non-empty (no match), or when both are empty (partially covered). Add explicit derived evidence for empty haystack + non-empty affix and sync validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"".removeprefix("a")` and `"".removesuffix("a")` → `""` |
| R2 | `b"".removeprefix(b"a")` and `b"".removesuffix(b"a")` → `b""` |
| R3 | validation-ladder notes plan 548 on removeprefix/removesuffix rows |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; non-empty haystack affix cases (already covered).

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-removeprefix-removesuffix.test.ts`, `test/cpython-derived/bytes-removeprefix-removesuffix.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
