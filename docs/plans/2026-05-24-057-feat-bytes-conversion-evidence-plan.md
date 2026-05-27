---
title: "feat: bytes() conversion evidence for str vs non-bytes types"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 056 next steps
---

# bytes() conversion evidence for str vs non-bytes types

## Summary

Add CPython-derived Vitest proving the exported **`bytes()`** helper converts **`str`** via `__bytes__` and rejects types without that hook (e.g. **`int`**, **`float`**) with **`PyTypeError`**.

---

## Problem Frame

`bytes(obj)` in `src/runtime/dispatch/operators/numeric.ts` dispatches `Hook.bytes`; `str` implements `__bytes__` via UTF-8 `TextEncoder`. No dedicated tests; parity docs list `bytes` among untested exported operators and §8.15 still notes bytes-related cross-type gaps.

---

## Requirements

- R1. Add `test/cpython-derived/operator-bytes-conversion.test.ts`
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Tests + docs only
- No runtime changes (behavior already correct via dispatch)

---

## Implementation Units

- U1. **Vitest** — happy path `bytes(pyStr)`; error paths `bytes(pyInt)`, `bytes(pyFloat)`

- U2. **Docs** — COMPATIBILITY §8.15 evidence line, validation-ladder, LIVING-PLAN delta

---

## Test Scenarios

- T1. Happy path: `bytes(pyStr("ab"))` returns UTF-8 bytes (`Uint8Array` matching `[97, 98]`)
- T2. Error path: `bytes(pyInt(1))` throws `PyTypeError` matching `cannot convert 'int' object to bytes`
- T3. Error path: `bytes(pyFloat(1.0))` throws `PyTypeError` matching `cannot convert 'float' object to bytes`

---

## Sources & References

- CPython `bytes()` / `__bytes__` spirit
- `src/runtime/dispatch/operators/numeric.ts` — `bytes()`
- `docs/plans/2026-05-24-056-feat-int-bitwise-float-plan.md` — prior test-only slice pattern
