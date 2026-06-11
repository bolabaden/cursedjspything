---
title: "feat: int builtin constructor (plan 885)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN str/bytes/int API niche gaps after plan 884
---

# `int` builtin constructor

## Summary

Add CPython-compatible builtin `int()` / `int(x)` / `int(str|bytes, base)`. Protocol helper `toInt(obj)` remains exported as `intProtocol` on the stable barrel (mirror plans 882/884).

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `int()` → `pyInt(0)` |
| R2 | `int(number)` → `pyInt` via `__int__` (`intProtocol`) for int/float/bool |
| R3 | `int(str)` → base-10 parse with whitespace strip and `_` separators |
| R4 | `int(bytes)` → ASCII digit parse (base 10) |
| R5 | `int(str\|bytes, base)` → explicit base 0/2–36; base 0 auto-detects `0x`/`0o`/`0b` |
| R6 | Non-str/bytes with explicit base → `TypeError: int() can't convert non-string with explicit base` |
| R7 | Invalid base → `ValueError: int() base must be >= 2 and <= 36, or 0` |
| R8 | Bad base type → `'{type}' object cannot be interpreted as an integer` |
| R9 | Invalid literal → `ValueError: invalid literal for int() with base N: '...'` |
| R10 | `>2` args → `TypeError: int expected at most 2 arguments, got N` |
| R11 | Rename stable protocol export to `intProtocol`; export builtin `int` from builtins |
| R12 | `int-builtin.test.ts`; migrate protocol tests; update docs |
| R13 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Arbitrary-precision int parsing beyond JS safe integer range is best-effort (`| 0` truncation via `pyInt`).
- PEP 3118 out of scope.

## Implementation Units

### U1. `int` constructor + literal parser

**Files:** `src/runtime/builtins/int-constructor.ts`, `src/runtime/builtins/index.ts`, `src/barrel/stable.ts`

### U2. Tests and docs

**Files:** `test/cpython-derived/int-builtin.test.ts`, `test/cpython-derived/operator-numeric-conversion-evidence.test.ts`, `test/dispatch/operators.test.ts`, `examples/python-vs-js.ts`, compatibility + living-plan + validation-ladder

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
