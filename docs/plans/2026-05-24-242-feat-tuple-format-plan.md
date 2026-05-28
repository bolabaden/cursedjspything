---
title: "feat: tuple __format__"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 241 next steps
---

# tuple __format__

## Summary

Add explicit **`tuple.__format__`**: empty spec → tuple repr; non-empty spec → **`TypeError`** (CPython parity).

---

## Problem Frame

`list.__format__` landed in plan 240. `tuple` still uses `format()` generic fallback; explicit hook completes immutable-sequence format coverage.

---

## Requirements

- R1. `format((), '')` → `'()'`
- R2. `format((1,), '')` → `'(1,)'` (singleton trailing comma)
- R3. `format((1, 2), '')` → `'(1, 2)'`
- R4. `format((), 's')` → `TypeError: unsupported format string passed to tuple.__format__`
- R5. Extend `operator-format-evidence.test.ts`; add str.format tuple field test
- R6. LIVING-PLAN delta; validation ladder

---

## Scope Boundaries

- Empty spec only (repr); no width/alignment
- dict/set `__format__` deferred
- PEP 3118 out of scope

---

## Implementation Units

- U1. `tupleRepr` + `formatTupleSpec` + `Hook.format` in `src/runtime/builtins/tuple.ts`
- U2. Vitest + docs + feature branch + PR

---

## Test Scenarios

- T1. Empty, singleton, and multi-item repr via empty spec
- T2. Non-empty spec TypeError with tuple message
- T3. str.format `{0}` / `{0:10}` with `pyTuple`
- T4. Fallback tests use type without `__format__` (dict)

---

## Patterns

Mirror `list.ts` empty-spec / TypeError split; preserve singleton `(x,)` repr rule.
