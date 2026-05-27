---
title: "feat: bytes isascii and contains"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 145 next steps
---

# Bytes isascii / __contains__

## Summary

Add **`bytes.isascii()`** returning `pyTrue`/`pyFalse`, and **`bytes.__contains__`** for substring and single-byte membership (`int`/`bool` operand).

---

## Problem Frame

Plan 145 next step lists further bytes/str API. `isascii` and `__contains__` are the last common `bytes` methods missing from pyrt before codec handlers.

---

## Requirements

- R1. `b'abc'.isascii()` → true; `b'\\x80'.isascii()` → false; empty → true
- R2. `b'ell' in b'hello'` → true; `97 in b'abc'` → true; empty subsequence → true
- R3. Non-bytes/non-int operand → `TypeError`; int outside 0–255 → `ValueError`
- R4. Add `test/cpython-derived/bytes-isascii-contains.test.ts`
- R5. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R6. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No codec handlers

---

## Implementation Units

- U1. `bytesIsascii`, `bytesContains` + instance slots
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. isascii on ASCII, non-ASCII, empty
- T2. contains substring, int byte, empty bytes
- T3. TypeError / ValueError paths

---

## Patterns

Reuse `findSepIndex` for substring search; `pyTrue`/`pyFalse` singletons for `isascii`.
