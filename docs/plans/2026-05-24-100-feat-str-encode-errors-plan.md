---
title: "feat: str encode with errors"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 099 next steps
---

# str encode with errors

## Summary

Add **`str.encode(encoding='utf-8', errors='strict')`** returning `pyBytes`, mirroring the bytes decode slice and CPython’s ascii/latin-1 error modes.

---

## Problem Frame

Plan 099 next step lists `str.encode(errors=...)`. `Hook.bytes` UTF-8 encodes via `TextEncoder` but there is no explicit `encode` method or non-utf-8 / errors handling.

---

## Requirements

- R1. `str.encode()` default utf-8 strict → `pyBytes` (same as current `__bytes__`)
- R2. `encode('ascii', 'strict')` raises `UnicodeEncodeError` for non-ASCII
- R3. `encode('ascii', 'replace')` substitutes `?` (0x3f)
- R4. `encode('ascii', 'ignore')` omits non-ASCII code points
- R5. `encode('latin-1', 'strict')` raises for code points > 255
- R6. Unknown encoding → `LookupError`; unknown errors → `ValueError`
- R7. Add `test/cpython-derived/str-encode.test.ts`
- R8. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R9. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No surrogateescape / backslashreplace handlers
- No new bytes methods

---

## Implementation Units

- U1. Add `PyUnicodeEncodeError`; extend `src/runtime/builtins/str.ts`
- U2. Route `Hook.bytes` through shared encode helper
- U3. Vitest evidence + docs + PR

---

## Test Scenarios

- T1. `'ab'.encode()` → `b'ab'`
- T2. `'é'.encode('ascii')` → `UnicodeEncodeError`
- T3. `'é'.encode('ascii', 'replace')` → `b'?'`
- T4. `'aéb'.encode('ascii', 'ignore')` → `b'ab'`
- T5. `chr(256).encode('latin-1', 'strict')` → `UnicodeEncodeError`
