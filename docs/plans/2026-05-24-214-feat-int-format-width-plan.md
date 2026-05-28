---
title: "feat: int format width and ValueError parity"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 213 next steps
---

# int format width and ValueError parity

## Summary

Extend **`int.__format__`** / `format(int, spec)` for CPython width padding (`{:04d}`, `{:4d}`, `{:04x}`) and **`ValueError`** on precision specs and unknown type codes. Surfaces through `str.format` field specs.

---

## Problem Frame

Format string work (plans 204–212) delegates specs to `Hook.format`. Int only handles single-letter bases; `{:04d}` and `{:.2}` diverge from CPython.

---

## Requirements

- R1. `format(pyInt(1), "04")` / `"{:04d}"` → `"0001"`
- R2. `format(pyInt(1), "4")` / `"{:4d}"` → space-padded decimal
- R3. `format(pyInt(255), "04x")` → `"00ff"`
- R4. `format(pyInt(1), ".2")` / `"{:.2}"` → `ValueError` (precision not allowed)
- R5. `format(pyInt(1), "s")` → `ValueError` unknown format code
- R6. Extend `operator-format-evidence.test.ts` and `str-format.test.ts`
- R7. validation-ladder + LIVING-PLAN delta

---

## Scope Boundaries

- No float-style `f` conversion on int; no sign/`+` fill variants in this slice
- PEP 3118 out of scope

---

## Implementation Units

- U1. `formatIntSpec` helper in `int.ts`; wire `Hook.format`
- U2. Tests + docs + feature branch + PR

---

## Test Scenarios

- T1. Zero/space width decimal via `format()` and `str.format`
- T2. Zero-pad hex width
- T3. ValueError on `.2` and unknown `s` code

---

## Patterns

Follow existing `Hook.format` branches in `int.ts`; reuse `PyValueError` messages from CPython.
