---
title: "feat: backslashreplace codec handler"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 149 next steps
---

# Backslashreplace codec handler

## Summary

Add **`errors='backslashreplace'`** to **`str.encode`** (ascii/latin-1) and **`bytes.decode`** (utf-8/ascii), escaping unencodable/decodable bytes as `\xNN` / `\uNNNN` text.

---

## Problem Frame

Plan 149 next step lists surrogateescape/backslashreplace codec handlers. Backslashreplace is the next incremental handler after strict/replace/ignore.

---

## Requirements

- R1. `b'\\xff'.decode('utf-8', 'backslashreplace')` → `'\\xff'`
- R2. `'é'.encode('ascii', 'backslashreplace')` → `b'\\xe9'`
- R3. `'\u0100'.encode('latin-1', 'backslashreplace')` → `b'\\u0100'`
- R4. Unknown errors still → `ValueError`
- R5. Extend `bytes-decode.test.ts` and `str-encode.test.ts`
- R6. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No surrogateescape in this slice
- utf-8 encode unchanged (TextEncoder path)

---

## Implementation Units

- U1. Shared backslashreplace helpers + errors-arg union in `bytes.ts` / `str.ts`
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. decode utf-8/ascii backslashreplace
- T2. encode ascii/latin-1 backslashreplace
- T3. errors arg registration

---

## Patterns

Lowercase hex in `\x` escapes; reuse existing decode/encode loops.
