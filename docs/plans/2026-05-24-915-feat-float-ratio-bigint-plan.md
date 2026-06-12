---
title: "feat: float as_integer_ratio bigint components (plan 915)"
type: feat
status: active
date: 2026-05-24
origin: LIVING-PLAN post-914 — arbitrary-size int gap for 0.1 ratio denominator
---

# Float as_integer_ratio bigint components

## Summary

Allow `float.as_integer_ratio()` to return int tuple components stored as **bigint** when exact IEEE-754 ratio parts exceed `Number.MAX_SAFE_INTEGER`, unlocking CPython parity for values like `0.1`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `0.1.as_integer_ratio()` → `(3602879701896397, 36028797018963968)` |
| R2 | Existing safe-integer ratios (`2`, `2.5`, `1e10`) unchanged |
| R3 | NaN/Inf errors unchanged |
| R4 | Int `repr`/`str` render bigint-stored values correctly |
| R5 | Docs: COMPATIBILITY, validation-ladder, LIVING-PLAN |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Bigint ints are storage for ratio components only; full arbitrary int arithmetic out of scope.
- PEP 3118 out of scope.

## Implementation Units

### U1. Runtime

**Files:** `src/runtime/builtins/int.ts` (`pyIntFromBigInt`, `intObjectFromBigInt`, repr/str bigint path), `src/runtime/builtins/float.ts` (wire bigint tuple components).

### U2. Tests and docs

**Files:** `test/cpython-derived/float-integer-ratio.test.ts`, doc updates.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
