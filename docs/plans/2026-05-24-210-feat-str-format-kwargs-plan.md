---
title: "feat: str.format kwargs bridging"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 209 next steps
---

# str.format kwargs bridging

## Summary

Extend **`str.format(*args, **kwargs)`** semantics at the JS call boundary: positional/auto fields from variadic args, named identifier fields from a trailing **`FormatKeywordMapping`** wrapper (kwargs dict).

---

## Problem Frame

Plans 204–208 landed format, attributes, and brackets. Named fields still require `format_map` when calling from JS. LIVING-PLAN next is kwargs bridging so `'{name}'.format(..., kwargs)` matches CPython mixed positional + keyword usage.

---

## Requirements

- R1. `'{name}'.format(..., kwargs)` resolves identifier fields from kwargs mapping
- R2. Mixed `'{0} {name}'.format(pos, kwargs=...)` via positional + kwargs wrapper
- R3. Auto-numbered `'{} {name}'.format(a, kwargs=...)` still works
- R4. Missing named key → `KeyError`; positional-only calls unchanged
- R5. `format_map` behavior unchanged; no kwargs on `format_map`
- R6. Extend `test/cpython-derived/str-format.test.ts`
- R7. validation-ladder + LIVING-PLAN delta; full validation ladder

---

## Scope Boundaries

- JS boundary uses explicit `FormatKeywordMapping` wrapper (no plain-object kwargs magic)
- No quoted-string bracket keys; PEP 3118 out of scope

---

## Implementation Units

- U1. `formatStr(..., kwargs?: PyObject)` + combined field resolver
- U2. `FormatKeywordMapping` helper; wire `str.format` slot to peel trailing wrapper
- U3. Tests + docs + feature branch + PR

---

## Test Scenarios

- T1. Named field via kwargs wrapper only
- T2. Mixed positional index + named kwargs
- T3. Auto `{}` plus named kwargs
- T4. `KeyError` when named field missing from kwargs
- T5. Positional-only regression unchanged

---

## Patterns

Reuse `lookupMappingValue` / `resolvePositional`; follow plan 208 step parser.
