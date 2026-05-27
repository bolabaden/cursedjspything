---
title: "feat: list/tuple __rmul__ accepts bool repeat counts"
type: feat
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-036-feat-list-tuple-mul-bool-plan.md
---

# List/tuple reflected repetition bool parity

## Summary

Add `__rmul__` on list and tuple using `sequenceRepeatCount` so `True * [1]` and `False * (1,)` match CPython (plan 036 only fixed `seq * bool`).

---

## Problem Frame

Plan 036 enabled `[1] * True`; `True * [1]` still raises `TypeError` because list/tuple lack `__rmul__` and bool has no sequence `__mul__`.

---

## Requirements

- R1. `list.ts` and `tuple.ts` implement `Slot.rmul` mirroring `__mul__` repeat logic
- R2. Extend `sequence-repeat-bool.test.ts` with reflected cases (`mul(pyTrue, seq)`)
- R3. Note in COMPATIBILITY §8.15; LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- list/tuple rmul only; no int slot changes
- No new golden keys

---

## Implementation Units

- U1. `Slot.rmul` in `list.ts`, `tuple.ts`
- U2. Vitest + docs

---

## Test Scenarios

- T1. `mul(pyTrue, pyList([pyInt(1)]))` length 1
- T2. `mul(pyFalse, pyTuple([pyInt(1)]))` length 0
- T3. Existing forward mul tests still pass

---

## Sources & References

- Plan 036 `sequenceRepeatCount`
- CPython `list.__rmul__` / `tuple.__rmul__`
