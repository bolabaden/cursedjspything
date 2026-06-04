---
title: "feat: float __hash__ evidence (plan 562)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 560
---

# float __hash__ evidence

## Summary

CPython: `float` is hashable; integral-valued floats share `int` hash (`hash(0.0)` → `0`); non-integral floats use a distinct algorithm. Add `float-hash.test.ts` mirroring the scalar hash series and validation-ladder row.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `hash(pyFloat(0))` → `0` |
| R2 | Integral float `hash(pyFloat(1))` → `1`; `hash(pyFloat(42))` equals `hash(pyInt(42))` |
| R3 | Same float object returns stable hash |
| R4 | Equal floats built separately share hash |
| R5 | Different floats differ in hash (e.g. `3.14` vs `3.15`) |
| R6 | validation-ladder documents `float-hash.test.ts` (plan 562) |
| R7 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; asserting CPython numeric hash for arbitrary non-integral floats (pyrt uses JS float64 XOR).

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/float-hash.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
