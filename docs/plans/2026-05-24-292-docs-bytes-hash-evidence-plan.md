---
title: "docs: sync bytes __hash__ evidence"
type: docs
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 291 next steps
---

# Sync bytes __hash__ evidence (plan 290)

## Summary

Update **COMPATIBILITY §8.15** and **validation-ladder** for `bytes.__hash__` (plan 290).

---

## Problem Frame

Runtime and Vitest landed in plan 290 (`bytes-hash.test.ts`, 690 tests), but §8.15 and validation-ladder still stop at bytes iteration. Documentation drift understates bytes hashability.

---

## Requirements

- R1. COMPATIBILITY §8.15: note `bytes.__hash__` via 31-polynomial rolling hash on byte values; empty bytes → `0`; cite `bytes-hash.test.ts`
- R2. validation-ladder: add row for `bytes-hash.test.ts`
- R3. LIVING-PLAN delta; `npm test` unchanged (690 tests)

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

- T1. §8.15 mentions bytes `__hash__` and `bytes-hash.test.ts`
- T2. validation-ladder row present
- T3. `npm test` passes
