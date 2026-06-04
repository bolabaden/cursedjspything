---
title: "feat: splitlines keepends on empty str/bytes (plan 514)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 512
---

# str/bytes.splitlines keepends on empty input

## Summary

CPython returns `[]` for `"".splitlines(True)` and `b"".splitlines(True)` — distinct from lone-`\n` cases. Lock this edge in derived tests and sync validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"".splitlines(True)` → `[]` |
| R2 | `b"".splitlines(True)` → `[]` |
| R3 | validation-ladder notes plan 514 on splitlines rows |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes (behavior expected already correct).
- PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-splitlines.test.ts`, `test/cpython-derived/bytes-splitlines.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

**Test scenarios:**

- Extend existing “empty string/bytes” `it` blocks with `pyTrue` keepends assertions returning empty lists.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
