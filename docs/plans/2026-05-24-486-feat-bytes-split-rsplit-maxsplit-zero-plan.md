---
title: "feat: bytes split/rsplit maxsplit=0 with sep (plan 486)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 484
---

# bytes.split/rsplit maxsplit=0 with explicit sep

## Summary

Add `maxsplit=0` with explicit separator tests to `bytes-split.test.ts` and `bytes-rsplit.test.ts` (parity with plan 484 str.split). Update validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | bytes.split maxsplit=0 + explicit sep returns whole bytes |
| R2 | bytes.rsplit maxsplit=0 + explicit sep returns whole bytes |
| R3 | validation-ladder updated |
| R4 | Tests green |

## Scope Boundaries

### Outside scope

- Runtime; str changes; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/bytes-split.test.ts`, `test/cpython-derived/bytes-rsplit.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
