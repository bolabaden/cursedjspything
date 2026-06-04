---
title: "feat: str.rsplit maxsplit=0 with explicit sep (plan 488)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 486
---

# str.rsplit maxsplit=0 with explicit sep

## Summary

`str.split` already asserts `maxsplit=0` with an explicit separator (plan 484). `str.rsplit` only covers whitespace `maxsplit=0`. Add comma-separator parity and sync validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `str.rsplit("a,b,c", ",", 0)` returns `["a,b,c"]` |
| R2 | validation-ladder `str-rsplit` row updated |
| R3 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes; bytes tests (plan 486); PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-rsplit.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
