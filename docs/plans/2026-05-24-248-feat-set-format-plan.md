---
title: "feat: set __format__"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 247 next steps
---

# set __format__

## Summary

Add explicit **`set.__format__`**: empty spec → set repr; non-empty spec → **`TypeError`** (CPython parity).

---

## Problem Frame

`slice.__format__` landed in plan 246. `set` still uses `format()` generic fallback; explicit hook completes the set-format evidence target.

---

## Requirements

- R1. `format(set(), '')` → `'set()'`
- R2. `format({1}, '')` → repr with items (order may follow insertion in pyrt)
- R3. `format(set(), 's')` → `TypeError: unsupported format string passed to set.__format__`
- R4. Extend `operator-format-evidence.test.ts`; add str.format set field test
- R5. LIVING-PLAN delta; validation ladder

---

## Scope Boundaries

- Empty spec only (repr); no width/alignment
- frozenset explicit hook deferred
- PEP 3118 out of scope

---

## Implementation Units

- U1. `setRepr` + `formatSetSpec` + `Hook.format` in `src/runtime/builtins/set.ts`
- U2. Vitest + docs + feature branch + PR

---

## Test Scenarios

- T1. Empty and populated set repr via empty spec
- T2. Non-empty spec TypeError with set message
- T3. str.format `{0}` / `{0:10}` with `pySet`
- T4. Fallback tests use repr-only custom class without `__format__`

---

## Patterns

Mirror `slice.ts` empty-spec / TypeError split; reuse extracted `setRepr` for `Slot.repr`.
