---
title: "docs: prune stale LIVING-PLAN partials after queue merge"
type: docs
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 081 next steps
---

# Prune stale LIVING-PLAN partials

## Summary

After plan 080 merged the open PR queue, 23 historical LIVING-PLAN delta blocks still claim `[OPEN] PRs #… still open`. Replace those stale partials with a superseded note, remove orphaned duplicate next-step lines, and mark landed ops/feat plans `status: completed`.

---

## Problem Frame

LIVING-PLAN is the active implementation authority but historical deltas misstate repo state (open PRs that are merged). This blocks accurate autopilot handoff and duplicates misleading `[OPEN]` markers across 69 delta blocks.

---

## Requirements

- R1. Replace every `### Partial` block whose bullets contain `[OPEN] PRs` with a single superseded note referencing plan 080
- R2. Remove orphaned duplicate `### Next` fragments between delta blocks (merge artifacts)
- R3. Set `status: completed` on ops/feat plans in `docs/plans/` that are landed on `main` but still `status: active` (036–047 batch)
- R4. Prepend LIVING-PLAN delta for plan 082; update plan 082 to `completed`
- R5. `npm test` unchanged (309 tests)

---

## Scope Boundaries

- Docs only — no runtime or test changes
- Do not rewrite historical `### Landed` bullets; only fix stale partials and plan frontmatter

---

## Implementation Units

- U1. **LIVING-PLAN** — supersede stale partials; fix orphan lines; prepend plan 082 delta
- U2. **Plan frontmatter** — mark completed for landed 036–047 plans still `active`
- U3. **Verification** — `npm test`; commit on feature branch; open PR

---

## Test Scenarios

- T1. `rg '\[OPEN\] PRs'` on LIVING-PLAN returns zero matches
- T2. `rg 'status: active' docs/plans/2026-05-24-03[6-9]` and `04[0-7]` returns zero (those plans completed)
- T3. `npm test` passes
