---
title: "feat: str↔bool add and contains in str-scalar (plan 474)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 472
---

# str↔bool add and contains canonical

## Summary

Add str↔bool `add` and `contains` evidence to `operator-str-scalar.test.ts`; drop duplicate `add` from `operator-bool-str-remaining-binary.test.ts`. Sync §8.15.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | str-scalar: contains rejects bool; add rejects str↔bool both orders |
| R2 | bool-str-remaining: remove add block |
| R3 | validation-ladder + COMPATIBILITY updated |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime; moving bool-str other binary ops; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/operator-str-scalar.test.ts`, `test/cpython-derived/operator-bool-str-remaining-binary.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/COMPATIBILITY_AND_GAPS.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
