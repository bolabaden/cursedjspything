---
title: "feat: bytes upper and lower"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 121 next steps
---

# Bytes upper / lower

## Summary

Add **`bytes.upper()`** and **`bytes.lower()`** returning new `pyBytes` with ASCII case conversion.

---

## Problem Frame

Plan 121 next step lists further bytes/str API. Case methods are small, high-value parity after replace.

---

## Requirements

- R1. `b'AbC\xff'.upper()` → `b'ABC\xff'`; `.lower()` → `b'abc\xff'`
- R2. Only ASCII `a-z` / `A-Z` change; other bytes unchanged
- R3. Empty bytes unchanged
- R4. Add `test/cpython-derived/bytes-upper-lower.test.ts`
- R5. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R6. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `swapcase`, `capitalize`, or codec handlers

---

## Implementation Units

- U1. `bytesUpper` / `bytesLower` + slots in `bytes.ts`
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Mixed ASCII case conversion
- T2. Non-ASCII bytes preserved
- T3. Empty input

---

## Patterns

Return new `pyBytes`; unbound method tests; no args.
