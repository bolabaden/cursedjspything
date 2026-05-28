---
title: "feat: str format !a ascii conversion"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 227 next steps
---

# str format !a ascii conversion

## Summary

Add **`!a` conversion** in `str.format` / `format_map` via a shared **`ascii()`** helper (repr + non-ASCII escaping), completing the PEP 3101 conversion flag set deferred from plan 204.

---

## Problem Frame

Nested `format_spec` landed in plan 226/227. Plan 204 explicitly scoped out `!a`. LIVING-PLAN lists further format parity when prioritized; this is the next incremental format slice.

---

## Requirements

- R1. `'{0!a}'.format('café')` → `"'caf\\xe9'"` (CPython-style `\x` for U+0080–U+00FF, `\u`/`\U` otherwise)
- R2. `'{0!a}'.format(42)` → `'42'` (repr already ASCII)
- R3. Unknown conversion still `ValueError`; `!a` accepted in parser
- R4. Extend `test/cpython-derived/str-format.test.ts`
- R5. `ascii()` exported from `numeric.ts` for reuse; LIVING-PLAN delta; validation ladder

---

## Scope Boundaries

- No `format_spec` after conversion beyond existing `!r`/`!s` behavior (no change to conversion+spec interaction)
- No new `ascii` builtin on module exports unless already wired — helper is internal + used by str.format
- PEP 3118 out of scope

---

## Implementation Units

- U1. `escapeNonAsciiRepr(reprStr)` + `ascii(obj)` in `src/runtime/dispatch/operators/numeric.ts`
- U2. `ConversionFlag` + parser + `renderFieldValue` in `src/runtime/builtins/str-format.ts`
- U3. Vitest + LIVING-PLAN + COMPATIBILITY evidence line if applicable

---

## Test Scenarios

- T1. `!a` on str with non-ASCII (latin-1 byte and BMP code point)
- T2. `!a` on int/list where repr is ASCII
- T3. `!x` still unknown conversion ValueError

---

## Patterns

Mirror `!r`/`!s` in `renderFieldValue`; CPython `PyASCII_Object` escape rules for post-repr walk.
