---
title: "docs: sync numeric __bool__ evidence"
type: docs
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 339 next steps
---

# Sync int float bool __bool__ evidence (plan 338)

## Summary

Update **COMPATIBILITY §8.15** and **validation-ladder** for explicit `int.__bool__`, `float.__bool__`, and `bool.__bool__` (plan 338).

---

## Requirements

- R1. COMPATIBILITY §8.15: note explicit numeric `__bool__`; cite `int-bool.test.ts`, `float-bool.test.ts`, `bool-bool.test.ts`
- R2. validation-ladder: add rows for the three test files
- R3. LIVING-PLAN delta; `npm test` unchanged (733 tests)

---

## Scope Boundaries

- Docs only — no runtime changes
- PEP 3118 out of scope

---

## Implementation Units

- U1. `docs/COMPATIBILITY_AND_GAPS.md` §8.15 prose + evidence list
- U2. `docs/knowledgebase/50-execution/validation-ladder.md`
- U3. LIVING-PLAN delta; feature branch + PR
