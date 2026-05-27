---
title: "feat: bytes expandtabs"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 137 next steps
---

# Bytes expandtabs

## Summary

Add **`bytes.expandtabs(tabsize=8)`** replacing tab bytes with spaces to the next tab stop.

---

## Problem Frame

Plan 137 next step lists further bytes/str API. `expandtabs` is a common bytes method not yet implemented.

---

## Requirements

- R1. `b'hello\tworld'.expandtabs(8)` → `b'hello   world'`
- R2. Default `tabsize=8`; `tabsize=0` drops tabs without adding spaces
- R3. No tabs → unchanged bytes
- R4. Non-integer `tabsize` → `TypeError`
- R5. Add `test/cpython-derived/bytes-expandtabs.test.ts`
- R6. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `hex`, codec handlers, or str parity in this slice

---

## Implementation Units

- U1. `expandTabsBytes` helper + slot on `bytesType`
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Tab expansion to next stop with explicit and default tabsize
- T2. `tabsize=0` removes tabs; no tabs unchanged
- T3. Invalid tabsize type → `TypeError`

---

## Patterns

Reuse integer coercion via `splitMaxsplitArg` with default 8; return `pyBytes`.
