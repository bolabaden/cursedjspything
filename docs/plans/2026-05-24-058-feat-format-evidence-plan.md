---
title: "feat: format() conversion evidence for int/str and TypeError paths"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 057 next steps
---

# format() conversion evidence for int/str and TypeError paths

## Summary

Add CPython-derived Vitest proving the exported **`format()`** helper formats **`int`** and **`str`** via `__format__`, falls back to **`str()`** when the format spec is empty, and raises **`PyTypeError`** for non-empty specs on types without `__format__`.

---

## Problem Frame

`format(obj, spec)` in `src/runtime/dispatch/operators/numeric.ts` dispatches `Hook.format`; only `int` and `str` builtins implement it. A single smoke case exists in `test/dispatch/operators.test.ts`; parity docs list `format` among exported operators lacking dedicated CPython-derived coverage.

---

## Requirements

- R1. Add `test/cpython-derived/operator-format-evidence.test.ts`
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only
- No runtime changes

---

## Implementation Units

- U1. **Vitest** — int hex format, str empty spec, empty-spec str fallback on list, non-empty spec TypeError on list/float

- U2. **Docs** — COMPATIBILITY evidence, validation-ladder, LIVING-PLAN

---

## Test Scenarios

- T1. `format(pyInt(255), "x")` → `"ff"`
- T2. `format(pyStr("ab"), "")` → `"ab"`
- T3. `format(pyList([]), "")` → str(list) e.g. `"[]"`
- T4. `format(pyList([]), "s")` throws `PyTypeError` with `unsupported format string passed to list.__format__`
- T5. `format(pyFloat(1.0), ".2f")` throws `PyTypeError` with `unsupported format string passed to float.__format__`

---

## Sources & References

- CPython `format()` / `__format__` spirit
- `src/runtime/dispatch/operators/numeric.ts` — `format()`
- `docs/plans/2026-05-24-057-feat-bytes-conversion-evidence-plan.md`
