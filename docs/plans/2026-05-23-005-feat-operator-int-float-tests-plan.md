---
title: "feat: CPython-derived test_operator int/float cross-type tests"
type: feat
status: completed
date: 2026-05-23
origin: docs/knowledgebase/LIVING-PLAN.md
---

# CPython-derived test_operator int/float cross-type tests

## Summary

Port thin comparison and arithmetic cases from CPython `Lib/test/test_operator.py` `OperatorTestCase` for int/float pairs into Vitest, documenting pyrt builtin cross-type delegation behavior.

---

## Problem Frame

LIVING-PLAN lists `test_operator` Tier A ports as next work. pyrt `int` builtins already delegate to `float` for mixed-type ops; this slice adds explicit CPython-derived evidence without touching golden harness.

---

## Requirements

- R1. Port `test_lt`, `test_le`, `test_eq`, `test_ne`, `test_ge`, `test_gt` int/float matrix from `test_operator.py`
- R2. Port `test_add` and `test_mul` numeric cases for int+float → float result type
- R3. Update `mine-lib-tests.sh` and LIVING-PLAN

---

## Scope Boundaries

- No `operator` stdlib module (not in pyrt)
- No complex/j imaginary number cases (TypeError in CPython — out of scope)
- No implementation changes unless tests fail

---

## Implementation Units

- U1. `test/cpython-derived/operator-int-float.test.ts`
- U2. Mining script + LIVING-PLAN

---

## Sources & References

- `vendor/cpython/Lib/test/test_operator.py` OperatorTestCase
- `src/runtime/builtins/int.ts` cross-type guards
