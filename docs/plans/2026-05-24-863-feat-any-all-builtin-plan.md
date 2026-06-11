---
title: "feat: any/all builtins (plan 863)"
type: feat
status: completed
date: 2026-05-24
origin: plan 862 min/max landed; any/all missing from protocols
---

# builtin `any` / `all`

## Summary

pyrt has `min`/`max`/`sorted` (plans 859–862) but no `any`/`all` builtins. Add CPython-parity helpers: accept exactly one iterable, short-circuit via `iter`/`next` and `bool()` truthiness; return `pyTrue`/`pyFalse`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `any(iterable)` — return `pyTrue` if any element is truthy; else `pyFalse` |
| R2 | `all(iterable)` — return `pyFalse` if any element is falsy; else `pyTrue` |
| R3 | Zero args → `TypeError: any()/all() expected at least 1 argument, got 0` |
| R4 | Multiple args → `TypeError: any()/all() takes exactly one argument (N given)` |
| R5 | Empty iterable: `any([])` → `pyFalse`, `all([])` → `pyTrue` (vacuous truth) |
| R6 | Non-iterable → `TypeError` from `iter()`; bad `__bool__` propagates |
| R7 | Export from `barrel/stable.ts`; `any-all-builtin.test.ts` + docs |
| R8 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Generator/iterator objects only via standard `iter`/`next` (no special cases).
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
