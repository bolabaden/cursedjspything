---
title: "feat: bytes.rpartition exact match (plan 504)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 502
---

# bytes.rpartition exact separator match

## Summary

`bytes.partition` and `str.rpartition` already test exact-match triples; add `bytes.rpartition(b"x", b"x")` → `[[], [120], []]`. Update validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `rpartition(b"x", b"x")` returns empty, sep, empty parts |
| R2 | validation-ladder updated |
| R3 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime; str.partition; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/bytes-partition.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
