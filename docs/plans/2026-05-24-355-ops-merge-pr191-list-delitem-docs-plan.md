---
title: "ops: merge PR #191 list delItem §8.17 docs"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-354-docs-list-delitem-817-plan.md
---

# Merge PR #191 (plan 354)

## Summary

Land plan 354 on `main`: COMPATIBILITY §8.17 + validation-ladder sync for list `delItem` messages.

---

## Requirements

- R1. PR #191 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 191 --merge` into `main`
- R3. `npm run check && npm test && npm run golden:keys` on `main` after merge
- R4. Prepend LIVING-PLAN delta: plan 354 merged via PR #191
- R5. Mark plan 355 `status: completed` on `main`; push `main`
