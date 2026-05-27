---
title: "feat: bytes maketrans and translate"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 143 next steps
---

# Bytes maketrans / translate

## Summary

Add **`bytes.maketrans(frm, to)`** class method building a 256-byte translation table, and **`bytes.translate(table)`** applying it.

---

## Problem Frame

Plan 143 next step lists further bytes/str API. `maketrans` / `translate` were deferred since plan 120; they are among the last core `bytes` methods missing from pyrt.

---

## Requirements

- R1. `bytes.maketrans(b'ab', b'12')` → 256-byte identity table with `a→1`, `b→2`
- R2. `b'abc'.translate(table)` maps each byte through the table
- R3. Mismatched `maketrans` lengths → `ValueError`; table not length 256 → `ValueError`; bad types → `TypeError`
- R4. Add `test/cpython-derived/bytes-translate.test.ts`
- R5. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R6. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Python 3.14 two-arg `maketrans` only (no delete argument)
- No codec handlers

---

## Implementation Units

- U1. `bytesMakeTrans`, `bytesTranslate` + class/instance slots
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. maketrans mapping + translate round-trip
- T2. ValueError on length mismatch / bad table size
- T3. TypeError on non-bytes operands

---

## Patterns

Reuse `requireAffixBytes`; return `pyBytes`; CPython error message strings.
