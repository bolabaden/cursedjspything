---
title: "feat: complex scalar arithmetic add/sub/mul (plan 895)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN plan 894 next — complex arithmetic binary ops deferred
---

# Complex scalar arithmetic (add / sub / mul)

## Summary

Wire `__add__` / `__radd__`, `__sub__` / `__rsub__`, and `__mul__` / `__rmul__` on `complex` and promote int/float/bool operands to complex results for mixed scalar pairs. Follow int↔float promotion patterns in `int.ts` / `float.ts`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `complex ± complex` and `complex * complex` return `pyComplex` with JS number arithmetic on components |
| R2 | `complex ± int/float/bool` and reverse (`int + complex`, etc.) promote scalar to real part |
| R3 | `complex * int/float/bool` and reverse scale real/imag components |
| R4 | Non-numeric operands → `NotImplemented` (dispatch raises `PyTypeError`) |
| R5 | `operator-complex-scalar.test.ts` with cpython-derived cases |
| R6 | Docs: COMPATIBILITY §8.15, validation-ladder, LIVING-PLAN |
| R7 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No `truediv`, `floordiv`, `mod`, `pow`, unary `+/-`, `abs`, or ordering on complex in this slice.
- No inplace `iadd`/`isub`/`imul`.
- PEP 3118 out of scope.

## Implementation Units

### U1. Runtime slots

**Files:** `src/runtime/builtins/complex.ts`, `src/runtime/builtins/int.ts`, `src/runtime/builtins/float.ts`

- Export `isComplexOperand` / `complexComponents` helpers from `complex.ts` if needed.
- Add six binary slots on `complexType`.
- Extend int/float `add`/`sub`/`mul` (and reflected paths via existing slot symmetry) to detect `complexType` and return `pyComplex`.

### U2. Tests and docs

**Files:** `test/cpython-derived/operator-complex-scalar.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/LIVING-PLAN.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Test Scenarios

- T1. `(1+2j) + (3+4j)` → `(4+6j)` repr
- T2. `(1+2j) + 5` and `5 + (1+2j)` → `(6+2j)`
- T3. `(1+2j) - 1` and `3 - (1+2j)` → `(0+2j)` and `(2-2j)`
- T4. `(1+2j) * 2` and `2 * (1+2j)` → `(2+4j)`
- T5. `add(pyList, pyComplex)` → `PyTypeError`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
