---
title: "feat: slice __format__"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 245 next steps
---

# slice __format__

## Summary

Add explicit **`slice.__format__`**: empty spec → slice repr; non-empty spec → **`TypeError`** (CPython parity).

---

## Problem Frame

Mapping/sequence format hooks landed through plan 244. `slice` still uses `format()` generic fallback; explicit hook completes the format-evidence fallback target type.

---

## Requirements

- R1. `format(slice(1, 2), '')` → `'slice(1, 2, None)'`
- R2. `format(slice(None, None, None), '')` → `'slice(None, None, None)'`
- R3. `format(slice(1, 2), 's')` → `TypeError: unsupported format string passed to slice.__format__`
- R4. Extend `operator-format-evidence.test.ts`; add str.format slice field test
- R5. LIVING-PLAN delta; validation ladder

---

## Scope Boundaries

- Empty spec only (repr); no width/alignment
- set explicit hook deferred
- PEP 3118 out of scope

---

## Implementation Units

- U1. `sliceRepr` + `formatSliceSpec` + `Hook.format` in `src/runtime/collections/slice.ts`
- U2. Vitest + docs + feature branch + PR

---

## Test Scenarios

- T1. Empty spec returns repr for populated and all-None slice
- T2. Non-empty spec TypeError with slice message
- T3. str.format `{0}` / `{0:10}` with `pySlice`
- T4. Fallback tests use type without `__format__` (set)

---

## Patterns

Mirror `tuple.ts` empty-spec / TypeError split; reuse extracted `sliceRepr` for `Slot.repr`.
