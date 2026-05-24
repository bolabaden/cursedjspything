---
title: "feat: bool/str binary TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 074 next steps (bool↔str / bytes §8.15)
---

# bool/str binary TypeError evidence

## Summary

Add CPython-derived Vitest coverage proving **bool↔str** `add`, `sub`, and `truediv` reject incompatible pairs with **`PyTypeError`** using dispatch typename `'bool'` (not `'int'`).

---

## Problem Frame

bool inherits int numerically but dispatch reports `'bool'` in cross-type errors. No cpython-derived tests lock bool↔str binary rejection on main.

---

## Requirements

- R1. Add `test/cpython-derived/operator-bool-str-binary.test.ts`
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only
- No runtime changes
- Skip `mul` (str repeat accepts bool counts via `sequenceRepeatCount`)

---

## Implementation Units

- U1. **Vitest** — add/sub/truediv bool↔str TypeError with `'bool'` in message

- U2. **Docs** — COMPATIBILITY, validation-ladder, LIVING-PLAN

---

## Test Scenarios

- T1. `add(bool, str)` and `add(str, bool)` → `PyTypeError` with `'bool'`
- T2. `sub(bool, str)` → `PyTypeError` with `'bool'` and `'str'`
- T3. `truediv(bool, str)` → `PyTypeError` with `'bool'` and `'str'`

---

## Sources & References

- `src/runtime/builtins/bool.ts` — bool typename in slots
- `test/cpython-derived/operator-str-scalar.test.ts`
