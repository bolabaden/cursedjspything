---
title: "feat: complex modulo pow guard and scalar truediv evidence (plan 902)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN post-901 — Tier-1 complex cross-type gaps
---

# Complex modulo pow guard and scalar truediv evidence

## Summary

Reject three-arg `pow()` when any operand is `complex` with CPython's `ValueError: complex modulo` before slot dispatch (fixes silent ignore / BigInt crash). Add cpython-derived evidence for scalar `/` complex via `__rtruediv__` and `divmod` rejection.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `pow(base, exp, mod)` with complex base, exp, or mod → `PyValueError` `complex modulo` |
| R2 | Two-arg `pow(int/float/bool, complex)` unchanged (plan 901 `__rpow__`) |
| R3 | `int/float/bool / complex` → complex via `complex.__rtruediv__` with CPython values |
| R4 | `divmod(scalar, complex)` → unsupported-operand `PyTypeError` |
| R5 | Docs: COMPATIBILITY, validation-ladder, LIVING-PLAN |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No three-arg pow implementation for complex.
- No inplace complex ops in this slice.
- PEP 3118 out of scope.

## Implementation Units

### U1. Runtime

**File:** `src/runtime/dispatch/operators/numeric.ts` — guard in `ternaryOp` when modulus present and any operand is complex.

### U2. Tests and docs

**Files:** `test/cpython-derived/operator-scalar-complex-truediv-pow-modulo.test.ts`, doc updates.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
