---
title: "feat: complex eq/ne and int pow (plan 897)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN plan 896 next — complex pow/ordering deferred
---

# Complex equality and integer exponentiation

## Summary

Add `__eq__` / `__ne__` on `complex` (complex/complex and scalar cross-type when imag is zero) and `__pow__` for integer exponents via polar form. Prove ordering comparisons remain unsupported (`NotImplemented` → `TypeError`).

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `complex == complex` compares real/imag components |
| R2 | `complex == int/float/bool` when `imag==0` and `real` matches scalar |
| R3 | `complex ** int` (incl. 0, negative) via polar formula; `0**negative` → `PyZeroDivisionError` |
| R4 | `lt`/`le`/`gt`/`ge` on complex → `TypeError` |
| R5 | `operator-complex-eq-pow.test.ts`; docs |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No ordering slots on complex; no floordiv/mod; no non-integer or complex exponent.
- PEP 3118 out of scope.

## Implementation Units

### U1. Runtime slots

**File:** `src/runtime/builtins/complex.ts`

- `eqComponents`, `powComplexInt` helpers.
- `Slot.eq`, `Slot.ne`, `Slot.pow`.

### U2. Tests and docs

**Files:** `test/cpython-derived/operator-complex-eq-pow.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/LIVING-PLAN.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Test Scenarios

- T1. `(1+2j) == (1+2j)`; `(1+2j) != (1+3j)`
- T2. `(1+0j) == 1`; `(1+2j) == 1` is false
- T3. `(1+2j)**2` → `(-3+4j)`; `(1+2j)**0` → `(1+0j)`
- T4. `0j**-1` → `PyZeroDivisionError`
- T5. `lt(pyComplex(1,2), pyComplex(1,3))` → `TypeError`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
