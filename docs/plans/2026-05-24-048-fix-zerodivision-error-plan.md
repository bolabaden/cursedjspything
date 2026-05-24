---
title: "fix: int/float division raises PyZeroDivisionError"
type: fix
status: completed
date: 2026-05-24
origin: docs/COMPATIBILITY_AND_GAPS.md §8.17
---

# Int/float ZeroDivisionError parity

## Summary

Add `PyZeroDivisionError` and use it for int/float `__truediv__`, `__floordiv__`, `__mod__`, and int `__motion__`/`motion__` zero-divisor paths — completing numeric exception typing after PyIndexError (plan 031).

---

## Problem Frame

COMPATIBILITY §8.17 notes remaining plain `Error` throws in builtins. `int.ts` and `float.ts` use `throw new Error("ZeroDivisionError: …")` for zero divisors.

---

## Requirements

- R1. Add `PyZeroDivisionError` to `src/runtime/core/errors.ts`
- R2. Re-export from `lookup.ts` and `src/barrel/stable.ts`
- R3. Replace zero-divisor throws in `int.ts` (truediv, floordiv, mod, divmod) and `float.ts` (truediv, floordiv, mod) with typed exceptions and CPython message text (no `ZeroDivisionError:` prefix in message body)
- R4. Add `test/cpython-derived/operator-zerodivision.test.ts` covering int/float truediv, floordiv, mod, int divmod
- R5. Update COMPATIBILITY §8.17 remaining-gap note; LIVING-PLAN delta
- R6. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- int/float slot handlers only
- No golden JSON changes
- No pow/mod three-arg edge cases beyond existing int paths

---

## Implementation Units

- U1. `PyZeroDivisionError` + exports
- U2. `int.ts` / `float.ts` slot updates
- U3. Vitest + COMPATIBILITY + LIVING-PLAN

---

## Test Scenarios

- T1. `pyInt(1) / pyInt(0)` throws `PyZeroDivisionError` with message `division by zero`
- T2. `pyInt(1) // pyInt(0)` throws `PyZeroDivisionError` with `integer division or modulo by zero`
- T3. `pyInt(1) % pyInt(0)` throws `PyZeroDivisionError` with `integer modulo by zero`
- T4. int `motion__`/`divmod` with zero divisor throws same floordiv message
- T5. float truediv/floordiv/mod zero cases with float-specific messages

---

## Sources & References

- CPython `Lib/test/test_operator.py` division-by-zero spirit
- `docs/plans/2026-05-24-031-fix-sequence-indexerror-plan.md`
