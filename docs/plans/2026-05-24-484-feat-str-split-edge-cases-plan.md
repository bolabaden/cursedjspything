---
title: "feat: str.split maxsplit=0 and empty-str edge cases (plan 484)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 482
---

# str.split edge-case parity

## Summary

Add missing `str.split` evidence aligned with `str.rsplit` and `bytes.split`: `maxsplit=0`, empty string with explicit sep, empty-string whitespace split. Sync validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `maxsplit=0` returns whole string (whitespace and explicit sep) |
| R2 | `""` split on sep → `[""]`; `""` whitespace split → `[]` |
| R3 | validation-ladder updated |
| R4 | Tests green |

## Scope Boundaries

### Outside scope

- Runtime; bytes changes; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-split.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
