---
title: "feat: str.splitlines extra line breaks (plan 490)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 488
---

# str.splitlines additional CPython line breaks

## Summary

`str-splitlines.test.ts` covers `\n`, `\r\n`, and U+2028. Add evidence for vertical tab, form feed, and U+2029 (paragraph separator). Sync validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `splitlines("a\x0bb")` → `["a", "b"]` |
| R2 | `splitlines("a\x0cb")` → `["a", "b"]` |
| R3 | `splitlines("a\u2029b")` → `["a", "b"]` |
| R4 | validation-ladder updated |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes; bytes.splitlines (bytes only splits `\n`/`\r` per CPython); PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-splitlines.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
