---
title: "feat: str/scalar cross-type evidence and bool MRO doc sync"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Str/scalar cross-type evidence + bool MRO doc sync

## Summary

Add CPython-derived Vitest coverage for str↔scalar builtin operator behavior (no numeric coercion) and sync COMPATIBILITY/parity-gaps docs with plan 026 bool subclass MRO.

---

## Problem Frame

Plans 023–026 closed the numeric tower (int/float/bool). Gap #8 remainder is str/sequence vs scalar: pyrt returns `NotImplemented` then `TypeError` or false via rich-compare — behavior exists but lacks dedicated cpython-derived evidence. COMPATIBILITY §8.15 also omits plan 026 `boolType` bases `[intType]`.

---

## Requirements

- R1. Vitest `test/cpython-derived/operator-str-scalar.test.ts`: `eq`/`ne` str↔int false/true; `add` both orders raise `TypeError`; `contains(pyStr, pyInt)` raises CPython-style `TypeError`
- R2. COMPATIBILITY §8.15: document bool subclass/isinstance; str/scalar non-coercion matrix; cite new test file
- R3. `parity-gaps-priorities.md` row #8: note bool MRO landed; str/scalar evidenced by Vitest (still no coercion)
- R4. `validation-ladder.md` / README Vitest count if changed
- R5. `npm run check`, `npm test`, `npm run golden:keys`
- R6. LIVING-PLAN delta

---

## Scope Boundaries

- Tests + docs only
- No runtime slot changes
- No new golden keys

---

## Implementation Units

- U1. Add `operator-str-scalar.test.ts`
- U2. Update COMPATIBILITY §8.15, parity-gaps, validation-ladder, README
- U3. LIVING-PLAN delta

---

## Test Scenarios

- T1. `eq(pyStr("1"), pyInt(1))` → false
- T2. `ne(pyStr("1"), pyInt(1))` → true
- T3. `add(pyStr("a"), pyInt(1))` → TypeError
- T4. `add(pyInt(1), pyStr("a"))` → TypeError
- T5. `contains(pyStr("abc"), pyInt(97))` → TypeError with `'in <string>' requires string`

---

## Sources & References

- `test/cpython-derived/operator-int-bool.test.ts`
- `docs/COMPATIBILITY_AND_GAPS.md` §8.15
- CPython: str/int do not compare equal; str `__contains__` requires str
