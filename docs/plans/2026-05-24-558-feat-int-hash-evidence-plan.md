---
title: "feat: int __hash__ evidence (plan 558)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 556
---

# int __hash__ evidence

## Summary

CPython: `int` is hashable; `hash(0)` is `0`; equal ints hash equally. Add `int-hash.test.ts` mirroring `str-hash.test.ts` / `bytes-hash.test.ts` and validation-ladder row.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `hash(pyInt(0))` → `0` |
| R2 | Same `int` object returns stable hash |
| R3 | Equal ints built separately share hash |
| R4 | Different ints differ in hash |
| R5 | validation-ladder documents `int-hash.test.ts` (plan 558) |
| R6 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; CPython hash randomization / unlimited int hash algorithm parity.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/int-hash.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
