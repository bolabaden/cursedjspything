---
title: "feat: bool inplace complex //=/%= evidence (plan 914)"
type: feat
status: active
date: 2026-05-24
origin: LIVING-PLAN post-913 — extend complex inplace arc for bool subclass
---

# Bool inplace complex evidence

## Summary

Extend plan 910 complex inplace cross-type coverage to **bool**: scalar `//=` / `%=` with complex RHS, and complex-left `//=` / `%=` with bool operand, matching CPython `TypeError` messages.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `bool` `//=` and `%=` with complex RHS → generic unsupported-operand `TypeError` |
| R2 | `complex` `//=` and `%=` with bool RHS → floor message when complex is left operand |
| R3 | Docs: COMPATIBILITY, validation-ladder, LIVING-PLAN |
| R4 | `npm run check && npm test && npm run golden:keys` |

Bool inplace `+=` etc. with complex deferred — pyrt may route bool through int/complex numeric paths; out of scope unless a dedicated parity audit lands.

## Scope Boundaries

- Tests-only unless regressions found.
- No arbitrary-size `float.as_integer_ratio` changes (separate slice).
- PEP 3118 out of scope.

## Implementation Units

### U1. Tests and docs

**Files:** `test/cpython-derived/operator-complex-inplace-cross-type.test.ts`, doc updates.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
