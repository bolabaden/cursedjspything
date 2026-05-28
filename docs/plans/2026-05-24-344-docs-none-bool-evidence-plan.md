---
title: "docs: sync NoneType __bool__ evidence"
type: docs
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 343 next steps
---

# Sync NoneType __bool__ evidence (plan 342)

## Summary

Update **COMPATIBILITY §8.15** and **validation-ladder** for explicit `NoneType.__bool__` (plan 342).

---

## Requirements

- R1. COMPATIBILITY §8.15: note explicit `NoneType.__bool__` (always falsy); cite `none-bool.test.ts`
- R2. validation-ladder: add row for `none-bool.test.ts`
- R3. LIVING-PLAN delta; `npm test` unchanged (734 tests)

---

## Scope Boundaries

- Docs only — no runtime changes
- PEP 3118 out of scope

---

## Implementation Units

- U1. `docs/COMPATIBILITY_AND_GAPS.md` §8.15 prose + evidence list
- U2. `docs/knowledgebase/50-execution/validation-ladder.md`
- U3. LIVING-PLAN delta; feature branch + PR
