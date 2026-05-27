---
title: "feat: bytes decode errors parameter"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 095 next steps
---

# Bytes decode errors parameter

## Summary

Extend **`bytes.decode`** with CPython’s **`errors`** keyword: **`strict`** (default), **`replace`**, and **`ignore`** for UTF-8. Latin-1 behavior unchanged (all byte values valid).

---

## Problem Frame

Plan 094 landed strict-only decode. LIVING-PLAN next step calls for decode/encode error modes.

---

## Requirements

- R1. `decode()` / `decode('utf-8')` strict behavior unchanged
- R2. `decode('utf-8', 'replace')` substitutes U+FFFD for invalid UTF-8
- R3. `decode('utf-8', 'ignore')` skips invalid UTF-8 sequences
- R4. Unknown `errors` → `PyValueError`
- R5. Non-str `errors` → `PyTypeError`
- R6. Extend `test/cpython-derived/bytes-decode.test.ts`
- R7. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R8. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `surrogateescape`, `backslashreplace`, or other handlers
- No `str.encode(errors=...)` yet
- No `bytes.join`

---

## Implementation Units

- U1. Extend decode helpers in `src/runtime/builtins/bytes.ts`
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. `b'\\xff'.decode('utf-8', 'replace')` → `'\ufffd'`
- T2. `b'a\\xffb'.decode('utf-8', 'ignore')` → `'ab'`
- T3. `b'\\xff'.decode('utf-8', 'strict')` → `UnicodeDecodeError`
- T4. `decode(..., errors='nope')` → `ValueError`
- T5. `decode(..., errors=1)` → `TypeError`
