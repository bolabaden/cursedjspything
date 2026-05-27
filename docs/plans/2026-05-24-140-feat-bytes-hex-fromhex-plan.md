---
title: "feat: bytes hex and fromhex"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 139 next steps
---

# Bytes hex / fromhex

## Summary

Add **`bytes.hex([sep])`** returning lowercase hex `str`, and **`bytes.fromhex(string)`** class method building `pyBytes` from hex digits.

---

## Problem Frame

Plan 139 next step lists further bytes/str API. Plan 138 deferred `hex`; these are paired encode/decode helpers.

---

## Requirements

- R1. `b'\\xde\\xad\\xbe\\xef'.hex()` → `'deadbeef'`; optional 1-byte `sep` inserts between nybbles
- R2. `bytes.fromhex('dead beef')` → `b'\\xde\\xad\\xbe\\xef'` (whitespace ignored)
- R3. Invalid hex / odd digit count → `ValueError`; bad types → `TypeError`
- R4. Add `test/cpython-derived/bytes-hex-fromhex.test.ts`
- R5. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R6. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No codec handlers or translate/maketrans in this slice

---

## Implementation Units

- U1. `bytesHex`, `bytesFromhex` + instance/class slots
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. hex default and with separator
- T2. fromhex with whitespace; empty string
- T3. ValueError / TypeError paths

---

## Patterns

Return `pyStr` from `hex`; `pyBytes` from `fromhex`; reuse `requireAffixBytes` pattern for sep length check.
