---
title: "feat: None __format__"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 237 next steps
---

# None __format__

## Summary

Add **`NoneType.__format__`**: empty spec → `"None"`; non-empty spec → **`TypeError`** (CPython parity).

---

## Problem Frame

Bool/bytes format landed in plans 230/234. `pyNone` has repr but no `Hook.format`; explicit hook completes singleton builtin format coverage.

---

## Requirements

- R1. `format(None, '')` → `'None'`
- R2. `format(None, '10')` → `TypeError: unsupported format string passed to NoneType.__format__`
- R3. `'{0}'.format(None)` / `'{0:10}'.format(None)` via str.format integration test
- R4. Extend `operator-format-evidence.test.ts` and `str-format.test.ts`
- R5. LIVING-PLAN delta; validation ladder

---

## Scope Boundaries

- Empty spec only; no width/alignment on None
- PEP 3118 out of scope

---

## Implementation Units

- U1. `formatNoneSpec` + `Hook.format` on `noneType` in `src/runtime/builtins/none.ts`
- U2. Vitest + docs + feature branch + PR

---

## Test Scenarios

- T1. Empty spec returns `"None"`
- T2. Non-empty spec TypeError with NoneType message
- T3. str.format field replacement for None

---

## Patterns

Mirror `bytes.__format__` empty-spec / TypeError split.
