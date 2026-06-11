---
title: "feat: PyOverflowError and int non-finite float parity (plan 890)"
type: feat
status: completed
date: 2026-05-24
origin: residual review plan 885; LIVING-PLAN after float builtin (889)
---

# `PyOverflowError` and non-finite float→int parity

## Summary

Add `PyOverflowError` and align `int()` / `__int__` on non-finite floats with CPython: infinity → `OverflowError`, NaN → `ValueError`. Closes documented residuals from plan 885 (`intProtocol` vs `int()` on infinity).

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Add `PyOverflowError` in `src/runtime/core/errors.js` with `name = "OverflowError"` |
| R2 | Re-export `PyOverflowError` from `lookup.ts` / stable barrel like other `Py*` exceptions |
| R3 | `int(pyFloat(inf))` → `PyOverflowError: cannot convert float infinity to integer` |
| R4 | `int(pyFloat(nan))` → `PyValueError: cannot convert float NaN to integer` |
| R5 | `float.__int__` / `intProtocol(pyFloat(inf|nan))` raise the same errors as builtin `int()` |
| R6 | Extend `int-builtin.test.ts` with non-finite float cases |
| R7 | Update `docs/COMPATIBILITY_AND_GAPS.md`, `LIVING-PLAN.md`, validation-ladder if needed |
| R8 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No arbitrary-precision overflow beyond existing `pyInt` limits.
- PEP 3118 out of scope.
- `complex()` builtin deferred (no `complex` type in pyrt).

## Implementation Units

### U1. Exception type + float `__int__` guard

**Files:** `src/runtime/core/errors.ts`, `src/runtime/core/lookup.ts`, `src/runtime/builtins/float.ts`, `src/runtime/builtins/int-constructor.ts`

Shared helper to validate JS number from float `__int__` before truncation.

### U2. Tests and docs

**Files:** `test/cpython-derived/int-builtin.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/LIVING-PLAN.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
