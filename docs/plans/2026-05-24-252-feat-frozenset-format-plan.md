---
title: "feat: frozenset builtin with __format__"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 251 next steps
---

# frozenset builtin + __format__

## Summary

Add minimal **`frozenset`** builtin with repr and explicit **`frozenset.__format__`**: empty spec → frozenset repr; non-empty spec → **`TypeError`** (CPython parity).

---

## Problem Frame

Format stack covers set but not frozenset; LIVING-PLAN lists frozenset as next format gap. pyrt has no frozenset type — this slice adds the type with format-first surface (repr, len, eq) mirroring set.

---

## Requirements

- R1. `format(frozenset(), '')` → `'frozenset()'`
- R2. `format(frozenset({1}), '')` → `'frozenset({1})'`
- R3. `format(frozenset(), 's')` → `TypeError: unsupported format string passed to frozenset.__format__`
- R4. Extend `operator-format-evidence.test.ts`; add str.format frozenset field test
- R5. Export `pyFrozenSet` / `frozensetType`; LIVING-PLAN delta

---

## Scope Boundaries

- Minimal frozenset (repr, format, len, bool, eq) — no set algebra, no hash, no set↔frozenset ops
- PEP 3118 out of scope

---

## Implementation Units

- U1. `frozensetRepr` + `formatFrozenSetSpec` + `Hook.format` in `src/runtime/builtins/frozenset.ts`
- U2. Export from `builtins/index.ts` and `barrel/stable.ts`
- U3. Vitest + LIVING-PLAN; feature branch + PR

---

## Test Scenarios

- T1. Empty and populated frozenset repr via empty spec
- T2. Non-empty spec TypeError with frozenset message
- T3. str.format `{0}` / `{0:10}` with `pyFrozenSet`
- T4. Fallback tests remain on repr-only custom class

---

## Patterns

Mirror `set.ts` empty-spec / TypeError split; CPython repr uses `frozenset({...})` for non-empty sets.
