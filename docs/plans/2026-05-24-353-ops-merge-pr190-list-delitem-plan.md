---
title: "ops: merge PR #190 list delItem §8.17 evidence"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-352-feat-list-delitem-index-evidence-plan.md
---

# Merge PR #190 (plan 352)

## Summary

Land plan 352 on `main`: list `delItem` §8.17 Vitest in `sequence-index-type.test.ts` — 743 Vitest / 133 files.

---

## Requirements

- R1. PR #190 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 190 --merge` into `main`
- R3. `npm run check && npm test && npm run golden:keys` on `main` after merge
- R4. Prepend LIVING-PLAN delta: plan 352 merged via PR #190
- R5. Mark plan 353 `status: completed` on `main`; push `main`
