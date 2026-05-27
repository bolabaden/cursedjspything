---
title: "ops: merge PR #104 str index"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-180-feat-str-index-plan.md
---

# Merge PR #104 (plan 180)

## Summary

Land plan 180 on `main`: `str.index` / `str.rindex` (537 Vitest / 93 files).

---

## Requirements

- R1. PR #104 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 104 --merge` into `main`
- R3. `npm test` on `main` after merge (93 files, 537 tests)
- R4. Prepend LIVING-PLAN delta: plan 180 merged via PR #104; no open PRs
- R5. Mark plan 181 `status: completed` on `main`; push `main`

---

## Implementation Units

- U1. Verify PR #104 checks and merge
- U2. Checkout `main`, pull, run `npm test`
- U3. Update LIVING-PLAN delta; commit plan 181 on `main`
- U4. Push `main`
