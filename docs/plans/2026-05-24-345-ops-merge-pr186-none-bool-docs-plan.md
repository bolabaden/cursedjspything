---
title: "ops: merge PR #186 NoneType __bool__ docs"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-344-docs-none-bool-evidence-plan.md
---

# Merge PR #186 (plan 344)

## Summary

Land plan 344 on `main`: COMPATIBILITY §8.15 + validation-ladder sync for `NoneType.__bool__`.

---

## Requirements

- R1. PR #186 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 186 --merge` into `main`
- R3. `npm run check && npm test && npm run golden:keys` on `main` after merge
- R4. Prepend LIVING-PLAN delta: plan 344 merged via PR #186
- R5. Mark plan 345 `status: completed` on `main`; push `main`
