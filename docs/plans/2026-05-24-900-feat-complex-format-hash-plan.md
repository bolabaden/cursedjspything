---
title: "feat: complex __format__ and unhashable evidence (plan 900)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN post-899 — next non-complex-adjacent complex surface gaps
---

# Complex format and hash evidence

## Summary

Add `Hook.format` on `complex` (empty spec → repr/str form; non-empty → `TypeError`) and document unhashable `hash()` rejection. Extend `operator-format-evidence.test.ts` and add focused hash test.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `format(complex, "")` → same text as `repr(complex)` |
| R2 | `format(complex, non-empty)` → `PyTypeError` unsupported format string |
| R3 | `hash(complex)` → `PyTypeError` unhashable type |
| R4 | Docs: COMPATIBILITY, validation-ladder, LIVING-PLAN |
| R5 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No float-style presentation specs on complex.
- PEP 3118 out of scope.

## Implementation Units

### U1. Runtime

**File:** `src/runtime/builtins/complex.ts` — `formatComplexSpec`, `Hook.format`.

### U2. Tests and docs

**Files:** `test/cpython-derived/operator-format-evidence.test.ts`, `test/cpython-derived/complex-hash.test.ts`, docs updates.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
