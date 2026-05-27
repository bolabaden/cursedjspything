---
title: "feat: matmul @ operator TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 058 next steps
---

# matmul @ operator TypeError evidence

## Summary

Add CPython-derived Vitest proving the exported **`matmul()`** (`@`) operator raises **`PyTypeError`** when builtins lack `__matmul__` implementations (existing dispatch behavior, now evidenced).

---

## Problem Frame

`matmul(a, b)` in `src/runtime/dispatch/operators/numeric.ts` uses `binaryOp` with `Slot.matmul` / `Slot.rmatmul`. Builtin types do not implement matrix multiply; dispatch raises `TypeError`. Parity docs list `matmul` among exported operators without dedicated tests.

---

## Requirements

- R1. Add `test/cpython-derived/operator-matmul-evidence.test.ts`
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only
- No runtime changes

---

## Implementation Units

- U1. **Vitest** — int@int, list@list, int@str TypeError paths

- U2. **Docs** — COMPATIBILITY, validation-ladder, ReadLIVING-PLAN

---

## Test Scenarios

- T1. `matmul(pyInt(1), pyInt(2))` → `PyTypeError` with `@` and `'int' and 'int'`
- T2. `matmul(pyList([]), pyList([]))` → `PyTypeError` with `'list' and 'list'`
- T3. `matmul(pyInt(1), pyStr("a"))` → `PyTypeError` with `'int' and 'str'`

---

## Sources & References

- CPython `@` / `__matmul__` spirit
- `docs/plans/2026-05-24-058-feat-format-evidence-plan.md`
