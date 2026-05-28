---
title: "docs: sync list __reversed__ evidence"
type: docs
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 315 next steps
---

# Sync list __reversed__ evidence (plan 314)

## Summary

Update **COMPATIBILITY §8.15** and **validation-ladder** for explicit `list.__reversed__` (`list_reverseiterator`; plan 314).

---

## Problem Frame

Runtime and Vitest landed in plan 314 (`list-reversed.test.ts`, 707 tests), but §8.15 and validation-ladder document str, tuple, and bytes reverse iteration only. Documentation drift understates list reversible protocol coverage.

---

## Requirements

- R1. COMPATIBILITY §8.15: note explicit `list.__reversed__` via `list_reverseiterator` yielding elements last-to-first; cite `list-reversed.test.ts`
- R2. validation-ladder: add row for `list-reversed.test.ts`
- R3. LIVING-PLAN delta; `npm test` unchanged (707 tests)

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

- T1. §8.15 mentions list `__reversed__` and `list-reversed.test.ts`
- T2. validation-ladder row present
- T3. `npm test` passes
