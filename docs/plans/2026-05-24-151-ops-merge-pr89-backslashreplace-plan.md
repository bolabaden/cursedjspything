---
title: "ops: merge PR #89 backslashreplace codec"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-150-feat-backslashreplace-codec-plan.md
---

# Merge PR #89 (plan 150)

## Summary

Land plan 150 on `main`: `errors='backslashreplace'` for str.encode and bytes.decode (463 Vitest / 79 files).

---

## Requirements

- R1. PR #89 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 89 --merge` into `main`
- R3. `npm test` on `main` after merge (79 files, 463 tests)
- R4. Prepend LIVING-PLAN delta: plan 150 merged via PR #89; no open PRs
- R5. Mark plan 151 `status: completed` on `main`; push `main`

---

## Implementation Units

- U1. Verify PR #89 checks and merge
- U2. Checkout `main`, pull, run `npm test`
- U3. Update LIVING-PLAN delta; commit plan 151 on `main`
- U4. Push `main`
