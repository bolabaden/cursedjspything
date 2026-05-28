---
title: "feat: int format g/G/% presentation"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 219 partial
---

# int format g/G/% presentation

## Summary

Extend **`int.__format__`** with CPython general and percent presentation codes **`g`** / **`G`** / **`%`**, completing the deferred float-style int format slice from plan 218.

---

## Problem Frame

Plans 214–218 landed int width, sign, and `f`/`e` presentation; LIVING-PLAN partial still defers **`g`/`G`/`%`**.

---

## Requirements

- R1. `format(pyInt(1), "g")` → `"1"`; `format(pyInt(255), "g")` → `"255"`
- R2. `format(pyInt(1000000), "g")` → `"1e+06"`; `format(pyInt(999999), ".3g")` → `"1e+06"`
- R3. `format(pyInt(1234567), ".6g")` → `"1.23457e+06"`; `G` uses uppercase `E`
- R4. `format(pyInt(1), "%")` → `"100.000000%"`; `format(pyInt(255), ".2%")` → `"25500.00%"`
- R5. Sign + g/% specs (`"+.2g"`, `"-.2%"`) on positive/negative ints
- R6. Width padding on g/% (e.g. `"10g"`, `"12g"`) via existing float presentation path
- R7. Integer-only specs still reject stray precision (`.2` without type)
- R8. Tests + LIVING-PLAN delta; full validation ladder

---

## Scope Boundaries

- No float `__format__` work; PEP 3118 out of scope
- No further format codes beyond g/G/% in this slice

---

## Key Technical Decisions

- **Extend `FloatPresentationType`** with `g`, `G`, `%` in existing `parseFloatPresentationSpec` / `formatIntFloatBody` pipeline (same routing as plan 218).
- **g/G algorithm:** fixed integer string when `len(str(abs(n))) <= precision` (default 6); otherwise `toPrecision(precision)` with CPython-style mantissa zero-strip and 2-digit exponent normalization.
- **% algorithm:** `(abs(n) * 100).toFixed(precision ?? 6) + "%"`.

---

## Implementation Units

- U1. Extend `parseFloatPresentationSpec` and `formatIntFloatBody` for `g`/`G`/`%` in `src/runtime/builtins/int.ts`
- U2. Tests in `test/cpython-derived/operator-format-evidence.test.ts` and `str-format.test.ts` integration cases
- U3. LIVING-PLAN delta; feature branch `feat/int-format-g-percent-220`; PR

---

## Test Scenarios

- T1. Happy path: `g`, `.3g`, `G`, `%`, `.2%` on 1, 255, 999999, 1000000, 1234567
- T2. Sign: `"+.2g"`, `"-.2%"` on ±1
- T3. Width: `10g`, integration `"{:12g}"` on large int
- T4. Error path: `.2` without type still ValueError

---

## Patterns

Extend plan 218 `parseFloatPresentationSpec` / `formatIntFloatPresentation`; reuse `normalizeExponent` for g exponential branch.
