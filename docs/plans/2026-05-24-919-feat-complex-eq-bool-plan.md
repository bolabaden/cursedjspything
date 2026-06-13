---
title: "feat: complex equality bool subclass evidence (plan 919)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN post-918 — complete bool↔complex scalar arc (plans 916–918 arithmetic, 909 pow)
---

# Complex equality bool subclass evidence

## Summary

Lock CPython parity for **complex** rich comparison with **bool** operands when the imaginary part is zero, complementing existing int scalar equality cases in `operator-complex-eq-pow.test.ts`.

## Problem Frame

Plans 916–918 and 909 cover bool↔complex arithmetic and `**`. Equality when `complex(real, 0)` compares to `True`/`False` follows int-subclass promotion in CPython but has no dedicated evidence file entry yet.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `(n+0j) == True` and `True == (n+0j)` when `n` is the bool’s int value (`1` for `True`) |
| R2 | `(n+0j) != True` when imag ≠ 0 (e.g. `(1+2j)`) |
| R3 | `False` compares equal to `(0+0j)` in both orders |
| R4 | Docs: `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/knowledgebase/LIVING-PLAN.md` |
| R5 | `npm run check && npm test && npm run golden:keys` |

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Tests-only slice | Runtime already routes bool through numeric equality; prior manual probe matches CPython |
| Extend `operator-complex-eq-pow.test.ts` | Keeps eq/pow complex evidence co-located per plan 897 pattern |
| No ordering cases | Complex ordering remains unsupported; bool does not change that |

## Scope Boundaries

- No runtime changes unless tests expose regressions.
- Inplace bool/complex `+=` divergence (plan 914 note) stays out of scope.
- Full bigint int arithmetic and operator-file dedupe are separate slices.
- PEP 3118 out of scope.

### Deferred to Follow-Up Work

- Operator consolidation audit (§8.15 evidence dedupe in COMPATIBILITY).
- Broader bigint int `==` beyond ratio storage.

## Implementation Units

### U1. Tests and docs

**Goal:** Add bool equality cases and sync documentation.

**Requirements:** R1–R5

**Files:** `test/cpython-derived/operator-complex-eq-pow.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/knowledgebase/LIVING-PLAN.md`

**Approach:** Mirror the existing `complex scalar equality when imag is zero` test block; import `pyTrue`/`pyFalse`; assert `eq`/`ne` for `(1+0j)`/`True`, `(0+0j)`/`False`, and `(1+2j)` vs `True`.

**Patterns to follow:** `test/cpython-derived/operator-complex-eq-pow.test.ts` (plan 897); bool scalar tests in `operator-complex-scalar.test.ts` (plan 916).

**Test scenarios:**

- Happy path: `eq(pyComplex(1, 0), pyTrue)` and reversed order → `true`; `eq(pyComplex(0, 0), pyFalse)` both orders → `true`.
- Edge case: `ne(pyComplex(1, 2), pyTrue)` → `true`.
- Test expectation: none for runtime — characterization only.

**Verification:** All tests pass; validation-ladder and COMPATIBILITY cite plan 919.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
