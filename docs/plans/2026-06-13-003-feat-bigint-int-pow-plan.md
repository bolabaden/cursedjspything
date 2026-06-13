---
title: "feat: bigint int pow (plan 928)"
type: feat
status: completed
date: 2026-06-13
origin: LIVING-PLAN post-927 — bigint tower slice for ** and three-arg pow
---

# Bigint int pow

## Summary

Extend bigint-stored `int` objects (plans 915/926/927) with CPython-parity **`**` / `pow()`** against int and bool operands, including three-arg modular exponentiation. Evidence extends `int-bigint-arithmetic.test.ts`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Bigint int `**` int (safe-integer and bigint-stored) in both operand orders |
| R2 | Bigint int `**` bool treats exponent as 0/1 |
| R3 | Negative int exponent returns `pyFloat` (CPython non-integer int power) |
| R4 | Two-arg results preserve bigint storage when result exceeds `MAX_SAFE_INTEGER` |
| R5 | Three-arg `pow(base, exp, mod)` with int/bool operands uses modular exponentiation |
| R6 | Three-arg `mod == 0` raises `PyValueError` (`pow() 3rd argument cannot be 0`) |
| R7 | Extend `int-bigint-arithmetic.test.ts` with two-arg and three-arg cases |
| R8 | Update COMPATIBILITY §8, validation-ladder, LIVING-PLAN |
| R9 | `npm run check && npm test` |

## Implementation

- Add `intPowInt` using `toIntBigInt` / `intObjectFromBigInt` (same path as plan 926/927)
- Route `Slot.pow` through `intNativeValue`, `intOperandFromObject`, float branch via `intToFloatOperand`
- Defer inplace `**=`, bitwise, str parsing

## Files

- `src/runtime/builtins/int.ts`
- `test/cpython-derived/int-bigint-arithmetic.test.ts`
- `docs/COMPATIBILITY_AND_GAPS.md`
- `docs/knowledgebase/50-execution/validation-ladder.md`
- `docs/knowledgebase/LIVING-PLAN.md`
