---
title: "feat: bigint int comparison and arithmetic (plan 926)"
type: feat
status: completed
date: 2026-06-13
origin: LIVING-PLAN post-925 — broader bigint int arithmetic evidence and runtime parity
---

# Bigint int comparison and arithmetic

## Summary

Extend bigint-stored `int` objects (from `float.as_integer_ratio()` plan 915) with CPython-parity **rich comparison** and **add/sub/mul** against other ints and bools, plus evidence tests sourced from ratio components. Narrow first slice of deferred “full bigint tower” work.

## Problem Frame

Plan 915 stores ratio components beyond `MAX_SAFE_INTEGER` as native `bigint` on `int` with correct `repr`/`str` (plan 917). Comparison and arithmetic slots still read `nativeVal<number>`, so bigint ints mis-compare and lack `+`/`-`/`*` against other ints. Plan 919 explicitly deferred “broader bigint int `==` beyond ratio storage.”

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Bigint int `==`/`!=` int (safe-integer and bigint-stored) in both orders |
| R2 | Bigint int ordering vs int uses numeric magnitude (lt/le/gt/ge) |
| R3 | Bigint int `==`/`!=` bool follows numeric promotion (True→1, False→0) |
| R4 | Bigint int `+`/`-`/`*` int preserves bigint when result exceeds safe range or either operand is bigint-stored |
| R5 | Bigint int `==` float when float is an exact integer representation (e.g. ratio denominator) |
| R6 | Evidence: `test/cpython-derived/int-bigint-arithmetic.test.ts` using `0.1.as_integer_ratio()` components |
| R7 | Docs: COMPATIBILITY §8, validation-ladder, LIVING-PLAN plan 926 delta |
| R8 | `npm run check && npm test && npm run golden:keys` |

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Use JS `bigint` for int↔int compare and add/sub/mul | Matches existing storage; no arbitrary-precision parser |
| Route comparisons through `intNativeValue` helpers | Single fix surface for eq/ne/ordering slots |
| Defer bitwise/shift/div/pow on bigint operands | Out of slice; ratio use case is compare + small offset |
| Defer `as_integer_ratio`/`to_bytes` on bigint self | Separate follow-up; ratio components are inputs not subjects |

## Scope Boundaries

### In scope

- `src/runtime/builtins/int.ts` comparison and int↔int/bool add/sub/mul
- CPython-derived evidence file and doc sync

### Deferred to Follow-Up Work

- Full bigint tower (divmod, pow, bitwise, str parsing)
- `numericOperand` refactor for all call sites
- PEP 3118

## Implementation Units

### U1. Runtime bigint compare and arithmetic

**Goal:** Wire int slots to handle `number | bigint` native storage.

**Requirements:** R1–R5

**Files:** `src/runtime/builtins/int.ts`

**Approach:** Add `toIntBigInt`, `compareIntValues`, `pyIntFromBigIntResult`, `intEqFloat`; update eq/ne/lt/le/gt/ge and add/sub/mul (+ reflected) to branch on bigint operands; float on other side promotes to `pyFloat` for arithmetic, exact-integer check for eq.

**Test scenarios:**

- Happy path: ratio denominator `==` reconstructed bigint int; `+ 1` yields next bigint.
- Edge: numerator (safe int) vs denominator (bigint) ordering.
- Error path: none in this unit.

**Verification:** Manual probe + U2 tests green.

### U2. Evidence and docs

**Goal:** Lock parity with CPython-derived cases and sync docs.

**Requirements:** R6–R8

**Files:** `test/cpython-derived/int-bigint-arithmetic.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/knowledgebase/LIVING-PLAN.md`

**Approach:** Mirror `operator-int-bool.test.ts` dispatch helpers; source operands from `float(0.1).as_integer_ratio()`.

**Test scenarios:**

- eq/ne/ordering between ratio num/den and literal ints
- add/sub/mul on ratio denominator with small int offset
- bool comparison on zero bigint component if applicable

**Verification:** `npm run check && npm test && npm run golden:keys`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
