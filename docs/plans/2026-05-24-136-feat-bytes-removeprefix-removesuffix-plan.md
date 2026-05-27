---
title: "feat: bytes removeprefix and removesuffix"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 135 next steps
---

# Bytes removeprefix / removesuffix

## Summary

Add **`bytes.removeprefix(prefix)`** and **`bytes.removesuffix(suffix)`** returning `pyBytes` with affix stripped when present (Python 3.9+).

---

## Problem Frame

Plan 135 next step lists further bytes/str API. These pair with landed `startswith` / `endswith` and reuse existing affix-matching helpers.

---

## Requirements

- R1. `b'hello'.removeprefix(b'he')` → `b'llo'`; no match → unchanged
- R2. `b'hello'.removesuffix(b'lo')` → `b'hel'`; no match → unchanged
- R3. Empty affix → unchanged bytes
- R4. Prefix/suffix must be `bytes`; wrong type → `TypeError` (`a bytes-like object is required, not '…'`)
- R5. Add `test/cpython-derived/bytes-removeprefix-removesuffix.test.ts`
- R6. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No tuple affixes (CPython rejects); no codec handlers

---

## Implementation Units

- U1. `requireAffixBytes`, `removePrefixBytes` / `removeSuffixBytes` + slots
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Strip matching prefix/suffix
- T2. No match and empty affix unchanged
- T3. Non-bytes affix → `TypeError`

---

## Patterns

Reuse `bytesStartsWithSlice` / `bytesEndsWithSlice`; return `pyBytes`.
