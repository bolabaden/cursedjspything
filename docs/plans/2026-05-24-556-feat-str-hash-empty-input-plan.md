---
title: "feat: str __hash__ evidence (plan 556)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 554
---

# str __hash__ evidence

## Summary

CPython: `str` is hashable; empty `str` hashes to `0`; equal strings hash equally. Add `str-hash.test.ts` mirroring `bytes-hash.test.ts` and validation-ladder row.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `hash(pyStr(""))` → `0` |
| R2 | Same `str` object returns stable hash |
| R3 | Equal strings built separately share hash |
| R4 | Different strings differ in hash |
| R5 | validation-ladder documents `str-hash.test.ts` (plan 556) |
| R6 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; CPython hash salt / per-process randomization parity.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-hash.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
