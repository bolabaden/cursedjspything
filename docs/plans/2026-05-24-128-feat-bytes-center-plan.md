---
title: "feat: bytes center"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 127 next steps
---

# Bytes center

## Summary

Add **`bytes.center(width[, fillbyte])`** returning centered `pyBytes` padded to `width`.

---

## Problem Frame

Plan 127 next step lists further bytes/str API. `center` adds padding parity after case/search methods.

---

## Requirements

- R1. `b'abc'.center(5)` → `b' abc '`; `center(5, b'-')` → `b'-abc-'`
- R2. `width <= len` → original bytes unchanged (including `width=0`)
- R3. Default fill `0x20`; fill must be length-1 bytes or `TypeError`
- R4. `width` parsed like other int args
- R5. Add `test/cpython-derived/bytes-center.test.ts`
- R6. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `ljust`/`rjust`/`zfill` or codec handlers

---

## Implementation Units

- U1. `centerBytes` + slot in `bytes.ts`
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Space and custom fill padding
- T2. Width not wider than data
- T3. Empty bytes centered
- T4. Invalid fill length → `TypeError`

---

## Patterns

Return `pyBytes`; reuse `splitMaxsplitArg` for width; unbound method tests.
