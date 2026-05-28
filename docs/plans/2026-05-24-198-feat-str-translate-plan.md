---
title: "feat: str maketrans and translate"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 197 next steps
---

# str maketrans / translate

## Summary

Add **`str.maketrans(frm, to)`** class method building a translation dict, and **`str.translate(table)`** applying it, mirroring CPython str semantics (dict table, not 256-byte bytes table).

---

## Problem Frame

Plan 197 next step lists translate/maketrans. Bytes parity landed in plan 144; str uses dict mapping ordinals to ordinals.

---

## Requirements

- R1. `str.maketrans("ab", "12")` → `{97: 49, 98: 50}`; `"abc".translate(table)` → `"12c"`
- R2. Empty `maketrans("", "")` → `{}`; translate unchanged
- R3. Mismatched lengths → `ValueError`; non-str operands → `TypeError`; non-dict table → `TypeError`
- R4. Code-point length for `maketrans` pairing (Unicode)
- R5. Add `test/cpython-derived/str-translate.test.ts`
- R6. validation-ladder + LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Two-arg `maketrans` only (no delete argument)
- Dict table with int values only (from maketrans)

---

## Implementation Units

- U1. `strMakeTrans`, `strTranslate` + class/instance slots on `strType`
- U2. Vitest evidence in `str-translate.test.ts`
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. maketrans mapping + translate round-trip
- T2. Empty maketrans identity
- T3. ValueError on length mismatch
- T4. TypeError on non-str / non-dict
- T5. Unicode code-point pairing

---

## Patterns

Return `pyDict` with `pyInt` keys/values; use `dictGet` for translate lookup; mirror bytes plan 144 structure.
