---
title: "feat: partition/rpartition multi-byte exact match (plan 524)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 522
---

# str/bytes partition and rpartition multi-byte exact match

## Summary

Single-character exact-match cases exist; CPython also defines behavior when the separator equals the whole string or splits a repeated multi-byte prefix/suffix. Lock `partition`/`rpartition` triples for `ab` / `abab` patterns in derived tests.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"ab".partition("ab")` → `("", "ab", "")`; `"abab".partition("ab")` → `("", "ab", "ab")` |
| R2 | `"abab".rpartition("ab")` → `("ab", "ab", "")` |
| R3 | `bytes` equivalents for `b"ab"` / `b"abab"` |
| R4 | validation-ladder notes plan 524 on partition rows |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-partition.test.ts`, `test/cpython-derived/str-rpartition.test.ts`, `test/cpython-derived/bytes-partition.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
