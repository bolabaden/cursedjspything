---
title: "feat: int numeric pipeline roundtrip evidence (plan 913)"
type: feat
status: active
date: 2026-05-24
origin: LIVING-PLAN post-912 — int surface integration (907/911/912)
---

# int numeric pipeline roundtrip

## Summary

Lock end-to-end CPython parity for the safe-integer int pipeline: `to_bytes` → `from_bytes` → `as_integer_ratio` returns `(n, 1)` for round-tripped values, including `MAX_SAFE_INTEGER` via `pyIntFromSafeInteger` storage.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `n.to_bytes(...)` then `int.from_bytes(...)` recovers `n` for representative values |
| R2 | Recovered int `.as_integer_ratio()` → `(n, 1)` |
| R3 | `MAX_SAFE_INTEGER` roundtrip via 8-byte little-endian unsigned encoding |
| R4 | Docs: COMPATIBILITY, validation-ladder, LIVING-PLAN |
| R5 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No runtime changes unless tests expose regressions.
- `pyInt` int32 truncation limits unchanged; large values use `pyIntFromSafeInteger`.
- PEP 3118 out of scope.

## Implementation Units

### U1. Tests and docs

**Files:** `test/cpython-derived/int-numeric-roundtrip.test.ts`, doc updates.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
