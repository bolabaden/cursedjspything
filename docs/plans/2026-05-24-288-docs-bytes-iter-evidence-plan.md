---
title: "docs: sync bytes __iter__ evidence"
type: docs
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 287 next steps
---

# Sync bytes __iter__ evidence (plan 286)

## Summary

Update **COMPATIBILITY §8.15** and **validation-ladder** for `bytes.__iter__` yielding int elements (plan 286).

---

## Problem Frame

Runtime and Vitest landed in plan 286 (`bytes-iter.test.ts`, 686 tests), but §8.15 and validation-ladder still stop before bytes iteration. Documentation drift understates the completed bytes iter surface.

---

## Requirements

- R1. COMPATIBILITY §8.15: note `bytes.__iter__` via `makeSequenceIterator` yielding int 0–255; cite `bytes-iter.test.ts`
- R2. validation-ladder: add row for `bytes-iter.test.ts`
- R3. LIVING-PLAN delta; `npm test` unchanged (686 tests)

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

- T1. §8.15 mentions bytes `__iter__` and `bytes-iter.test.ts`
- T2. validation-ladder row present
- T3. `npm test` passes
