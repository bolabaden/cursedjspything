---
title: "feat: bin, oct, and hex builtins (plan 879)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN str/bytes/int API niche gaps after plan 878
---

# `bin`, `oct`, and `hex` builtins

## Summary

Add CPython-compatible builtin `bin(x)`, `oct(x)`, and `hex(x)` formatting integers as prefixed base-2/8/16 strings. No `bin`/`oct`/`hex` builtin symbols exist in `src/` today (int `__format__` covers spec strings only).

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Each builtin takes exactly one arg; `__index__`/int/bool → `str` with `0b`/`0o`/`0x` prefix |
| R2 | Negative values use leading `-` before prefix (e.g. `bin(-65)` → `'-0b1000001'`) |
| R3 | Non-integer → `TypeError: '{type}' object cannot be interpreted as an integer` |
| R4 | Zero args → `TypeError: {name}() takes exactly one argument (0 given)` |
| R5 | `bin-oct-hex-builtin.test.ts`; update compatibility + living-plan + validation-ladder |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `int` alternate formatting (`#`, width, sign) deferred to existing `__format__`.
- PEP 3118 out of scope.

## Implementation Units

### U1. `bin` / `oct` / `hex` functions

**Files:** `src/runtime/builtins/bin-oct-hex.ts`, `src/runtime/builtins/index.ts`, `src/barrel/stable.ts`

**Approach:** Shared helper using `pyIndexAsInteger`; format `prefix + abs(n).toString(radix)` with optional leading `-`.

**Test scenarios:** `bin(65)`, negatives, zero, wrong type, arity errors for all three.

### U2. Tests and docs

**Files:** `test/cpython-derived/bin-oct-hex-builtin.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/LIVING-PLAN.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
