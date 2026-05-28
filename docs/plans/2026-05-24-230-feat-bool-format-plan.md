---
title: "feat: bool __format__"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 229 next steps
---

# bool __format__

## Summary

Add **`bool.__format__`**: empty spec → `"True"` / `"False"`; non-empty specs delegate to int formatting on `1` / `0` (CPython parity).

---

## Problem Frame

Int/str/float format stacks and str.format conversions are on `main`. `bool` inherits `int` in pyrt but has no `Hook.format`; LIVING-PLAN lists `bool.__format__` as next format slice.

---

## Requirements

- R1. `format(True, '')` → `'True'`; `format(False, '')` → `'False'`
- R2. `format(True, 'd')` → `'1'`; `format(False, '+04d')` → `'+0'`; `format(True, '.2f')` → `'1.00'`
- R3. Invalid specs reuse int `ValueError` messages (CPython reports `'int'` when bool delegates)
- R4. Extend `test/cpython-derived/operator-format-evidence.test.ts`
- R5. Export `formatIntSpec` from `int.ts` for bool delegation; LIVING-PLAN delta; validation ladder

---

## Scope Boundaries

- No changes to int/str/float format parsers
- PEP 3118 out of scope

---

## Implementation Units

- U1. Export `formatIntSpec` from `src/runtime/builtins/int.ts`
- U2. `Hook.format` on `boolType` in `src/runtime/builtins/bool.ts`
- U3. Vitest + docs + feature branch + PR

---

## Test Scenarios

- T1. Empty spec True/False strings
- T2. Decimal/hex/float presentation via int delegation
- T3. Invalid spec ValueError (e.g. `'s'`, `'.2'` without float type)

---

## Patterns

Reuse `formatIntSpec`; mirror CPython boolobject `bool_format` empty-spec branch.
