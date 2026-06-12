---
title: "feat: complex scalar bool truediv evidence (plan 918)"
type: feat
status: active
date: 2026-05-24
origin: LIVING-PLAN post-917 — complete bool complex scalar arc (plan 916 add/sub/mul)
---

# Complex scalar bool truediv evidence

## Summary

Lock CPython parity for **complex** true division with **bool** operands, complementing plan 916 `+`/`-`/`*` coverage in `operator-complex-div-unary.test.ts`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `complex / bool` promotes bool as int subclass |
| R2 | `bool / complex` yields correct rationalized result |
| R3 | Docs: COMPATIBILITY, validation-ladder, LIVING-PLAN |
| R4 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Tests-only unless regressions found.
- Inplace bool/complex `/=` covered by existing complex inplace arc.
- PEP 3118 out of scope.

## Implementation Units

### U1. Tests and docs

**Files:** `test/cpython-derived/operator-complex-div-unary.test.ts`, doc updates.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
