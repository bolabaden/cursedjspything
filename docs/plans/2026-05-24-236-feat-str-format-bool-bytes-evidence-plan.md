---
title: "feat: str format bool bytes integration evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 235 next steps
---

# str format bool/bytes integration evidence

## Summary

Add **str.format integration tests** for **`bool`** and **`bytes`** fields now that `__format__` exists on both types — end-to-end evidence beyond `operator-format-evidence.test.ts`.

---

## Problem Frame

Plans 230 and 234 landed `bool.__format__` and `bytes.__format__` via `format()` tests. `str-format.test.ts` still lacks field-replacement cases for these builtins.

---

## Requirements

- R1. `'{0:10}'.format(True)` → `'         1'` (int-delegated width)
- R2. `'{0}'.format(b'hi')` → `"b'hi'"`; `'{0:10}'.format(b'hi')` → `TypeError`
- R3. Extend `test/cpython-derived/str-format.test.ts`
- R4. LIVING-PLAN delta; validation ladder note if needed

---

## Scope Boundaries

- Tests + docs only unless integration reveals a bug
- PEP 3118 out of scope

---

## Implementation Units

- U1. Vitest cases in `str-format.test.ts`
- U2. LIVING-PLAN delta; feature branch + PR

---

## Test Scenarios

- T1. Bool width via str.format field
- T2. Bytes empty spec and non-empty TypeError in str.format

---

## Patterns

Use existing `format()` helper; import `pyTrue`, `pyBytes`, `PyTypeError`.
