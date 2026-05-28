---
title: "docs: sync set and frozenset __bool__ evidence"
type: docs
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 331 next steps
---

# Sync set and frozenset __bool__ evidence (plan 330)

## Summary

Update **COMPATIBILITY §8.15** and **validation-ladder** for explicit `set.__bool__` and `frozenset.__bool__` (plan 330).

---

## Problem Frame

Runtime and Vitest landed in plan 330 (`set-bool.test.ts`, `frozenset-bool.test.ts`, 722 tests), but §8.15 and validation-ladder document dict/list/tuple/bytes truthiness only. Documentation drift understates set-type `__bool__` coverage.

---

## Requirements

- R1. COMPATIBILITY §8.15: note explicit `set.__bool__` and `frozenset.__bool__`; cite test files
- R2. validation-ladder: add rows for `set-bool.test.ts` and `frozenset-bool.test.ts`
- R3. LIVING-PLAN delta; `npm test` unchanged (722 tests)

---

## Scope Boundaries

- Docs only — no runtime changes
- PEP 3118 out of scope

---

## Implementation Units

- U1. `docs/COMPATIBILITY_AND_GAPS.md` §8.15 prose + evidence list
- U2. `docs/knowledgebase/50-execution/validation-ladder.md`
- U3. LIVING-PLAN delta; feature branch + PR

---

## Test Scenarios

- T1. §8.15 mentions set/frozenset `__bool__` and test files
- T2. validation-ladder rows present
- T3. `npm test` passes
