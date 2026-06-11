---
title: "feat: complex real imag conjugate attributes (plan 903)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN post-902 — complex surface gaps after operator arc
---

# Complex real, imag, and conjugate

## Summary

Expose CPython-compatible `complex.real` and `complex.imag` as `float` values and `complex.conjugate()` as a bound method. Reject assignment to `real`/`imag` with `AttributeError: readonly attribute`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `getAttr(z, "real")` / `"imag"` return `pyFloat` components |
| R2 | `getAttr(z, "conjugate")()` returns `pyComplex` with negated imaginary part |
| R3 | `setAttr(z, "real"|"imag", ...)` → `PyAttributeError` readonly attribute |
| R4 | Other attribute access unchanged via `defaultGetAttr` delegation |
| R5 | Docs: COMPATIBILITY, validation-ladder, LIVING-PLAN |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No `complex` method namespace beyond `conjugate`.
- PEP 3118 out of scope.

## Implementation Units

### U1. Runtime

**File:** `src/runtime/builtins/complex.ts` — `__getattribute__` / `__setattr__` for member access.

### U2. Tests and docs

**Files:** `test/cpython-derived/complex-attributes.test.ts`, doc updates.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
