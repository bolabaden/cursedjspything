---
title: "ops: merge PR #62 bytes decode errors"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-096-feat-bytes-decode-errors-plan.md
---

# Merge PR #62 (plan 096)

## Summary

Land plan 096 on `main`: bytes `decode(..., errors=)` strict/replace/ignore (335 Vitest / 54 files).

---

## Requirements

- R1. PR #62 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 62 --merge` into `main`
- R3. `npm test` on `main` after merge (54 files, 335 tests)
- R4. Prepend LIVING-PLAN delta: plan 096 merged via PR #62; no open PRs
- R5. Mark plan 097 `status: completed` on `main`; push `main`

---

## Implementation Units

- U1. Verify PR #62 checks and merge
- U2. Checkout `main`, pull, run `npm test`
- U3. Update LIVING-PLAN delta; commit plan 097 on `main`
- U4. Push `main`
