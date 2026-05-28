---
title: "docs: sync str __reversed__ evidence"
type: docs
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 307 next steps
---

# Sync str __reversed__ evidence (plan 306)

## Summary

Update **COMPATIBILITY §8.15** and **validation-ladder** for explicit `str.__reversed__` (plan 306).

---

## Problem Frame

Runtime and Vitest landed in plan 306 (`str-reversed.test.ts`, 701 tests), but §8.15 and validation-ladder still stop before str reverse iteration. Documentation drift understates str reversible protocol coverage.

---

## Requirements

- R1. COMPATIBILITY §8.15: note explicit `str.__reversed__` via `makeReversedIterator` yielding one-char strings last-to-first; cite `str-reversed.test.ts`
- R2. validation-ladder: add row for `str-reversed.test.ts`
- R3. LIVING-PLAN delta; `npm test` unchanged (701 tests)

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

- T1. §8.15 mentions str `__reversed__` and `str-reversed.test.ts`
- T2. validation-ladder row present
- T3. `npm test` passes
