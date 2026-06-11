---
title: "feat: list/tuple __getitem__/__setitem__/__delitem__ index parity (plan 850)"
type: feat
status: completed
date: 2026-05-24
origin: plan 849 left list/tuple integer subscripts as JS number only
---

# list/tuple integer/`__index__` subscript parity

## Summary

`list` and `tuple` `__getitem__` (and list `__setitem__`/`__delitem__`) only accept raw JS `number` keys. CPython accepts `int`, `bool`, and objects with `__index__`. Reuse `pyIndexAsInteger` from plan 849 with per-type `resolve*Index` helpers mirroring `str`/`bytes`, extend Vitest, sync §8.15 docs and LIVING-PLAN.

## Problem Frame

- `getItem(pyList([1,2]), pyInt(0))` → `TypeError: list indices must be integers` today.
- `getItem(pyTuple([1,2]), indexObj)` with `__index__` → same.
- List `setItem`/`delItem` share the `typeof key !== "number"` guard.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `resolveListIndex` in `list.ts` using `pyIndexAsInteger`; use in `getitem`/`setitem`/`delitem` |
| R2 | `resolveTupleIndex` in `tuple.ts` using `pyIndexAsInteger`; use in `getitem` |
| R3 | Extend `sequence-index-type.test.ts` with `pyInt`, negative `pyInt`, `__index__`, `bool` cases |
| R4 | Update `docs/COMPATIBILITY_AND_GAPS.md` §8.15 prose + `validation-ladder.md` test count |
| R5 | LIVING-PLAN delta for plan 850 |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Slice bounds on `pySlice` remain numeric/null in native storage (unchanged).
- No new shared abstraction file unless duplication is excessive (mirror str pattern).
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
