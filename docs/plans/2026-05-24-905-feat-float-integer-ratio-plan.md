---
title: "feat: float is_integer and as_integer_ratio (plan 905)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN post-904 — Tier-1 numeric surface outside complex arc
---

# Float is_integer and as_integer_ratio

## Summary

Add CPython-compatible `float.is_integer()` and `float.as_integer_ratio()` methods on the `float` type, with exact IEEE-754 rational conversion and typed errors for NaN/Infinity.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `is_integer()` → `bool`; `True` for finite integral values including `0.0` |
| R2 | `is_integer()` → `False` for NaN, ±Inf, and non-integral finite values |
| R3 | `as_integer_ratio()` → `(int, int)` tuple with exact reduced ratio |
| R4 | NaN → `PyValueError` `cannot convert NaN to integer ratio` |
| R5 | ±Inf → `PyOverflowError` `cannot convert Infinity to integer ratio` |
| R6 | Docs: COMPATIBILITY, validation-ladder, LIVING-PLAN |
| R7 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No `int.as_integer_ratio` (int is already rational).
- No `Fraction` type.
- PEP 3118 out of scope.

## Implementation Units

### U1. Runtime

**File:** `src/runtime/builtins/float.ts` — `floatIsInteger`, `floatAsIntegerRatio`, type dict methods.

### U2. Tests and docs

**Files:** `test/cpython-derived/float-integer-ratio.test.ts`, doc updates.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
