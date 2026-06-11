# Residual review findings — plan 885 int builtin

**Branch:** `feat/int-builtin-885`  
**Review:** ce-code-review (correctness + maintainability), 2026-05-24

## Residual Review Findings

- **P2** — `src/runtime/dispatch/operators/numeric.ts` (toInt / intProtocol): `intProtocol(pyFloat(infinity))` still returns `Infinity` while builtin `int()` raises `ValueError`; align float `__int__` slot or document intentional divergence.
- **P2** — `src/runtime/builtins/int-constructor.ts`: non-finite float conversion uses `PyValueError`; CPython uses `OverflowError` for infinity and `ValueError` for NaN — no `PyOverflowError` type in pyrt yet.
