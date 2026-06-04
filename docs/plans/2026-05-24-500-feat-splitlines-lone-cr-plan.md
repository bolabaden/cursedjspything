---
title: "feat: splitlines lone carriage return (plan 500)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 498
---

# str/bytes.splitlines lone CR

## Summary

Existing tests cover `\n` and `\r\n`; add lone `\r` (with `keepends`) for `str.splitlines` and `bytes.splitlines`. Update validation-ladder rows.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `str.splitlines("a\rb")` → `["a", "b"]` |
| R2 | `str.splitlines("a\rb", True)` keeps `\r` on first segment |
| R3 | `bytes.splitlines(b"a\rb")` → two segments |
| R4 | validation-ladder updated |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-splitlines.test.ts`, `test/cpython-derived/bytes-splitlines.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
