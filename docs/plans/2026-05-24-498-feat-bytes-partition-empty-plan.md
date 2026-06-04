---
title: "feat: bytes partition/rpartition empty (plan 498)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 496
---

# bytes.partition / bytes.rpartition on empty bytes

## Summary

Parity with plan 496 `str.rpartition` / `str.partition` empty-string triples: add empty `bytes` cases to `bytes-partition.test.ts`. Update validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `partition(b"", b",")` → three empty `bytes` parts |
| R2 | `rpartition(b"", b",")` → three empty `bytes` parts |
| R3 | validation-ladder updated |
| R4 | `npm run check && npm test && npm run golden:keys` green |

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
