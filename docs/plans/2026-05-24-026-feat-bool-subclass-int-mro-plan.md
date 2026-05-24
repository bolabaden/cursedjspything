---
title: "feat: wire bool as subclass of int for MRO/isinstance parity"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Bool subclass-of-int MRO wiring

## Summary

Set `boolType` bases to `[intType]` so `isinstance(True, int)` and `issubclass(bool, int)` match CPython, completing the structural half of bool/int parity beyond operator slots.

---

## Problem Frame

Plans 023–024 added int↔bool and bool↔float operator delegation, but `boolType` still inherits only from `object`. CPython defines `bool` as a subclass of `int`; pyrt returns `isinstance(pyTrue, intType) === false` today.

---

## Requirements

- R1. `boolType` created with `bases: [intType]`; MRO includes `intType`
- R2. `isinstance(pyTrue, intType)` and `isinstance(pyFalse, intType)` are `true`
- R3. `issubclass(boolType, intType)` is `true`; `issubclass(intType, boolType)` is `false`
- R4. Break `int.ts` ↔ `bool.ts` circular import (reorder builtin exports: int before bool; int uses type-name check for bool operands)
- R5. Existing int↔bool operator tests and golden keys remain green
- R6. Vitest: extend `test/cpython-derived/isinstance-protocol.test.ts` with bool/int cases
- R7. `npm run check`, `npm test`, `npm run golden:keys`
- R8. LIVING-PLAN delta

---

## Scope Boundaries

- `src/runtime/builtins/bool.ts`, `int.ts`, `index.ts`
- `test/cpython-derived/isinstance-protocol.test.ts`
- No new golden keys (operator golden already covers numeric behavior)
- No changes to `int.__eq__` accepting bool via MRO dispatch (explicit guards remain)

---

## Implementation Units

- U1. Reorder `builtins/index.ts` exports (`int` before `bool`)
- U2. Remove `boolType` import from `int.ts`; use `other.type.name === "bool"` in numeric helpers
- U3. Add `bases: [intType]` to `boolType` in `bool.ts`
- U4. Add isinstance/issubclass tests for bool/int
- U5. LIVING-PLAN delta

---

## Test Scenarios

- T1. `isinstance(pyTrue, intType)` → true
- T2. `isinstance(pyFalse, intType)` → true
- T3. `issubclass(boolType, intType)` → true
- T4. `issubclass(intType, boolType)` → false
- T5. `boolType.mro` includes `intType` and `objectType`
- T6. Regression: `operator-int-bool.test.ts` and golden key parity unchanged

---

## Risks

- Circular import if `int.ts` imports `bool.ts` at module top — mitigated by export reorder + name check
- MRO slot inheritance unlikely to break bool-specific slots (bool dict overrides int)

---

## Sources & References

- `src/runtime/builtins/bool.ts`, `int.ts`
- `test/cpython-derived/isinstance-protocol.test.ts`
- CPython: `bool` subclasses `int`
