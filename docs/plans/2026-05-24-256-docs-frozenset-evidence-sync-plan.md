---
title: "docs: sync frozenset evidence after plans 252-254"
type: docs
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 255 next steps
---

# Sync frozenset evidence (plans 252–254)

## Summary

Update **COMPATIBILITY §8.15** and **validation-ladder** to document `frozenset.__format__`, frozenset `str.format` fields, and frozenset↔set cross-type equality landed in plans 252–254.

---

## Problem Frame

Runtime and Vitest include frozenset format (649 tests) and set eq (106 files), but §8.15 still lists format hooks only through `set`. Documentation drift from plan 250 gap called out in LIVING-PLAN.

---

## Requirements

- R1. COMPATIBILITY §8.15: add **frozenset** to format hook list; note frozenset↔set `__eq__`; cite `frozenset-set-eq.test.ts`
- R2. validation-ladder: refresh format rows; add `frozenset-set-eq.test.ts` row
- R3. LIVING-PLAN delta; `npm test` unchanged (649 tests)

---

## Scope Boundaries

- Docs only — no runtime changes
- frozenset hash / set algebra / PEP 3118 out of scope

---

## Implementation Units

- U1. `docs/COMPATIBILITY_AND_GAPS.md` §8.15
- U2. `docs/knowledgebase/50-execution/validation-ladder.md`
- U3. LIVING-PLAN delta; feature branch + PR

---

## Test Scenarios

- T1. §8.15 mentions frozenset format and frozenset-set eq evidence
- T2. validation-ladder rows match test scope
- T3. `npm test` passes
