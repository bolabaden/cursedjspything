---
title: "feat: int as_integer_ratio (plan 911)"
type: feat
status: active
date: 2026-05-24
origin: LIVING-PLAN post-910 — Tier-1 numeric surface (int rational form)
---

# int as_integer_ratio

## Summary

Add CPython-compatible `int.as_integer_ratio()` returning `(n, 1)` for the stored integer value, complementing `float.as_integer_ratio()` (plan 905).

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `int.as_integer_ratio()` → `(int, int)` tuple `(n, 1)` |
| R2 | Positive, negative, and zero values return correct numerator with denominator `1` |
| R3 | Values stored via `pyIntFromSafeInteger` preserve full numerator when safe |
| R4 | Docs: COMPATIBILITY, validation-ladder, LIVING-PLAN |
| R5 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Safe-integer storage only; `pyInt` `| 0` truncation limits apply to literals outside int32.
- No `Fraction` type.
- PEP 3118 out of scope.

## Implementation Units

### U1. Runtime

**File:** `src/runtime/builtins/int.ts` — register `as_integer_ratio` on `intType.typeDict`, reuse `intObjectFromDecoded` for numerator.

### U2. Tests and docs

**Files:** `test/cpython-derived/int-as-integer-ratio.test.ts`, doc updates.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
