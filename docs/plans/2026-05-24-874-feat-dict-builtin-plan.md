---
title: "feat: dict builtin (plan 874)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN next slice after plan 873 zip strict
---

# builtin `dict`

## Summary

pyrt exposes `pyDict` and rich `dict` methods (`update`, `copy`, `fromkeys`) but no CPython-style `dict()` builtin. Add `dict()` → empty dict, `dict(mapping)` → shallow copy when the argument is a `dict`, and `dict(iterable)` → new dict built from an iterable of key/value pairs, reusing existing `dictUpdateFrom` / `dictApplyPair` semantics.

## Problem Frame

Embedder tests and parity work expect constructor builtins alongside `list`/`tuple`/`set`/`frozenset`. `dict()` is the next deferred constructor named in LIVING-PLAN.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `dict()` — return empty `pyDict` |
| R2 | `dict(mapping)` — when argument `type === dictType`, return independent shallow copy (same semantics as `.copy()`) |
| R3 | `dict(iterable)` — build new dict from iterable of length-2 list/tuple pairs via existing pair validation |
| R4 | 2+ positional args → `TypeError: dict expected at most 1 argument, got N` |
| R5 | Non-`PyObject` arg → `TypeError` with embedder kind message |
| R6 | Non-iterable / invalid pairs propagate existing `dictUpdateFrom` errors (aligned with `update`) |
| R7 | Unhashable keys propagate via `dictSet` |
| R8 | Export `dict` from `barrel/stable.ts`; add `dict-builtin.test.ts` + doc deltas |
| R9 | `npm run check && npm test && npm run golden:keys` |

## Key Technical Decisions

1. **Reuse `dictUpdateFrom`** — Add `pyDictFromArg` (or equivalent) in `dict.ts` and call it with context `"dict"` for iterable paths; mapping path uses the same shallow-copy path as the `copy` method. Avoid duplicating pair parsing.
2. **No `**kwargs`** — Embedder API remains positional-only; keyword constructor forms deferred.
3. **Export pattern** — Mirror `list`/`set`: implement `dict(...args)` in `protocols.ts`, export from `stable.ts`.

## Scope Boundaries

### Deferred to Follow-Up Work

- `dict(**kwargs)` / mixed `dict(mapping, **kwargs)` keyword forms.
- `range()` builtin (next LIVING-PLAN item).

### Out of scope

- PEP 3118 buffer protocol expansion.

## Implementation Units

### U1. Dict constructor helper

**Goal:** Centralize `dict(arg)` materialization in `dict.ts` without circular-import issues.

**Requirements:** R2, R3, R6

**Files:** `src/runtime/builtins/dict.ts`

**Approach:** Export `pyDictFromArg(arg: PyObject): PyObject`. If `arg.type === dictType`, shallow-copy via `mergeDictMaps`. Else start `pyDict([])` and `dictUpdateFrom(arg, map, "dict")`.

**Test scenarios:**

- Covers R2. `dict(existing)` returns equal but distinct object; mutating source does not alias copy.
- Covers R3. `dict(pyList([pyTuple([k,v])]))` builds expected mapping.
- Covers R6. `dict(pyInt(1))` raises `TypeError`; `dict(pyList([pyTuple([pyInt(1)])]))` raises `ValueError` (length 1).
- Covers R6. `dict(pyList([pyInt(1)]))` raises `TypeError` (not a sequence) — matches `update` path.

**Verification:** Helper callable from protocols without import cycles.

### U2. Builtin `dict()` dispatch + export

**Goal:** Wire embedder-facing `dict()` builtin.

**Requirements:** R1, R4, R5, R7, R8

**Dependencies:** U1

**Files:** `src/runtime/dispatch/protocols.ts`, `src/barrel/stable.ts`

**Approach:** Add `export function dict(...args: unknown[]): PyObject` with arity checks matching `sequenceConstructor` style. Import `pyDict`, `pyDictFromArg` from `dict.ts`.

**Test scenarios:**

- Covers R1. `dict()` empty, `len` 0, `dictType`.
- Covers R4. `dict(a, b)` → at most 1 argument error.
- Covers R5. non-`PyObject` arg type error.
- Covers R7. `dict(pyList([pyList([]), pyInt(1)]))` → unhashable key error.

**Verification:** `dict` exported from package entry like `list`/`set`.

### U3. Tests and documentation

**Goal:** CPython-derived evidence and living-plan sync.

**Requirements:** R8, R9

**Dependencies:** U2

**Files:** `test/cpython-derived/dict-builtin.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/LIVING-PLAN.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

**Test scenarios:**

- Happy: empty, from dict copy, from pair iterable, dedupe equal keys in iterable.
- Errors: too many args, non-iterable, bad pair shapes, unhashable keys.

**Verification:** Full validation ladder commands pass.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
