---
title: "feat: join empty separator + empty iterable (plan 518)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 516
---

# str/bytes.join empty separator with empty iterable

## Summary

Plan 510 covered empty-separator concatenation with elements; CPython also defines `"".join([])` → `""` and `b"".join([])` → `b""`. Add derived evidence and sync validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"".join([])` → `""` |
| R2 | `b"".join([])` → `b""` |
| R3 | validation-ladder notes plan 518 on join rows |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime (expected correct).
- PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-join.test.ts`, `test/cpython-derived/bytes-join.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
