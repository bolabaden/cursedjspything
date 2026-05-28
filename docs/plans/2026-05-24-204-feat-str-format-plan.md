---
title: "feat: str format and format_map"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 203 next steps
---

# str format and format_map

## Summary

Add **`str.format(*args)`** (positional / auto-numbered fields) and **`str.format_map(mapping)`** for named fields, with brace escaping and value rendering via existing `format()` / `str()` / `repr()`.

---

## Problem Frame

Plan 203 landed `str.casefold`. LIVING-PLAN next is `format`. The exported `format()` builtin already dispatches `__format__`; this slice adds PEP 3101-style field replacement on format strings.

---

## Requirements

- R1. `''.format()` / `''.format_map({})` identity; `{{` / `}}` escaping
- R2. `'{0}'.format(x)` and `'{} {}'.format(a, b)` auto-numbering
- R3. `'{name}'.format_map({'name': v})` via dict / `__getitem__` mapping
- R4. `!s` / `!r` conversions; non-empty specs delegate to `format(obj, spec)`
- R5. `ValueError` on malformed braces; `KeyError` on missing mapping keys; `TypeError` when `format_map` lacks mapping
- R6. `test/cpython-derived/str-format.test.ts`
- R7. validation-ladder + LIVING-PLAN delta; `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No attribute/index field names (`{0.name}`, `{a[b]}`) in this slice
- No `**kwargs` on `.format()` at the JS call boundary — named fields via `format_map` only
- No `!a` ascii conversion; no nested format specs beyond passing spec string to `__format__`

---

## Implementation Units

- U1. `str-format.ts` parser + `formatStr` / `formatMapStr` helpers
- U2. Register `format` and `format_map` on `strType`
- U3. Vitest + docs + feature branch + PR

---

## Test Scenarios

- T1. Literals and doubled braces
- T2. Positional `{0}` and auto `{}`
- T3. `format_map` named fields and `KeyError`
- T4. `!r` / int hex spec via `__format__`
- T5. `ValueError` / `TypeError` error paths

---

## Patterns

Use `format()` / `str()` / `repr()` from `numeric.ts`; `dictGet` / `getItem` for mappings.
