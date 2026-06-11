---
title: "feat: complex type and builtin constructor (plan 894)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN deferred complex() after protocol renames (891–893)
---

# `complex` type and builtin constructor

## Summary

Add minimal `complex` PyType with `pyComplex(real, imag)`, `__complex__` on int/float/bool, and CPython-compatible builtin `complex()` / `complex(x)` / `complex(x, y)` / `complex(str|bytes)` for common literal forms.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `complex()` → `pyComplex(0, 0)` |
| R2 | `complex(number)` → via `__complex__` / `complexProtocol` for int/float/bool |
| R3 | `complex(real, imag)` two numeric args; str first arg forbids second |
| R4 | `complex(str\|bytes)` parse `1+2j`, `3j`, `1.5-2.5j`, plain real `1` |
| R5 | `complex(complex)` identity; CPython-aligned arity/type errors |
| R6 | Export `complex`, `complexType`, `pyComplex` from stable barrel |
| R7 | `complex-builtin.test.ts`; docs + LIVING-PLAN |
| R8 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No complex arithmetic binary ops (add/mul on complex type) in this slice.
- `inf`/`nan` literal forms deferred.
- PEP 3118 out of scope.

## Implementation Units

### U1. Type + constructor

**Files:** `src/runtime/builtins/complex.ts`, `src/runtime/builtins/complex-constructor.ts`, `src/runtime/builtins/int.ts`, `src/runtime/builtins/float.ts`, `src/runtime/builtins/bool.ts`, `src/runtime/builtins/index.ts`, `src/barrel/stable.ts`

### U2. Tests and docs

**Files:** `test/cpython-derived/complex-builtin.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/LIVING-PLAN.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
