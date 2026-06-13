---
title: "feat: bigint int divmod floordiv mod (plan 927)"
type: feat
status: completed
date: 2026-06-13
origin: LIVING-PLAN post-926 — bigint tower slice for division operators
---

# Bigint int divmod, floordiv, and mod

## Summary

Extend bigint-stored `int` objects (plan 915/926) with CPython-parity **`//`**, **`%`**, and **`divmod`** against other ints and bools, with evidence tests sourced from `float.as_integer_ratio()` components. First division slice of deferred bigint tower work.

## Problem Frame

Plan 926 wired bigint int compare and add/sub/mul but left `floordiv`, `mod`, and `divmod` reading `nativeVal<number>(self)`, so bigint-stored ints mis-divide or throw. LIVING-PLAN defers full bigint tower; this slice closes division only.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Bigint int `//` int (safe-integer and bigint-stored) and bool in both orders |
| R2 | Bigint int `%` int/bool uses Python floor-mod semantics (remainder sign follows divisor) |
| R3 | Bigint int `divmod` int/bool returns `(quotient, remainder)` tuple with R1/R2 semantics |
| R4 | Zero divisor on `//`, `%`, `divmod` raises `PyZeroDivisionError` with CPython messages |
| R5 | Results preserve bigint storage when magnitude exceeds `MAX_SAFE_INTEGER` |
| R6 | Evidence: extend `test/cpython-derived/int-bigint-arithmetic.test.ts` with CPython-sourced cases |
| R7 | Docs: COMPATIBILITY §8, validation-ladder, LIVING-PLAN plan 927 delta |
| R8 | `npm run check && npm test` |

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| `intFloorDivBigInt` / `intModBigInt` via JS `bigint` | Matches plan 926 `toIntBigInt` path; adjust truncating `/` and C-style `%` for Python floor semantics |
| Route int↔int/bool through `intOperandFromObject` | Same pattern as add/sub/mul in plan 926 |
| Float divisor promotes via `intToFloatOperand` | Preserves existing float floor/mod behavior for safe-int self; bigint self uses float path like add/sub |
| Defer pow, bitwise, str parsing, inplace `//=`/`%=` | Out of slice per user scope |

## Scope Boundaries

### In scope

- `src/runtime/builtins/int.ts` floordiv, mod, divmod slots for bigint operands
- CPython-derived evidence extension and doc sync

### Deferred

- Bigint pow, bitwise, shift, str parsing
- `to_bytes` / `as_integer_ratio` on bigint self
- PEP 3118

## Implementation Units

### U1. Runtime bigint division operators

**Goal:** Wire `floordiv`, `mod`, `divmod` to handle `number | bigint` native storage.

**Requirements:** R1–R5

**Files:** `src/runtime/builtins/int.ts`

**Approach:** Add `pythonFloorDivBigInt`, `intFloorDivInt`, `intModInt`, `intDivmodInt`; update slots to branch on `intNativeValue` / `intOperandFromObject` like add/sub/mul; keep float branch via `intToFloatOperand`.

**Test scenarios:**

- Happy: `den // 2`, `den % 3`, `divmod(den, num)` match CPython literals
- Edge: negative bigint `divmod(-den, 3)` floor semantics
- Bool: `den // True`, `den % True`, `divmod(den, True)`
- Error: `den % False` → `ZeroDivisionError`

**Verification:** U2 tests green.

### U2. Evidence and docs

**Goal:** Lock parity and sync docs.

**Requirements:** R6–R8

**Files:** `test/cpython-derived/int-bigint-arithmetic.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/knowledgebase/LIVING-PLAN.md`

**Verification:**

```bash
npm run check && npm test
```
