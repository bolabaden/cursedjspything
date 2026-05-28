---
title: "feat: str format attribute fields"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 205 next steps
---

# str format attribute fields

## Summary

Extend **`str.format` / `str.format_map`** field names with dot-attribute access (`{0.year}`, `{foo._x}`).

---

## Problem Frame

Plan 205 landed basic format. LIVING-PLAN next step is attribute field grammar before bracket/index or kwargs bridging.

---

## Requirements

- R1. `'{0.year}'.format(obj)` resolves positional root then attribute via `getAttr`
- R2. `'{foo._x}'.format_map({'foo': obj})` resolves mapping root then attribute chain
- R3. Multi-segment chains (`{a.b.c}`) when each step is a `PyObject`
- R4. Invalid field names (`0.`, `.x`) → `ValueError`
- R5. Extend `test/cpython-derived/str-format.test.ts`
- R6. validation-ladder + LIVING-PLAN delta; full validation ladder

---

## Scope Boundaries

- No bracket/index fields (`{0[name]}`) in this slice
- No `**kwargs` on `.format()` at JS call boundary

---

## Implementation Units

- U1. Parse dot-separated field names; `applyFormatAttributes` via `getAttr`
- U2. Wire into positional/mapping resolution in `str-format.ts`
- U3. Tests + docs + feature branch + PR

---

## Test Scenarios

- T1. Positional `{0.attr}` on instance with dict-stored attribute
- T2. format_map `{foo._x}` from CPython test_format_map sample
- T3. Invalid dotted field name raises ValueError

---

## Patterns

Use `getAttr` from `lookup.ts`; test objects via `makeClass` + `instantiate`.
