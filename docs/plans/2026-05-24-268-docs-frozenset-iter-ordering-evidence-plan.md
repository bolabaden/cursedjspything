---
title: "docs: sync frozenset iter and ordering evidence"
type: docs
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 267 next steps
---

# Sync frozenset iter/ordering evidence (plans 264–266)

## Summary

Update **COMPATIBILITY §8.15** and **validation-ladder** for `frozenset.__iter__` (plan 264) and frozenset ordering comparisons (plan 266).

---

## Problem Frame

Hash/algebra frozenset docs synced in plan 262, but iter (264) and ordering (266) lack COMPATIBILITY and ladder coverage. LIVING-PLAN calls this out explicitly.

---

## Requirements

- R1. COMPATIBILITY §8.15: note frozenset `__iter__` and ordering (`<=`, `<`, `>=`, `>`) with cross-type set; cite `frozenset-iter.test.ts`, `frozenset-set-ordering.test.ts`
- R2. validation-ladder: add rows for both test files
- R3. LIVING-PLAN delta; `npm test` unchanged (666 tests)

---

## Scope Boundaries

- Docs only — no runtime changes
- PEP 3118 out of scope

---

## Implementation Units

- U1. `docs/COMPATIBILITY_AND_GAPS.md` §8.15
- U2. `docs/knowledgebase/50-execution/validation-ladder.md`
- U3. LIVING-PLAN delta; feature branch + PR

---

## Test Scenarios

- T1. §8.15 mentions iter/ordering and new evidence files
- T2. validation-ladder rows present
- T3. `npm test` passes
