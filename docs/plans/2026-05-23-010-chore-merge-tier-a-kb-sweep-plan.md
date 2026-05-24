---
title: "chore: merge Tier A integration and refresh KB doc paths"
type: chore
status: completed
date: 2026-05-23
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Merge Tier A integration + KB doc sweep

## Summary

Merge PR #9 (`feat/tier-a-integration`) to `main` now that CI is green, close superseded open PRs, and refresh stale knowledgebase paths/counts (especially `repo-signals.md` and `runtime-overview.md`).

---

## Problem Frame

LIVING-PLAN next step is merging the integration branch. KB meta docs still cite pre-Tier-A test counts and missing CI/golden claims; `operators.ts` flat-file references were already migrated but repo signals drifted.

---

## Requirements

- R1. Refresh `docs/knowledgebase/90-meta/repo-signals.md` test counts, CI/golden status, cpython-derived map
- R2. Refresh `docs/knowledgebase/10-architecture-runtime/runtime-overview.md` test section + golden mention
- R3. Update LIVING-PLAN delta: integration merged, superseded PRs closed
- R4. Merge PR #9 to `main` (squash)
- R5. Close superseded PRs #3, #5, #6, #7, #8

---

## Scope Boundaries

- Docs + merge housekeeping only
- No runtime code changes
- Do not delete remote feature branches

---

## Implementation Units

- U1. KB doc updates on `feat/tier-a-integration`
- U2. `gh pr merge 9 --squash`
- U3. Close duplicate PRs with superseded comment

---

## Test Scenarios

- T1. Local `npm test` still 174 pass before merge
- T2. Post-merge `origin/main` includes golden key-parity + cpython-derived suite

---

## Sources & References

- PR #9 CI (all green)
- `docs/knowledgebase/LIVING-PLAN.md`
