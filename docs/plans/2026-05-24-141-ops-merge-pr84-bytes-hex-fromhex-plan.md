---
title: "ops: merge PR #84 bytes hex fromhex"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-140-feat-bytes-hex-fromhex-plan.md
---

# Merge PR #84 (plan 140)

## Summary

Land plan 140 on `main`: `bytes.hex` / `bytes.fromhex` (448 Vitest / 76 files).

---

## Requirements

- R1. PR #84 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 84 --merge` into `main`
- R3. `npm test` on `main` after merge (76 files, 448 tests)
- R4. Prepend LIVING-PLAN delta: plan 140 merged via PR #84; no open PRs
- R5. Mark plan 141 `status: completed` on `main`; push `main`

---

## Implementation Units

- U1. Verify PR #84 checks and merge
- U2. Checkout `main`, pull, run `npm test`
- U3. Update LIVING-PLAN delta; commit plan 141 on `main`
- U4. Push `main`
