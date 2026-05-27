---
title: "ops: merge PR #74 bytes replace"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-120-feat-bytes-replace-plan.md
---

# Merge PR #74 (plan 120)

## Summary

Land plan 120 on `main`: `bytes.replace` (417 Vitest / 66 files).

---

## Requirements

- R1. PR #74 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 74 --merge` into `main`
- R3. `npm test` on `main` after merge (66 files, 417 tests)
- R4. Prepend LIVING-PLAN delta: plan 120 merged via PR #74; no open PRs
- R5. Mark plan 121 `status: completed` on `main`; push `main`

---

## Implementation Units

- U1. Verify PR #74 checks and merge
- U2. Checkout `main`, pull, run `npm test`
- U3. Update LIVING-PLAN delta; commit plan 121 on `main`
- U4. Push `main`
