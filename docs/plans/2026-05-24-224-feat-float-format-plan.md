---
title: "feat: float format presentation (f/e/g/%)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 223 next steps
---

# float format presentation (f/e/g/%)

## Summary

Implement **`float.__format__`** with CPython presentation codes **`f`**, **`e`**, **`g`**, **`G`**, **`%`**, plus width, precision, and sign options — mirroring the int float-presentation slice but for true float values.

---

## Problem Frame

Int and str format stacks are on `main`; `float.__format__` still raises `TypeError` for non-empty specs. LIVING-PLAN next format parity item.

---

## Requirements

- R1. `format(pyFloat(1.5), "")` → `"1.5"`; `format(pyFloat(1.5), ".2f")` → `"1.50"`
- R2. Width padding: `format(pyFloat(1.5), "10.2f")` → space-padded
- R3. `e`, `g`, `G`, `%` presentation codes match CPython on sample values
- R4. Sign options: `"+.2f"`, `" d"`, `"-.2f"` on positive/negative floats and `-0.0`
- R5. Special values: `inf`, `-inf`, `nan` format without throwing
- R6. Unknown codes (e.g. `"d"`) → `ValueError`
- R7. Tests + LIVING-PLAN delta; validation ladder

---

## Scope Boundaries

- No `=` align or custom fill+align beyond `0` width prefix (same as int float path)
- PEP 3118 out of scope

---

## Implementation Units

- U1. `formatFloatSpec` + helpers in `src/runtime/builtins/float.ts`; wire `Hook.format`
- U2. Tests in `operator-format-evidence.test.ts` and `str-format.test.ts`
- U3. LIVING-PLAN delta; feature branch + PR

---

## Test Scenarios

- T1. `""`, `.2f`, `10.2f`, `.2e`, `g`, `.2%`
- T2. Sign on ±1.5 and `-0.0`
- T3. `inf` / `nan` with `.2f`
- T4. `"d"` → ValueError

---

## Patterns

Mirror int `parseFloatPresentationSpec` / `formatIntFloatPresentation` in `int.ts`; use float `g` via `toPrecision` without integer fast path.
