---
title: "feat: str/bytes join empty separator (plan 510)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 508
---

# str.join / bytes.join empty separator

## Summary

Empty separator joins concatenate with no intervening bytes (CPython). Add evidence to `str-join.test.ts` and `bytes-join.test.ts`; sync validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"".join(["a","b"])` → `"ab"` |
| R2 | `b"".join([b"a",b"b"])` → `b"ab"` |
| R3 | validation-ladder updated |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-join.test.ts`, `test/cpython-derived/bytes-join.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
