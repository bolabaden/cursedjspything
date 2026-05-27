---
title: "ops: merge PR #91 str upper lower"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-154-feat-str-upper-lower-plan.md
---

# Merge PR #91 (plan 154)

## Summary

Land plan 154 on `main`: `str.upper` / `str.lower` (469 Vitest / 80 files).

---

## Requirements

- R1. PR #91 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 91 --merge` into `main`
- R3. `npm test` on `main` after merge (80 files, 469 tests)
- R4. Prepend LIVING-PLAN delta: plan 154 merged via PR #91; no open PRs
- R5. Mark plan 155 `status: completed` on `main`; push `main`

---

## Implementation Units

- U1. Verify PR #91 checks and merge
- U2. Checkout `main`, pull, run `npm test`
- U3. Update LIVING-PLAN delta; commit plan 155 on `main`
- U4. Push `main`
