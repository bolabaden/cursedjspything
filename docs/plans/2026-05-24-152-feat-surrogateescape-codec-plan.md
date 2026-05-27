---
title: "feat: surrogateescape codec handler"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 151 next steps
---

# Surrogateescape codec handler

## Summary

Add **`errors='surrogateescape'`** to **`str.encode`** (utf-8/ascii/latin-1) and **`bytes.decode`** (utf-8/ascii), mapping undecodable bytes to U+DC80–U+DCFF and those code points back to raw bytes on encode.

---

## Problem Frame

Plan 151 next step lists surrogateescape after backslashreplace. PEP 383 round-trip for OS-facing paths.

---

## Requirements

- R1. `b'\xff'.decode('ascii', 'surrogateescape')` → `'\udcff'`
- R2. `b'\xff'.decode('utf-8', 'surrogateescape')` → `'\udcff'`
- R3. `'\udc80'.encode('ascii', 'surrogateescape')` → `b'\x80'`
- R4. `'\udc80'.encode('utf-8', 'surrogateescape')` → `b'\x80'`
- R5. U+DC00–U+DC7F still raise on encode; latin-1 decode unchanged (identity)
- R6. Unknown errors → `ValueError`; extend tests + docs
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No PEP 3118 / filesystem integration
- utf-8 encode cannot use `TextEncoder` (lone surrogates)

---

## Implementation Units

- U1. Helpers + handler in `bytes.ts` / `str.ts`
- U2. Vitest in `bytes-decode.test.ts`, `str-encode.test.ts`
- U3. validation-ladder + LIVING-PLAN; feature branch + PR

---

## Test Scenarios

- T1. decode ascii/utf-8 surrogateescape
- T2. encode ascii/latin-1/utf-8 surrogateescape
- T3. out-of-range surrogates still error
