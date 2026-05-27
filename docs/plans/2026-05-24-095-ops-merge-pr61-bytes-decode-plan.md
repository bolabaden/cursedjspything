---
title: "ops: merge PR #61 bytes decode"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-094-feat-bytes-decode-plan.md
---

# Merge PR #61 (plan 094)

## Summary

Land plan 094 on `main`: bytes `decode()` with UTF-8 default and latin-1 (330 Vitest / 54 files).

---

## Requirements

- R1. PR #61 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 61 --merge` into `main`
- R3. `npm test` on `main` after merge (54 files, 330 tests)
- R4. Prepend LIVING-PLAN delta: plan 094 merged via PR #61; no open PRs
- R5. Mark plan 095 `status: completed` on `main`; push `main`

---

## Implementation Units

- U1. Verify PR #61 checks and merge
- U2. Checkout `main`, pull, run `npm test`
- U3. Update LIVING-PLAN delta; commit plan 095 on `main`
- U4. Push `main`
