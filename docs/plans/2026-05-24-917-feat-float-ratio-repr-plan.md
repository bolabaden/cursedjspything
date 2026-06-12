---
title: "feat: float ratio bigint int repr evidence (plan 917)"
type: feat
status: active
date: 2026-05-24
origin: LIVING-PLAN post-916 — complete plan 915 R4 repr verification for 0.1 ratio
---

# Float ratio bigint int repr evidence

## Summary

Add explicit CPython-derived **`repr()`** evidence for bigint-stored int components returned by `float.as_integer_ratio()`, especially the `0.1` denominator beyond `MAX_SAFE_INTEGER`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `repr(num)` and `repr(den)` for `0.1.as_integer_ratio()` match CPython decimal strings |
| R2 | Safe-integer ratio components (`2.5`) still repr as plain decimals |
| R3 | Docs: COMPATIBILITY, validation-ladder, LIVING-PLAN |
| R4 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Tests-only; repr/str bigint path landed in plan 915.
- Full bigint int arithmetic out of scope.
- PEP 3118 out of scope.

## Implementation Units

### U1. Tests and docs

**Files:** `test/cpython-derived/float-integer-ratio.test.ts`, doc updates.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
