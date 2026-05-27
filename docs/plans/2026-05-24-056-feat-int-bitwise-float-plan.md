---
title: "feat: int/float bitwise and shift TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 055 next steps
---

# Int/float bitwise and shift TypeError evidence

## Summary

Add CPython-derived Vitest proving int **bitwise** and **shift** operators reject **float** operands via **`PyTypeError`** dispatch errors.

---

## Problem Frame

Int slots return `NotImplemented` for non-int rhs on `&`, `|`, `^`, `<<`, `>>`. Dispatch raises `unsupported operand type(s) for …: 'int' and 'float'`. No dedicated tests; LIVING-PLAN flagged int↔float bitwise gap.

---

## Requirements

- R1. Add `test/cpython-derived/operator-int-bitwise-float.test.ts` (&, |, ^, <<, >> vs float)
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only
- No runtime changes

---

## Implementation Units

- U1. Vitest
- U2. COMPATIBILITY + validation-ladder + LIVING-PLAN

---

## Test Scenarios

- T1–T5. Each operator with `pyFloat` rhs throws `PyTypeError` with expected dispatch message

---

## Sources & References

- CPython `Lib/test/test_operator.py` spirit
- `docs/plans/2026-05-24-055-feat-sequence-cross-type-plan.md`
