---
title: "feat: startswith/endswith on empty str/bytes (plan 542)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 540
---

# str/bytes.startswith and endswith on empty input

## Summary

CPython: empty haystack with non-empty affix → `False`; empty affix on empty haystack → `True`. Derived tests cover non-empty haystack only for the empty-affix case. Add evidence and validation-ladder notes.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"".startswith("a")` and `"".endswith("a")` → `False` |
| R2 | `"".startswith("")` and `"".endswith("")` → `True` |
| R3 | `b"".startswith(b"a")`, `b"".endswith(b"a")` → `False`; `b"".startswith(b"")`, `b"".endswith(b"")` → `True` |
| R4 | validation-ladder notes plan 542 on startswith/endswith rows |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; tuple affix forms on empty haystack.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-startswith-endswith.test.ts`, `test/cpython-derived/bytes-startswith-endswith.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
