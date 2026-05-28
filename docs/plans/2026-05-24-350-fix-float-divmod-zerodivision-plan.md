---
title: "fix: float divmod and zero divisor PyZeroDivisionError"
type: fix
status: completed
date: 2026-05-24
origin: docs/COMPATIBILITY_AND_GAPS.md §8.17; LIVING-PLAN plan 349 next steps
---

# Float divmod §8.17 parity

## Summary

Implement **`float.__divmod__`** / **`__rdivmod__`** and raise **`PyZeroDivisionError`** on zero divisor (CPython: `division by zero`). Today `divmod(float, float)` raises **`PyTypeError`** (missing slot).

---

## Requirements

- R1. `float.ts`: `Slot.divmod` / `Slot.rdivmod` for numeric operands; zero → `PyZeroDivisionError("division by zero")`
- R2. Extend `operator-zerodivision.test.ts` with float `divmod` zero case
- R3. Vitest happy-path `divmod(pyFloat(7), pyFloat(3))` returns float tuple
- R4. Update COMPATIBILITY §8.17; LIVING-PLAN delta

---

## Validation

- `npm run check && npm test && npm run golden:keys`
