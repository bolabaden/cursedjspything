---
title: "feat: complex truediv and unary neg/pos/abs (plan 896)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN plan 895 next — complex div/pow/unary deferred
---

# Complex division and unary operators

## Summary

Add `__truediv__` / `__rtruediv__` on `complex` for scalar and complex divisors, plus unary `__neg__`, `__pos__`, and `__abs__` (abs returns `pyFloat` per CPython). Follow plan 895 scalar-reflection patterns.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `complex / complex` via conjugate-scaled formula; zero divisor → `PyZeroDivisionError` |
| R2 | `complex / scalar` and `scalar / complex` (reflected) |
| R3 | `-(a+bj)` → `pyComplex(-a,-b)`; `+(a+bj)` identity; `abs(a+bj)` → `pyFloat(hypot)` |
| R4 | Non-numeric divisor → `NotImplemented` |
| R5 | `operator-complex-div-unary.test.ts` |
| R6 | Docs: COMPATIBILITY §8.15, validation-ladder, LIVING-PLAN |
| R7 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No `floordiv`, `mod`, `pow`, inplace ops, or ordering on complex.
- PEP 3118 out of scope.

## Implementation Units

### U1. Runtime slots

**File:** `src/runtime/builtins/complex.ts`

- `divComponents(a, b)` for complex/complex; `divByScalar` for complex/scalar.
- `Slot.truediv`, `Slot.rtruediv`, `Slot.neg`, `Slot.pos`, `Slot.abs`.

### U2. Tests and docs

**Files:** `test/cpython-derived/operator-complex-div-unary.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/LIVING-PLAN.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Test Scenarios

- T1. `(1+2j) / 2` → `(0.5+1j)`
- T2. `2 / (1+2j)` → `(0.4-0.8j)` (approx; use repr or component unwrap)
- T3. `(1+2j) / (1+1j)` → `(1.5+0.5j)`
- T4. `(1+2j) / 0` → `PyZeroDivisionError`
- T5. `-(1+2j)`, `+(1+2j)`, `abs(3+4j)` → `5.0` float

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
