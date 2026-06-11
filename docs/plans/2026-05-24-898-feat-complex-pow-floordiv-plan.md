---
title: "feat: complex float pow and floordiv/mod guards (plan 898)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN plan 897 next — non-integer pow and floordiv/mod deferred
---

# Complex float exponentiation and floordiv/mod rejection

## Summary

Extend `complex.__pow__` for non-integer float exponents via polar form (integer exponents keep exact path). Add `__floordiv__` / `__mod__` slots that raise CPython-aligned `PyTypeError` (`can't take floor of complex number.`). Broaden ordering rejection evidence.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `(1+2j)**0.5` via polar `pow`; `(1+2j)**2.0` still exact integer path |
| R2 | `complex // x` and `complex % x` → `PyTypeError` with CPython floor message |
| R3 | `lt`/`le`/`gt`/`ge` complex vs int → `TypeError` |
| R4 | `operator-complex-pow-floordiv.test.ts`; docs |
| R5 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No `complex ** complex`; no `rfloordiv` special cases beyond forward slots.
- PEP 3118 out of scope.

## Implementation Units

### U1. Runtime

**File:** `src/runtime/builtins/complex.ts`

### U2. Tests and docs

**Files:** `test/cpython-derived/operator-complex-pow-floordiv.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/LIVING-PLAN.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
