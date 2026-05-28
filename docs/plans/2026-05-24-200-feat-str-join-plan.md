---
title: "feat: str join"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 199 next steps
---

# str join

## Summary

Add **`str.join(iterable)`** concatenating str items with the separator, mirroring landed `bytes.join`.

---

## Problem Frame

Plan 199 closed core str method parity with bytes. `join` is a fundamental str API used everywhere; bytes join landed in plan 098.

---

## Requirements

- R1. `" ".join(["a", "b", "c"])` → `"a b c"`; single item → no separator inserted
- R2. Empty iterable → `""`
- R3. Accepts list/tuple iterables of `str`
- R4. Non-str item → `TypeError`; non-iterable → `TypeError` (`can only join an iterable`)
- R5. Add `test/cpython-derived/str-join.test.ts`
- R6. validation-ladder + LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `casefold` or codec handlers in this slice

---

## Implementation Units

- U1. `joinStr` helper + register on `strType`
- U2. Vitest evidence in `str-join.test.ts`
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Join list/tuple with separator
- T2. Empty and single-element iterables
- T3. Non-str item and non-iterable errors
- T4. Unicode strings in iterable

---

## Patterns

Mirror `joinBytes` in `bytes.ts`; use `iter`/`next` from protocols.
