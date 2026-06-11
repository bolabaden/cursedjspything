---
title: "feat: complex exponent complex pow (plan 899)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN plan 898 next — complex ** complex deferred
---

# Complex ** complex exponentiation

## Summary

Extend `complex.__pow__` to accept a `complex` exponent via `exp(log(base) * exponent)`; preserve scalar exponent paths from plans 897–898.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `(a+bj)**(c+dj)` via complex log/exp/mul |
| R2 | `0j**0` → `1`; `0j**positive` → `0j`; `0j**negative` → `PyZeroDivisionError` |
| R3 | Scalar exponent behavior unchanged |
| R4 | `operator-complex-pow-complex.test.ts`; docs |
| R5 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No `rpow` for complex base; no inplace `ipow`.
- PEP 3118 out of scope.

## Implementation Units

### U1. Runtime

**File:** `src/runtime/builtins/complex.ts` — `logComplex`, `expComplex`, `powComplexComplex`; extend `Slot.pow`.

### U2. Tests and docs

**Files:** `test/cpython-derived/operator-complex-pow-complex.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/LIVING-PLAN.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
