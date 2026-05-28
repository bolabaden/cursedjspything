---
title: "feat: dict __format__"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 243 next steps
---

# dict __format__

## Summary

Add explicit **`dict.__format__`**: empty spec → dict repr; non-empty spec → **`TypeError`** (CPython parity).

---

## Problem Frame

Sequence/singleton format hooks landed through plan 242. `dict` still uses `format()` generic fallback; explicit hook completes mapping format coverage.

---

## Requirements

- R1. `format({}, '')` → `'{}'`
- R2. `format({'a': 1}, '')` → repr with key/value pairs
- R3. `format({}, 's')` → `TypeError: unsupported format string passed to dict.__format__`
- R4. Extend `operator-format-evidence.test.ts`; add str.format dict field test
- R5. LIVING-PLAN delta; validation ladder

---

## Scope Boundaries

- Empty spec only (repr); no width/alignment
- slice/set explicit hooks deferred
- PEP 3118 out of scope

---

## Implementation Units

- U1. `dictRepr` + `formatDictSpec` + `Hook.format` in `src/runtime/builtins/dict.ts`
- U2. Vitest + docs + feature branch + PR

---

## Test Scenarios

- T1. Empty and populated dict repr via empty spec
- T2. Non-empty spec TypeError with dict message
- T3. str.format `{0}` / `{0:10}` with `pyDict`
- T4. Fallback tests use type without `__format__` (slice)

---

## Patterns

Mirror `tuple.ts` empty-spec / TypeError split; reuse extracted `dictRepr` for `Slot.repr`.
