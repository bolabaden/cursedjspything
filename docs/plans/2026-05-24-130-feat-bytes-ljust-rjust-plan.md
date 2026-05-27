---
title: "feat: bytes ljust and rjust"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 129 next steps
---

# Bytes ljust / rjust

## Summary

Add **`bytes.ljust(width[, fillbyte])`** and **`bytes.rjust(width[, fillbyte])`** returning padded `pyBytes`.

---

## Problem Frame

Plan 129 next step lists further bytes/str API. `ljust`/`rjust` pair with landed `center`.

---

## Requirements

- R1. `b'abc'.ljust(5)` → `b'abc  '`; `rjust(5)` → `b'  abc'`
- R2. Custom fill byte; default `0x20`
- R3. `width <= len` → original bytes unchanged
- R4. Fill length ≠ 1 → method-specific `TypeError` (CPython messages)
- R5. Add `test/cpython-derived/bytes-ljust-rjust.test.ts`
- R6. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `zfill` or codec handlers

---

## Implementation Units

- U1. Generalize pad fill helper; `ljustBytes` / `rjustBytes` + slots
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Left and right padding with space and custom fill
- T2. Width not wider than data
- T3. Invalid fill length → `TypeError`

---

## Patterns

Reuse `splitMaxsplitArg`; share pad-fill helper with `center`; return `pyBytes`.
