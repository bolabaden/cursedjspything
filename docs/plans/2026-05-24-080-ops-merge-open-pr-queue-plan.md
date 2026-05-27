---
title: "ops: resolve conflicts and merge open PR queue"
type: ops
status: completed
date: 2026-05-24
---

# Resolve conflicts and merge open PR queue

## Summary

Merge remaining open PRs into `main` in ascending PR-number order after #28 landed.

---

## Requirements

- R1. Process PRs: #29, #31, #35–#46, #49–#53
- R2. Merge `origin/main`, resolve doc conflicts (union LIVING-PLAN deltas), push, `gh pr merge --merge`
- R3. `npm test` before each merge
- R4. Final `npm test` on `main`; queue empty

---

## Implementation Units

- U1. Merge fix PRs #29, #31
- U2. Merge evidence PRs #35–#46
- U3. Merge evidence PRs #49–#53
- U4. Final main verification
