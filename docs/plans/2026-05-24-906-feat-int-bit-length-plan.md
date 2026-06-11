---
title: "feat: int bit_length (plan 906)"
type: feat
status: active
date: 2026-05-24
origin: LIVING-PLAN post-905 — Tier-1 numeric surface outside complex arc
---

# int bit_length

## Summary

Add CPython-compatible `int.bit_length()` returning the minimum number of bits needed to represent the absolute value in binary (zero → 0). Lock behavior with cpython-derived tests and docs.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `int.bit_length()` → `int`; `0.bit_length()` → `0` |
| R2 | Positive and negative values use magnitude (`(-255).bit_length()` → `8`) |
| R3 | Powers-of-two boundaries (`1`, `2`, `255`, `256`, `MAX_SAFE_INTEGER`) match CPython bit counts within JS safe integer storage |
| R4 | Docs: COMPATIBILITY, validation-ladder, LIVING-PLAN |
| R5 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Safe-integer `int` storage only; values outside `Number.isSafeInteger` follow existing `pyInt` truncation limits.
- No `int.to_bytes` / `int.from_bytes` in this slice.
- No `bool.bit_length` inheritance (bool is not int subclass in pyrt).
- PEP 3118 out of scope.

## Implementation Units

### U1. Runtime

**File:** `src/runtime/builtins/int.ts` — `intBitLength`, register `bit_length` on `intType.typeDict`.

### U2. Tests and docs

**Files:** `test/cpython-derived/int-bit-length.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/knowledgebase/LIVING-PLAN.md`.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
