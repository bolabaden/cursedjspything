---
title: "ops: merge PR #185 NoneType __bool__ evidence"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-342-feat-none-bool-evidence-plan.md
---

# Merge PR #185 (plan 342)

## Summary

Land plan 342 on `main`: `none-bool.test.ts` — 734 Vitest / 132 files.

---

## Requirements

- R1. PR #185 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 185 --merge` into `main`
- R3. `npm run check && npm test && npm run golden:keys` on `main` after merge
- R4. Prepend LIVING-PLAN delta: plan 342 merged via PR #185
- R5. Mark plan 343 `status: completed` on `main`; push `main`
