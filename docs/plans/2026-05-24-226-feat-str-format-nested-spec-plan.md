---
title: "feat: str format nested format_spec fields"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 225 next steps
---

# str format nested format_spec fields

## Summary

Support **nested replacement fields inside format specs** (`{0:{1}}`, `{0:.{1}f}`) by parsing balanced braces in format_spec and substituting nested fields before calling `__format__`.

---

## Problem Frame

Int/str/float `__format__` stacks are on `main`. `str.format('{0:{1}}', ...)` still fails at parse time; LIVING-PLAN next format parity item.

---

## Requirements

- R1. `'{0:{1}}'.format('hello', 10)` → `'hello     '`
- R2. `'{0:.{1}f}'.format(1.5, 2)` → `'1.50'`
- R3. `format_map('{name:{width}}', mapping)` resolves named nested width
- R4. Auto-numbering continues across outer and nested spec fields
- R5. Tests + LIVING-PLAN delta; validation ladder

---

## Scope Boundaries

- No conversion flags or nested format_spec on inner spec fields (simple names/indices only)
- PEP 3118 out of scope

---

## Implementation Units

- U1. Balanced-brace `format_spec` parsing in `parseField`; `substituteFormatSpec` in `str-format.ts`
- U2. Tests in `str-format.test.ts`
- U3. LIVING-PLAN delta; feature branch + PR

---

## Test Scenarios

- T1. `{0:{1}}` width from second positional
- T2. `{0:.{1}f}` precision from positional int
- T3. `format_map` named nested width

---

## Patterns

PEP 3101 nested format_spec substitution via `str()` of resolved nested values; share auto/manual index state with outer format pass.
