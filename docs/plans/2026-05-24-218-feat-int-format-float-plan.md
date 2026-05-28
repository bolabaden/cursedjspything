---
title: "feat: int format float presentation (f/e)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 217 partial
---

# int format float presentation (f/e)

## Summary

Extend **`int.__format__`** with CPython float presentation codes **`f`** / **`e`** (and precision/width variants), delegating int values through float-style formatting.

---

## Problem Frame

Plans 214–216 landed int width/sign; LIVING-PLAN partial deferred float-style `f` on int.

---

## Requirements

- R1. `format(pyInt(1), "f")` → `"1.000000"`
- R2. `format(pyInt(1), ".2f")` → `"1.00"`
- R3. `format(pyInt(1), "10f")` → space-padded width 10
- R4. `format(pyInt(255), ".2e")` → `"2.55e+02"`
- R5. Sign + float spec e.g. `"+.2f"` on positive/negative
- R6. Integer-only specs still reject stray precision (`.2` without type)
- R7. Tests + LIVING-PLAN delta; full validation ladder

---

## Scope Boundaries

- `g`/`G`/`%` deferred; PEP 3118 out of scope

---

## Implementation Units

- U1. `parseFloatPresentationSpec` + `formatIntFloatPresentation` in `int.ts`
- U2. Route before integer precision rejection in `formatIntSpec`
- U3. Tests + feature branch + PR

---

## Test Scenarios

- T1. `f`, `.2f`, `10f`
- T2. `.2e` on 255
- T3. `+.2f` sign; `.2` without type still ValueError

---

## Patterns

Extend plan 216 sign parsing; format before integer `.` rejection.
