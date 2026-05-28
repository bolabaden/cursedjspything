---
title: "feat: str expandtabs"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 195 next steps
---

# str expandtabs

## Summary

Add **`str.expandtabs(tabsize=8)`** replacing tab characters with spaces to the next tab stop, mirroring landed `bytes.expandtabs`.

---

## Problem Frame

Plan 195 completed str padding parity. `expandtabs` is the next common str method missing vs bytes (landed plan 138).

---

## Requirements

- R1. `"hello\tworld".expandtabs(8)` → `"hello   world"`
- R2. Default `tabsize=8`; `tabsize=0` drops tabs without adding spaces
- R3. No tabs → unchanged str
- R4. Non-integer `tabsize` → `TypeError`
- R5. Add `test/cpython-derived/str-expandtabs.test.ts`
- R6. validation-ladder + LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `translate`/`maketrans` in this slice

---

## Implementation Units

- U1. `parseExpandtabsTabsize`, `expandTabsStr` + register on `strType`
- U2. Vitest evidence in `str-expandtabs.test.ts`
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Tab expansion with explicit and default tabsize
- T2. `tabsize=0` removes tabs; no tabs unchanged
- T3. Invalid tabsize type → `TypeError`
- T4. Unicode code-point column counting

---

## Patterns

Mirror `expandTabsBytes` in `bytes.ts`; count columns by code points.
