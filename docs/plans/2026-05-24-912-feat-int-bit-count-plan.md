---
title: "feat: int bit_count (plan 912)"
type: feat
status: active
date: 2026-05-24
origin: LIVING-PLAN post-911 — Tier-1 numeric surface (int population count)
---

# int bit_count

## Summary

Add CPython-compatible `int.bit_count()` returning the number of `1` bits in the binary representation of the absolute value (Python 3.10+).

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `int.bit_count()` → `int`; `0.bit_count()` → `0` |
| R2 | Uses magnitude (`(-255).bit_count()` → `8`) |
| R3 | Powers-of-two boundaries match CPython within safe-integer storage |
| R4 | Docs: COMPATIBILITY, validation-ladder, LIVING-PLAN |
| R5 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Safe-integer `int` storage only; same `pyInt` / `pyIntFromSafeInteger` limits as plan 906.
- No `bool.bit_count` inheritance tests (bool not int subclass in pyrt).
- PEP 3118 out of scope.

## Implementation Units

### U1. Runtime

**File:** `src/runtime/builtins/int.ts` — `intBitCount`, register `bit_count` on `intType.typeDict`.

### U2. Tests and docs

**Files:** `test/cpython-derived/int-bit-count.test.ts`, doc updates.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
