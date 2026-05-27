---
title: "docs: archive pre–plan 081 LIVING-PLAN deltas"
type: docs
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 085 next steps
---

# Archive pre–plan 081 LIVING-PLAN deltas

## Summary

Move 67 historical delta blocks (plan 074 and older) from `LIVING-PLAN.md` into `LIVING-PLAN-ARCHIVE.md`. Keep the active file focused on plans 081–085 and current objective.

---

## Problem Frame

LIVING-PLAN exceeds 1200 lines with 73 delta blocks. Post–queue-merge maintenance (plans 082–085) is complete; older deltas are historical audit trail but clutter the active handoff surface.

---

## Requirements

- R1. Create `docs/knowledgebase/LIVING-PLAN-ARCHIVE.md` with archived deltas (plan 074 → 2026-05-19)
- R2. Trim `LIVING-PLAN.md` to header, current objective, active deltas (plans 081–085), archive pointer, superseded guidance
- R3. Prepend LIVING-PLAN delta for plan 086
- R4. `npm test` unchanged (309 tests)

---

## Scope Boundaries

- Docs only — preserve archived content verbatim (no rewriting historical bullets)
- Do not delete archive content

---

## Implementation Units

- U1. Split LIVING-PLAN at plan 081 / plan 074 boundary
- U2. Add archive pointer and plan 086 delta
- U3. Feature branch + PR

---

## Test Scenarios

- T1. Active LIVING-PLAN contains plans 081–085 only (no plan 074 header)
- T2. Archive file contains plan 074 delta
- T3. `npm test` passes
