---
title: "docs: sync bytes __reversed__ evidence"
type: docs
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 303 next steps
---

# Sync bytes __reversed__ evidence (plan 302)

## Summary

Update **COMPATIBILITY §8.15** and **validation-ladder** for explicit `bytes.__reversed__` (plan 302).

---

## Problem Frame

Runtime and Vitest landed in plan 302 (`bytes-reversed.test.ts`, 698 tests), but §8.15 and validation-ladder still stop at bytes `__bool__`. Documentation drift understates bytes reverse iteration.

---

## Requirements

- R1. COMPATIBILITY §8.15: note explicit `bytes.__reversed__` via `makeReversedIterator` yielding int 0–255 last-to-first; cite `bytes-reversed.test.ts`
- R2. validation-ladder: add row for `bytes-reversed.test.ts`
- R3. LIVING-PLAN delta; `npm test` unchanged (698 tests)

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

- T1. §8.15 mentions bytes `__reversed__` and `bytes-reversed.test.ts`
- T2. validation-ladder row present
- T3. `npm test` passes
