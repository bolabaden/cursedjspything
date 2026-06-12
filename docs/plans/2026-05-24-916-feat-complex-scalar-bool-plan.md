---
title: "feat: complex scalar bool arithmetic evidence (plan 916)"
type: feat
status: active
date: 2026-05-24
origin: LIVING-PLAN post-915 — bool subclass complex scalar arc (extends plan 897/904)
---

# Complex scalar bool arithmetic evidence

## Summary

Lock CPython parity for **complex** arithmetic with **bool** operands (`+`, `-`, `*`), mirroring existing int/float scalar coverage in `operator-complex-scalar.test.ts`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `complex + bool` and `bool + complex` promote bool as int subclass |
| R2 | `complex - bool` and `bool - complex` |
| R3 | `complex * bool` and `bool * complex` |
| R4 | Docs: COMPATIBILITY, validation-ladder, LIVING-PLAN |
| R5 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Tests-only unless regressions found.
- Inplace bool/complex `+=` divergence remains out of scope (plan 914 note).
- PEP 3118 out of scope.

## Implementation Units

### U1. Tests and docs

**Files:** `test/cpython-derived/operator-complex-scalar.test.ts`, doc updates.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
