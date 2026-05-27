---
title: "feat: bytes capitalize"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 123 next steps
---

# Bytes capitalize

## Summary

Add **`bytes.capitalize()`** returning new `pyBytes` with first ASCII letter uppercased and remaining ASCII letters lowercased.

---

## Problem Frame

Plan 123 next step lists further bytes/str API. `capitalize` extends the case-method cluster after upper/lower.

---

## Requirements

- R1. `b'hello WORLD'.capitalize()` → `b'Hello world'`
- R2. Non-letter first byte unchanged; rest ASCII letters lowercased
- R3. Empty bytes unchanged
- R4. Add `test/cpython-derived/bytes-capitalize.test.ts`
- R5. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R6. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `swapcase`, `title`, or codec handlers

---

## Implementation Units

- U1. `bytesCapitalize` + slot in `bytes.ts`
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Mixed-case phrase
- T2. Non-letter prefix and non-ASCII bytes
- T3. Empty input

---

## Patterns

Reuse upper/lower byte rules; return `pyBytes`; unbound method tests.
