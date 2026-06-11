---
title: "feat: int to_bytes and from_bytes (plan 907)"
type: feat
status: active
date: 2026-05-24
origin: LIVING-PLAN post-906 — Tier-1 numeric surface (int byte encoding)
---

# int to_bytes and from_bytes

## Summary

Add CPython-compatible `int.to_bytes(length, byteorder, signed=False)` and class method `int.from_bytes(bytes, byteorder, signed=False)` with big/little endian two's-complement encoding within JS safe-integer storage limits.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `to_bytes` returns `bytes`; `from_bytes` returns `int` |
| R2 | `byteorder` must be `str` `'big'` or `'little'`; else `ValueError` |
| R3 | Unsigned rejects negative values with `OverflowError: can't convert negative int to unsigned` |
| R4 | Values that do not fit `length` bytes raise `OverflowError: int too big to convert` |
| R5 | Signed round-trip for representative values (`255`, `256`, `-1`, `-1024`, `0`) |
| R6 | `from_bytes` accepts `bytes`; wrong arg types raise `TypeError` |
| R7 | Docs: COMPATIBILITY, validation-ladder, LIVING-PLAN |
| R8 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Safe-integer storage only; `from_bytes` results use `pyIntFromSafeInteger` when outside int32.
- No `byteorder` beyond `'big'`/`'little'`; no `signed` keyword-only enforcement beyond positional optional fourth arg.
- No `float.hex` in this slice.
- PEP 3118 out of scope.

## Implementation Units

### U1. Runtime

**File:** `src/runtime/builtins/int.ts` — `intToBytes`, `intFromBytes`, register `to_bytes` and `from_bytes` on `intType.typeDict`.

### U2. Tests and docs

**Files:** `test/cpython-derived/int-bytes-conversion.test.ts`, doc updates.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
