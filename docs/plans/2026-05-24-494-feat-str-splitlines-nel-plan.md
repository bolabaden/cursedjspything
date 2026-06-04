---
title: "feat: str.splitlines NEL U+0085 (plan 494)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 492
---

# str.splitlines next-line (NEL) U+0085

## Summary

Complete `str.splitlines` line-break evidence with NEL (`\u0085`), already handled in `strLineBreakLength`. Update validation-ladder note.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `splitlines("a\u0085b")` → `["a", "b"]` |
| R2 | validation-ladder updated |
| R3 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime; bytes.splitlines; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-splitlines.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
