---
title: "feat: bytes zfill"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 131 next steps
---

# Bytes zfill

## Summary

Add **`bytes.zfill(width)`** returning zero-padded `pyBytes`, preserving a leading `+` or `-` sign when present.

---

## Problem Frame

Plan 131 next step lists further bytes/str API. Plan 130 deferred `zfill`; it pairs with landed `ljust`/`rjust`/`center` padding methods.

---

## Requirements

- R1. `b'abc'.zfill(5)` → `b'00abc'`; `b'42'.zfill(5)` → `b'00042'`
- R2. Signed numeric bytes: `b'-42'.zfill(5)` → `b'-0042'`; `b'+42'.zfill(5)` → `b'+0042'`
- R3. `width <= len` → original bytes unchanged
- R4. Empty bytes: `b''.zfill(5)` → `b'00000'`
- R5. Add `test/cpython-derived/bytes-zfill.test.ts`
- R6. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `title`, codec handlers, or str parity in this slice

---

## Implementation Units

- U1. `zfillBytes` helper + slot on `bytesType`
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Zero-pad unsigned bytes and empty bytes
- T2. Preserve sign; zeros after sign for `-` / `+` prefixes
- T3. Width not wider than data → unchanged

---

## Patterns

Reuse `splitMaxsplitArg`; return `pyBytes`; mirror padding helpers in `bytes.ts`.
