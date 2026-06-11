---
title: "feat: chr and ord builtins (plan 878)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN str/bytes API niche gaps after plan 877
---

# `chr` and `ord` builtins

## Summary

Add CPython-compatible builtin `chr(i)` and `ord(c)` for int↔str/bytes code-point conversion. No `chr`/`ord` symbols exist in `src/` today.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `chr(i)` — exactly one arg; `__index__`/int/bool → one-character `str`; range `0 <= i <= 0x10FFFF` |
| R2 | `chr` out of range → `ValueError: chr() arg not in range(0x110000)` |
| R3 | `chr` non-integer → `TypeError: '{type}' object cannot be interpreted as an integer` |
| R4 | `ord(c)` — exactly one arg; `str` (one Unicode code point) or `bytes` (length 1) → `int` |
| R5 | `ord` empty/multi char → `TypeError: ord() expected a character, but string of length N found` (bytes uses same wording) |
| R6 | `ord` wrong type → `TypeError: ord() expected string of length 1, but {type} found` |
| R7 | `chr-ord-builtin.test.ts`; update compatibility + living-plan + validation-ladder |
| R8 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `bytes`/`bytearray` beyond length-1 `ord` input deferred.
- PEP 3118 out of scope.

## Implementation Units

### U1. `chr` / `ord` functions

**Files:** `src/runtime/builtins/chr-ord.ts`, `src/runtime/builtins/index.ts`, `src/barrel/stable.ts`

**Approach:** `chr` uses `pyIndexAsInteger` + `String.fromCodePoint`; `ord` counts code points via spread/`codePointAt` for str, `nativeVal<Uint8Array>` for bytes.

**Test scenarios:** `chr(65)`, `chr(0x10FFFF)`, range errors, `ord('A')`, `ord(b'A')`, length errors, wrong types.

### U2. Tests and docs

**Files:** `test/cpython-derived/chr-ord-builtin.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/LIVING-PLAN.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
