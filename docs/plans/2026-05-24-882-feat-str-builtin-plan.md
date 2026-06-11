---
title: "feat: str builtin constructor (plan 882)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN str/bytes/int API niche gaps after plan 881
---

# `str` builtin constructor

## Summary

Add CPython-compatible builtin `str()` / `str(obj)` returning `pyStr`. Protocol helper `str(obj) -> string` remains exported as `strProtocol` on the stable barrel.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `str()` → empty `pyStr` |
| R2 | `str(obj)` → `pyStr` via `__str__` / `repr` fallback |
| R3 | `str(x, y)` (encoding form) → `TypeError: str() argument 'encoding' must be str, not {type}` |
| R4 | Rename stable protocol export to `strProtocol`; export builtin `str` from builtins |
| R5 | `str-builtin.test.ts`; update compatibility + living-plan + validation-ladder |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `str(bytes, encoding)` decode form deferred.
- PEP 3118 out of scope.

## Implementation Units

### U1. `str` constructor

**Files:** `src/runtime/builtins/str-constructor.ts`, `src/runtime/builtins/index.ts`, `src/barrel/stable.ts`

### U2. Tests and docs

**Files:** `test/cpython-derived/str-builtin.test.ts`, `test/dispatch/operators.test.ts`, `examples/python-vs-js.ts`, docs

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
