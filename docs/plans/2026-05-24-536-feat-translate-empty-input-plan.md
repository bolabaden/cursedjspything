---
title: "feat: translate on empty str/bytes (plan 536)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 534
---

# str/bytes.translate on empty input

## Summary

CPython returns empty output for `"".translate(table)` and `b"".translate(table)` when the table is identity (empty `maketrans`). Existing tests cover non-empty input only. Add derived evidence and validation-ladder notes.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"".translate(str.maketrans("", ""))` → `""` |
| R2 | `b"".translate(bytes.maketrans(b"", b""))` → `b""` |
| R3 | validation-ladder notes plan 536 on translate rows |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; dict-based translate tables.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-translate.test.ts`, `test/cpython-derived/bytes-translate.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
