---
title: "ops: merge PR #90 surrogateescape codec"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-152-feat-surrogateescape-codec-plan.md
---

# Merge PR #90 (plan 152)

## Summary

Land plan 152 on `main`: `errors='surrogateescape'` for str.encode and bytes.decode (466 Vitest / 79 files).

---

## Requirements

- R1. PR #90 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 90 --merge` into `main`
- R3. `npm test` on `main` after merge (79 files, 466 tests)
- R4. Prepend LIVING-PLAN delta: plan 152 merged via PR #90; no open PRs
- R5. Mark plan 153 `status: completed` on `main`; push `main`

---

## Implementation Units

- U1. Verify PR #90 checks and merge
- U2. Checkout `main`, pull, run `npm test`
- U3. Update LIVING-PLAN delta; commit plan 153 on `main`
- U4. Push `main`
