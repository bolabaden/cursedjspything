---
title: "refactor: dedupe sequence mul/rmul slot handlers"
type: refactor
status: active
date: 2026-05-24
origin: docs/plans/2026-05-24-036-feat-list-tuple-mul-bool-plan.md
---

# Dedupe sequence repetition slots

## Summary

Simplify list/tuple/str `__mul__`/`__rmul__` after plans 036–037: one handler per type, `sequenceRepeatCount` delegates to `numericOperand` for int/bool.

---

## Problem Frame

Reviews (/simplify, maintainability, architecture) flagged identical `Slot.mul` and `Slot.rmul` bodies in three builtins and duplicated bool coercion in `sequenceRepeatCount`.

---

## Requirements

- R1. Each of `list.ts`, `tuple.ts`, `str.ts`: single repeat handler registered for both mul and rmul
- R2. `sequenceRepeatCount`: int/bool via `numericOperand`; reject other types
- R3. Clamp negative counts in `sequenceRepeatCount` (`Math.max(0, n)`) so str can drop local clamp
- R4. `npm run check`, `npm test`, `npm run golden:keys`
- R5. LIVING-PLAN delta; feature branch + PR

---

## Scope Boundaries

- No new modules; keep `sequenceRepeatCount` in `int.ts` (architecture recommendation)
- Defer list/tuple pre-sized repeat loops (performance) to future slice

---

## Implementation Units

- U1. `int.ts` sequenceRepeatCount cleanup
- U2. list/tuple/str slot dedupe
- U3. Tests unchanged; docs/LIVING-PLAN

---

## Test Scenarios

- T1. `sequence-repeat-bool.test.ts` passes
- T2. `operator-str-scalar.test.ts` str bool repeat passes
- T3. Golden keys unchanged

---

## Review inputs

- ce-code-simplicity-reviewer: P1 mul/rmul dedupe, P3 numericOperand
- ce-architecture-strategist: keep helper in int.ts
- performance-optimizer: pre-size deferred

---
