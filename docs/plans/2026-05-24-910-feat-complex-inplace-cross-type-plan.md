---
title: "feat: complex inplace cross-type evidence (plan 910)"
type: feat
status: active
date: 2026-05-24
origin: LIVING-PLAN post-909 — cross-type inplace rejects involving complex
---

# Complex inplace cross-type evidence

## Summary

Lock CPython-style `TypeError` evidence for inplace operators involving **complex** and **str** / **list** / **bytes**, mirroring the binary cross-type arc (plan 904). Include scalar `//=` / `%=` with complex RHS unsupported operands.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `complex` inplace `+=` `-=` `*=` `/=` `**=` `@=` with str/list/bytes → generic unsupported-operand `TypeError` |
| R2 | `complex` inplace `//=` `%=` with str/list/bytes → floor message when complex is left operand |
| R3 | str/list/bytes inplace with `complex` RHS → generic unsupported-operand `TypeError` (both orders for `+=`) |
| R4 | int/float `//=` and `%=` with complex → generic unsupported-operand `TypeError` |
| R5 | Docs: COMPATIBILITY, validation-ladder, LIVING-PLAN |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No runtime changes unless tests expose regressions.
- Complex-left `//=`/`%=` with int/float retain existing floor message (pyrt arc 894–904).
- PEP 3118 out of scope.

## Implementation Units

### U1. Tests and docs

**Files:** `test/cpython-derived/operator-complex-inplace-cross-type.test.ts`, doc updates.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
