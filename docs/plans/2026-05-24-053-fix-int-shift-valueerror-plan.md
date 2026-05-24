---
title: "fix: int shift negative count raises PyValueError"
type: fix
status: completed
date: 2026-05-24
origin: docs/COMPATIBILITY_AND_GAPS.md §8.17; CPython int shift semantics
---

# Int negative shift count ValueError parity

## Summary

Guard int `__lshift__` and `__rshift__` so a negative shift count raises **`PyValueError("negative shift count")`** instead of relying on JS bitwise shift behavior.

---

## Problem Frame

`int.ts` uses `<<` and `>>` with unchecked shift counts. CPython raises **`ValueError: negative shift count`** for `1 << -1` and `8 >> -1`. Plan 052 covered pow mod-zero; this completes another numeric edge case in the same exception-typing track.

---

## Requirements

- R1. In `int.ts` `Slot.lshift` and `Slot.rshift`, if shift count `< 0`, throw `PyValueError("negative shift count")`
- R2. Add `test/cpython-derived/operator-int-shift.test.ts` for lshift/rshift negative counts and a happy-path case
- R3. Update COMPATIBILITY §8.17; LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- int lshift/rshift only (no float/complex)
- No changes to shift magnitude overflow behavior

---

## Implementation Units

- U1. `int.ts` guards
- U2. Vitest + docs

---

## Test Scenarios

- T1. `lshift(pyInt(1), pyInt(-1))` throws `PyValueError` / `negative shift count`
- T2. `rshift(pyInt(8), pyInt(-1))` throws same
- T3. Positive shifts unchanged

---

## Sources & References

- CPython `Objects/longobject.c` shift helpers
- `docs/plans/2026-05-24-052-fix-pow-mod-zero-plan.md`
