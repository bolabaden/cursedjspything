---
title: "feat: bytes decode"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 093 next steps
---

# Bytes decode

## Summary

Add **`bytes.decode`** returning `pyStr`, mirroring CPython’s UTF-8 default and `latin-1` identity decode. Invalid UTF-8 raises **`UnicodeDecodeError`**; unknown encodings raise **`LookupError`**.

---

## Problem Frame

Plan 093 next step: bytes `decode()`. `str.__bytes__` already UTF-8 encodes via `TextEncoder`; bytes lacks the inverse.

---

## Requirements

- R1. `bytes.decode()` and `bytes.decode('utf-8')` return `pyStr` for valid UTF-8
- R2. `bytes.decode('latin-1')` maps each byte 0–255 to the same code point
- R3. Invalid UTF-8 (strict) → `PyUnicodeDecodeError`
- R4. Unknown encoding name → `PyLookupError`
- R5. Non-str encoding argument → `PyTypeError`
- R6. Add `test/cpython-derived/bytes-decode.test.ts`
- R7. COMPATIBILITY §8.15 / validation-ladder / LIVING-PLAN delta
- R8. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `errors=` replace/ignore modes
- No `encode()` on str beyond existing `__bytes__`
- PEP 3118 buffer protocol out of scope

---

## Implementation Units

- U1. Add `PyUnicodeDecodeError`, `PyLookupError` in `src/runtime/core/errors.ts`; re-export via lookup/barrel
- U2. Add `decode` to `src/runtime/builtins/bytes.ts`
- U3. Vitest evidence
- U4. Docs + feature branch + PR

---

## Test Scenarios

- T1. `b'hello'.decode()` → `'hello'`
- T2. `b'\xff'.decode('latin-1')` → `'\xff'`
- T3. `b'\xff'.decode()` → `UnicodeDecodeError`
- T4. `b'x'.decode('nope')` → `LookupError`
- T5. `decode(1)` → `TypeError`
