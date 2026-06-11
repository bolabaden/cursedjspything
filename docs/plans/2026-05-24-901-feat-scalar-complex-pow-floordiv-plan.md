---
title: "feat: scalar-complex pow and reflected floordiv/mod parity (plan 901)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN post-900 — Tier-1 cross-type numeric gaps after complex arc 894–900
---

# Scalar-complex pow rejection and reflected floordiv/mod

## Summary

Close CPython 3.14 parity gaps for **int/float** operands with **complex** on the right: add **`complex.__rpow__`** so `int ** complex` and `float ** complex` promote via `exp(log(base)*exp)`; prove `int // complex` and `int % complex` remain generic unsupported-operand `TypeError` (no reflected floor hooks). Lock behavior with cpython-derived tests and docs.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `int ** complex` and `float ** complex` → `pyComplex` via `complex.__rpow__` |
| R2 | `int // complex`, `float // complex`, `int % complex`, `float % complex` → generic unsupported-operand `PyTypeError` |
| R3 | Existing `complex // scalar` and `complex % scalar` floor errors unchanged |
| R4 | Docs: COMPATIBILITY, validation-ladder, LIVING-PLAN |
| R5 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No scalar `//`/`%` complex floor-message hooks (CPython 3.14 uses generic unsupported-operand).
- No ordering or inplace ops in this slice.
- PEP 3118 out of scope.

## Implementation Units

### U1. Runtime

**File:** `src/runtime/builtins/complex.ts` — add `powRealComplex` and `Slot.rpow` for scalar bases.

### U2. Tests and docs

**Files:** `test/cpython-derived/operator-scalar-complex-pow-floordiv.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/knowledgebase/LIVING-PLAN.md`.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
