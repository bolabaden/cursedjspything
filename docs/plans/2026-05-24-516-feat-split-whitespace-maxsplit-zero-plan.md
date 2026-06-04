---
title: "feat: split/rsplit whitespace-only maxsplit=0 (plan 516)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 514
---

# str/bytes split and rsplit whitespace-only maxsplit=0

## Summary

CPython returns `[]` for `split(None, 0)` / `rsplit(None, 0)` when the string is **only** whitespace (e.g. `"   "`, `b"\t\t"`), while non-empty content with internal whitespace still returns a one-element list (e.g. `" a "`.split(None, 0) → `[" a "]`). Lock this distinction in derived tests; sync validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"   ".split(None, 0)` and `"   ".rsplit(None, 0)` → `[]` |
| R2 | `" a ".split(None, 0)` and `" a ".rsplit(None, 0)` → `[" a "]` |
| R3 | `b"   ".split(None, 0)` / `rsplit` and `b"\t\t"` same pattern |
| R4 | validation-ladder notes plan 516 on split/rsplit rows |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- PEP 3118.

## Implementation Units

### U1. Runtime + tests + docs

**Files:** `src/runtime/builtins/str.ts`, `src/runtime/builtins/bytes.ts`, `test/cpython-derived/str-split.test.ts`, `test/cpython-derived/str-rsplit.test.ts`, `test/cpython-derived/bytes-split.test.ts`, `test/cpython-derived/bytes-rsplit.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
