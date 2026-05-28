---
title: "feat: str format conversion with format_spec"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 231 next steps
---

# str format conversion with format_spec

## Summary

When **`!r` / `!s` / `!a`** is combined with a **format_spec**, apply conversion first then **`str.__format__`** on the resulting string (CPython parity).

---

## Problem Frame

Conversion flags and nested specs are on `main`. `renderFieldValue` currently ignores `format_spec` when a conversion is set; CPython pads/aligns the converted string.

---

## Requirements

- R1. `'{0!r:10}'.format([])` → `'[]        '`
- R2. `'{0!s:10}'.format('hi')` → `'hi        '`; `'{0!a:10}'.format('café')` → `"'caf\\xe9' "`
- R3. `'{0!r:>10}'` / `'{0!r:<10}'` honor alignment on converted string
- R4. Extend `test/cpython-derived/str-format.test.ts`
- R5. LIVING-PLAN delta; validation ladder

---

## Scope Boundaries

- No change to conversion-only or spec-only paths beyond wiring
- PEP 3118 out of scope

---

## Implementation Units

- U1. `renderFieldValue` in `src/runtime/builtins/str-format.ts` — wrap converted text with `pyStr` + `format()` when spec non-empty
- U2. Vitest + docs + feature branch + PR

---

## Test Scenarios

- T1. `!r:10` width padding on list repr
- T2. `!s:10` and `!a:10` on str
- T3. `!r:>10` / `!r:<10` alignment

---

## Patterns

CPython applies string formatting to post-conversion text; reuse `format(pyStr(s), spec)`.
