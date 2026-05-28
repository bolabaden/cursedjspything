---
title: "feat: str format alignment and precision"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 221 next steps
---

# str format alignment and precision

## Summary

Implement CPython **`str.__format__`** width, alignment, fill, and precision truncation so `str.format` field specs like `{:<10}`, `{:*^10}`, and `{:.3}` pad and truncate correctly.

---

## Problem Frame

Int format stack is complete on `main`. `str.__format__` currently ignores non-empty specs (returns the raw string). LIVING-PLAN next format parity item.

---

## Requirements

- R1. `format(pyStr("hello"), "<10")` → left-padded width 10
- R2. `format(pyStr("hello"), ">10")` and `"^10"` → right/center align
- R3. `format(pyStr("hello"), "*^10")` → custom fill + center
- R4. `format(pyStr("hello"), ".3")` → truncate; `"10.3"` → truncate then pad
- R5. `format(pyStr("hello"), "010")` → zero-fill width (CPython `0` prefix)
- R6. `ValueError` on sign, `#`, `=`, unknown type codes
- R7. Tests + LIVING-PLAN delta; validation ladder

---

## Scope Boundaries

- String type only (`s` or empty type); no float/int codes on str
- PEP 3118 out of scope

---

## Implementation Units

- U1. `parseStrFormatSpec` + `formatStrSpec` in `src/runtime/builtins/str.ts`; wire `Hook.format`
- U2. Tests in `operator-format-evidence.test.ts` and `str-format.test.ts`
- U3. LIVING-PLAN delta; feature branch + PR

---

## Test Scenarios

- T1. `<10`, `>10`, `^10`, `*^10` on `"hello"`
- T2. `.3`, `10.3` truncation + width
- T3. `010` zero fill
- T4. `+10`, `#10`, `=10`, `x` → ValueError

---

## Patterns

Mirror int width/fill parsing from `int.ts`; reject sign/`#`/ `=` per CPython str formatter.
