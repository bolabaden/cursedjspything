---
title: "feat: str↔bool eq/ne and ordering in str-scalar (plan 470)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 468
---

# str↔bool eq/ne and ordering evidence

## Summary

Add missing str↔bool rich-compare evidence (eq/ne non-coercion, ordering TypeError via helper) to `operator-str-scalar.test.ts`; sync §8.15. bool↔str binary ops stay in `operator-bool-str-remaining-binary.test.ts`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | str↔bool eq/ne false/true without coercion in str-scalar |
| R2 | str↔bool ordering via `registerCrossTypeOrderingRejects` |
| R3 | validation-ladder + COMPATIBILITY §8.15 cite str-scalar for str↔bool compare/ordering |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Moving bool-str binary ops; runtime changes unless tests fail; PEP 3118; golden script Error types.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/operator-str-scalar.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/COMPATIBILITY_AND_GAPS.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
