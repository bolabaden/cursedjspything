---
title: "feat: str repetition accepts bool operands"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Str repetition bool parity

## Summary

Allow `str.__mul__` / `__rmul__` to accept `bool` operands (as 0/1 repeat counts) now that `boolType` subclasses `intType`, matching CPython `"a" * True`.

---

## Problem Frame

Plan 026 wired bool as int subclass for isinstance, but `str.ts` still guards `__mul__` with `other.type === intType` only, so `"a" * True` raises TypeError instead of repeating.

---

## Requirements

- R1. `str` `__mul__` and `__rmul__` accept `boolType` with 0/1 repeat semantics
- R2. Vitest cases in `operator-str-scalar.test.ts` for `True`/`False` repetition
- R3. `npm run check`, `npm test`, `npm run golden:keys`
- R4. LIVING-PLAN delta

---

## Scope Boundaries

- `str.ts` + test only
- No golden keys

---

## Implementation Units

- U1. str mul/rmul bool guard
- U2. Vitest + LIVING-PLAN

---

## Test Scenarios

- T1. `mul(pyStr("ab"), pyTrue)` → `"ab"`
- T2. `mul(pyStr("ab"), pyFalse)` → `""`
- T3. `mul(pyTrue, pyStr("x"))` via rmul path if applicable — actually `"ab" * True` is mul on str

---

## Sources & References

- CPython: bool subclasses int; sequence repetition uses `PyIndex_Check`
