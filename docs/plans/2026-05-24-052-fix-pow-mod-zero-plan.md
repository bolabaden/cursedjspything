---
title: "fix: int pow with mod zero raises PyValueError"
type: fix
status: completed
date: 2026-05-24
origin: docs/COMPATIBILITY_AND_GAPS.md §8.17; CPython pow() semantics
---

# Int pow mod-zero ValueError parity

## Summary

When `pow(base, exp, mod)` is called with `mod == 0`, raise **`PyValueError`** with CPython message `pow() 3rd argument cannot be 0` instead of letting `BigInt` modulo throw an opaque runtime error.

---

## Problem Frame

`int.ts` `Slot.pow` uses `BigInt(base) ** BigInt(exp) % BigInt(m)` when a third argument is provided. `m === 0` hits JS `RangeError` or similar — not a typed Python exception. CPython raises **`ValueError: pow() 3rd argument cannot be 0`**.

---

## Requirements

- R1. Guard `mod === 0` in `int.ts` `Slot.pow` before BigInt math; throw `PyValueError("pow() 3rd argument cannot be 0")`
- R2. Add `test/cpython-derived/operator-pow-mod.test.ts` covering `pow(pyInt(2), pyInt(3), pyInt(0))`
- R3. Update COMPATIBILITY §8.17 numeric exception note; LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- int three-arg `pow` only
- No float/complex pow changes

---

## Implementation Units

- U1. `int.ts` guard + `PyValueError`
- U2. Vitest + COMPATIBILITY + LIVING-PLAN

---

## Test Scenarios

- T1. `pow(pyInt(2), pyInt(3), pyInt(0))` throws `PyValueError`
- T2. Message matches `/pow\(\) 3rd argument cannot be 0/`
- T3. Two-arg `pow(pyInt(2), pyInt(3))` still works

---

## Sources & References

- CPython `Objects/longobject.c` / `pow()` three-arg path
- `docs/plans/2026-05-24-048-fix-zerodivision-error-plan.md`
