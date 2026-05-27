---
title: "feat: bytes swapcase"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 125 next steps
---

# Bytes swapcase

## Summary

Add **`bytes.swapcase()`** returning new `pyBytes` with ASCII letter case swapped.

---

## Problem Frame

Plan 125 next step lists further bytes/str API. `swapcase` completes the ASCII case-method cluster.

---

## Requirements

- R1. `b'AbC\xff1'.swapcase()` → `b'aBc\xff1'`
- R2. Only ASCII `a-z` / `A-Z` swap; other bytes unchanged
- R3. Empty bytes unchanged; double swap restores original
- R4. Add `test/cpython-derived/bytes-swapcase.test.ts`
- R5. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R6. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `title`, codec handlers, or maketrans

---

## Implementation Units

- U1. `bytesSwapcase` + slot in `bytes.ts`
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Mixed ASCII swap
- T2. Non-ASCII preserved
- T3. Empty input and idempotent double swap

---

## Patterns

Mirror upper/lower; return `pyBytes`; unbound method tests.
