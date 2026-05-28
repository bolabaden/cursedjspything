---
title: "ops: merge PR #189 float divmod §8.17"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-350-fix-float-divmod-zerodivision-plan.md
---

# Merge PR #189 (plan 350)

## Summary

Land plan 350 on `main`: float `__divmod__` + zero-divisor `PyZeroDivisionError` — 740 Vitest / 133 files.

---

## Requirements

- R1. PR #189 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 189 --merge` into `main`
- R3. `npm run check && npm test && npm run golden:keys` on `main` after merge
- R4. Prepend LIVING-PLAN delta: plan 350 merged via PR #189
- R5. Mark plan 351 `status: completed` on `main`; push `main`
