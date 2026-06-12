---
title: "feat: scalar-complex pow edge evidence (plan 909)"
type: feat
status: active
date: 2026-05-24
origin: LIVING-PLAN post-908 — Tier-1 cross-type numeric pow gaps
---

# Scalar-complex pow edge evidence

## Summary

Lock CPython 3.14 parity for scalar **`**`** complex edge cases already implemented via `complex.__rpow__`: bool bases, `0**0j`, zero-to-complex-power errors, unit imaginary exponent, and negative-base complex exponent.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `True ** complex` → `(1+0j)`; `False ** complex` → `ZeroDivisionError` |
| R2 | `0 ** 0j` → `(1+0j)`; `0 ** 1j` (and other complex nonzero exp) → `ZeroDivisionError` |
| R3 | `2 ** 0j` → `(1+0j)` for int and float bases |
| R4 | `(-2) ** 2j` matches CPython magnitude/phase within float tolerance |
| R5 | int and float paths both covered |
| R6 | Docs: COMPATIBILITY, validation-ladder, LIVING-PLAN |
| R7 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No runtime changes unless tests expose a regression.
- No inplace ops, ordering, or new operator surfaces.
- PEP 3118 out of scope.

## Implementation Units

### U1. Tests and docs

**Files:** `test/cpython-derived/operator-scalar-complex-pow-edges.test.ts`, doc updates.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
