---
title: "feat: float hex and fromhex (plan 908)"
type: feat
status: active
date: 2026-05-24
origin: LIVING-PLAN post-907 — Tier-1 float numeric surface
---

# float hex and fromhex

## Summary

Add CPython-compatible `float.hex()` and class method `float.fromhex(string)` for exact IEEE-754 transport strings and hex literal parsing.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `hex()` returns `str`; specials `nan`, `inf`, `-inf`, `±0x0.0p+0` match CPython |
| R2 | Finite normals/subnormals use CPython `0x1.` / `0x0.` mantissa + `p±exp` format |
| R3 | `fromhex` round-trips `hex()` output for representative values |
| R4 | `fromhex` accepts `inf`/`nan` variants and hex literals (`abc`, `0x1p4`, etc.) |
| R5 | Empty/invalid strings → `ValueError: invalid hexadecimal floating-point string` |
| R6 | Non-`str` `fromhex` arg → `TypeError: bad argument type for built-in operation` |
| R7 | Docs: COMPATIBILITY, validation-ladder, LIVING-PLAN |
| R8 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No `float.as_integer_ratio` changes.
- Parser matches CPython permissive `fromhex` for integer-like and `p`-exponent forms.
- PEP 3118 out of scope.

## Implementation Units

### U1. Runtime

**File:** `src/runtime/builtins/float.ts` — `floatToHex`, `floatFromHex`, register on `floatType.typeDict`.

### U2. Tests and docs

**Files:** `test/cpython-derived/float-hex-fromhex.test.ts`, doc updates.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
