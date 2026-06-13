---
date: 2026-06-13
topic: bigint-int-pow
title: "feat: bigint int pow (plan 928)"
type: feat
origin: LIVING-PLAN post-927 — bigint tower slice for ** and three-arg pow
---

## Summary

Extend bigint-stored `int` objects (plans 915/926/927) with CPython-parity **`**` / `pow()`** against int and bool operands, including three-arg modular exponentiation when the modulus is int/bool. Evidence tests extend `int-bigint-arithmetic.test.ts` using `float.as_integer_ratio()` components. Bitwise, str parsing, and bigint-self methods remain deferred.

## Problem Frame

Plans 926 and 927 wired bigint-aware compare, add/sub/mul, and `//`/`%`/`divmod`, but `Slot.pow` still reads `nativeVal<number>(self)` and uses `Math.pow` for two-arg results. Bigint-stored ints from `as_integer_ratio()` therefore mis-exponentiate or silently corrupt. The living plan lists pow as the next bigint tower operator slice after division.

## Requirements

**Operator parity**

- R1. Bigint int `**` int (safe-integer and bigint-stored) in both operand orders when the operation stays int↔int.
- R2. Bigint int `**` bool treats the exponent as 0 or 1 (`False`→0, `True`→1) in both orders where CPython returns an int result.
- R3. When the exponent is a non-integer float, or a negative int exponent would yield a non-integer result, `**` returns `pyFloat` with CPython semantics (same promotion path as safe-int pow today).
- R4. Two-arg results preserve bigint storage when the mathematical result exceeds `MAX_SAFE_INTEGER`.
- R5. Three-arg `pow(base, exp, mod)` with int/bool base, exponent, and modulus uses integer modular exponentiation and preserves bigint storage when the reduced result exceeds safe range.
- R6. Three-arg `pow(..., mod)` with `mod == 0` raises `PyValueError` with message `pow() 3rd argument cannot be 0` (unchanged contract from `operator-pow-mod.test.ts`).

**Evidence and docs**

- R7. Extend `test/cpython-derived/int-bigint-arithmetic.test.ts` with CPython-sourced cases for two-arg and at least one three-arg modular case on ratio-derived bigint operands.
- R8. Update `docs/COMPATIBILITY_AND_GAPS.md` §8, `docs/knowledgebase/50-execution/validation-ladder.md`, and `docs/knowledgebase/LIVING-PLAN.md` with plan 928 delta.
- R9. `npm run check && npm test` pass.

## Key Decisions

- K1. **Ship two-arg and three-arg int modular pow together.** The slot already exposes a three-arg branch; fixing only two-arg leaves bigint bases broken for `pow(big, exp, mod)` and duplicates work. Same slice boundary as closing the whole `Slot.pow` bigint gap.
- K2. **Reuse the plan 926/927 bigint operand path** (`intNativeValue`, `intOperandFromObject`, `toIntBigInt`, `intObjectFromBigInt`) rather than ad hoc coercion at the slot.
- K3. **Float exponent still promotes to float result** via the existing float branch, using `intToFloatOperand` for bigint bases so `bigint ** float` matches safe-int behavior.
- K4. **Defer inplace `**=` (`ipow`) on bigint operands** to a follow-up slice, consistent with plan 927 deferring inplace division operators.
- K5. **Defer bitwise, shift, str parsing, and `to_bytes` / `as_integer_ratio` on bigint self** — out of this operator slice per tower sequencing.

## Acceptance Examples

- AE1. **Covers R1, R4.** Given ratio denominator `den` from `float(0.1).as_integer_ratio()`, when `den ** 2` runs, then the result equals `36028797018963968n ** 2n` as a bigint-stored int.
- AE2. **Covers R2.** Given `den`, when `den ** True` runs, then the result equals `den`; when `den ** False` runs, then the result is `1`.
- AE3. **Covers R5, R6.** Given safe-int base `pyInt(2)`, exponent `pyInt(10)`, modulus `pyInt(1000)`, when three-arg `pow` runs, then the result is `24`. Given any int base and `mod == 0`, when three-arg `pow` runs, then `PyValueError` is raised with the CPython message.
- AE4. **Covers R3.** Given bigint-stored `den`, when `den ** -1` runs, then the result is a `pyFloat` equal to `1 / Number(den)` (CPython non-integer int power).

## Success Criteria

- Ratio-derived bigint ints exponentiate against int/bool operands without reading truncated `number` natives.
- Existing safe-int pow tests (`operator-pow-mod.test.ts`) remain green.
- Documentation and living plan reflect pow as landed in the bigint tower sequence.

## Scope Boundaries

**In scope**

- `Slot.pow` bigint-aware paths for int↔int/bool two-arg and three-arg modular exponentiation.
- CPython-derived evidence extension and doc sync.

**Deferred for later**

- Bigint inplace `**=` (`ipow`).
- Bigint bitwise and shift operators on bigint-stored operands.
- Arbitrary-precision int literal parsing and bigint-self `to_bytes` / `as_integer_ratio`.
- PEP 3118.

**Outside this slice**

- Complex or float modulus in three-arg pow (existing `ValueError: complex modulo` paths unchanged).
- Refactoring all `numericOperand` call sites beyond pow.

## Dependencies and Assumptions

- Plans 915 (bigint storage), 917 (repr/str), 926 (compare/add/sub/mul), and 927 (division) are merged on `main`.
- Assumption (headless): negative int exponents on bigint bases follow CPython and return float; no separate bigint-fraction int type is introduced.
- Assumption (headless): exponent magnitude limits follow JS `bigint ** bigint` behavior; overflow or excessive cost cases are not special-cased beyond CPython-aligned errors already raised for safe-int pow.
- Assumption (headless): plan id **928** is the next sequential bigint tower slice after 927.

## Outstanding Questions

**Deferred to planning**

- Whether to add a dedicated negative-exponent regression on ratio `den` in the evidence file or rely on AE4 alone.
- Whether three-arg modular cases need a bigint modulus operand test in addition to safe-int modulus (recommended yes if trivial to source from CPython).

**Resolve before planning**

- None — assumptions above unblock planning.

## Sources / Research

- `docs/plans/2026-06-13-001-feat-bigint-int-comparison-arithmetic-plan.md` (plan 926 pattern)
- `docs/plans/2026-06-13-002-feat-bigint-int-divmod-floordiv-mod-plan.md` (plan 927 pattern and deferrals)
- `src/runtime/builtins/int.ts` — current `Slot.pow` uses `nativeVal<number>(self)` and `Math.pow`
- `test/cpython-derived/int-bigint-arithmetic.test.ts` — evidence home for bigint int operators
- `test/cpython-derived/operator-pow-mod.test.ts` — existing three-arg mod-zero contract
