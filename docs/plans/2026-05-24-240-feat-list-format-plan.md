---
title: "feat: list __format__"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 239 next steps
---

# list __format__

## Summary

Add explicit **`list.__format__`**: empty spec → list repr; non-empty spec → **`TypeError`** (CPython parity).

---

## Problem Frame

Singleton/scalar builtins have explicit `Hook.format`. `list` currently relies on `format()` fallback (`str()` for empty spec); wiring explicit hook completes sequence format coverage and matches error semantics.

---

## Requirements

- R1. `format([], '')` → `'[]'`
- R2. `format([1, 2], '')` → `'[1, 2]'` (via repr)
- R3. `format([], 's')` → `TypeError: unsupported format string passed to list.__format__`
- R4. Extend `operator-format-evidence.test.ts`; add str.format list field test
- R5. LIVING-PLAN delta; validation ladder

---

## Scope Boundaries

- Empty spec only (repr); no width/alignment on list
- tuple/dict `__format__` deferred
- PEP 3118 out of scope

---

## Implementation Units

- U1. `listRepr` + `formatListSpec` + `Hook.format` in `src/runtime/builtins/list.ts`
- U2. Vitest + docs + feature branch + PR

---

## Test Scenarios

- T1. Empty spec returns repr for empty and populated lists
- T2. Non-empty spec TypeError with list message
- T3. str.format `{0}` / `{0:10}` with `pyList`
- T4. Fallback test uses type without `__format__` (tuple)

---

## Patterns

Mirror `none.ts` / `bytes.ts` empty-spec / TypeError split; reuse extracted `listRepr` for `Slot.repr`.
