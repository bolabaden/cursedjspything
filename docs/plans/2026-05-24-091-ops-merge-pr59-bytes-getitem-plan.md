---
title: "ops: merge PR #59 bytes getitem and rich compare"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-090-feat-bytes-getitem-compare-plan.md
---

# Merge PR #59 (plan 090)

## Summary

Land plan 090 on `main`: bytes `__getitem__` and lexicographic rich compare (320 Vitest / 52 files).

---

## Requirements

- R1. PR #59 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 59 --merge` into `main`
- R3. `npm test` on `main` after merge (52 files, 320 tests)
- R4. Prepend LIVING-PLAN delta: plan 090 merged via PR #59; no open PRs
- R5. Add plan 091 on `main`; mark `status: completed`

---

## Implementation Units

- U1. Verify PR #59 checks and merge
- U2. Checkout `main`, pull, run `npm test`
- U3. Update LIVING-PLAN delta; commit plan 091 on `main`
- U4. Push `main`
