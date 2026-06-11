---
title: "feat: bytes builtin constructor (plan 884)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN str/bytes/int API niche gaps after plan 883
---

# `bytes` builtin constructor

## Summary

Add CPython-compatible builtin `bytes()` / `bytes(n)` / `bytes(iterable)` / `bytes(str, encoding[, errors])`. Protocol helper `bytes(obj) -> PyObject` via `__bytes__` remains exported as `bytesProtocol` on the stable barrel (mirror plan 882 `str` / `strProtocol`).

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `bytes()` → empty `pyBytes` |
| R2 | `bytes(n)` / `bytes(bool)` / `__index__` → `n` zero bytes; negative → `ValueError: negative count` |
| R3 | `bytes(iterable)` → ints 0–255; out of range → `ValueError: bytes must be in range(0, 256)` |
| R4 | `bytes(b'...')` → identity (same as CPython) |
| R5 | `bytes(str)` without encoding → `TypeError: string argument without an encoding` |
| R6 | `bytes(str, encoding[, errors])` → encode via shared `pyStrEncode` |
| R7 | 2+ args, non-str first → `TypeError: encoding without a string argument` |
| R8 | Bad encoding/errors types → `bytes() argument 'encoding'/'errors' must be str, not {type}` |
| R9 | `>3` args → `TypeError: bytes() takes at most 3 arguments (N given)` |
| R10 | Rename stable protocol export to `bytesProtocol`; export builtin `bytes` from builtins |
| R11 | `bytes-builtin.test.ts`; migrate protocol tests to `bytesProtocol`; update docs |
| R12 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Buffer/memoryview constructor forms deferred.
- PEP 3118 out of scope.

## Implementation Units

### U1. Shared encode helper + bytes constructor

**Files:** `src/runtime/builtins/str.ts`, `src/runtime/builtins/bytes-constructor.ts`, `src/runtime/builtins/index.ts`, `src/barrel/stable.ts`

**Approach:** Export `pyStrEncode`; wire `str.encode` and `bytes(...)` 2–3 arg form through it. Iterable path uses `iter`/`next` + `pyIndexAsInteger`.

### U2. Tests and docs

**Files:** `test/cpython-derived/bytes-builtin.test.ts`, `test/cpython-derived/bytes-bytes.test.ts`, `test/cpython-derived/operator-bytes-conversion.test.ts`, fixture tests using `bytes(pyStr(...))`, `examples/python-vs-js.ts`, compatibility + living-plan + validation-ladder

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
