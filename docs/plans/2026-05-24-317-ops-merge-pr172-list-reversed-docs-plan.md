---
title: "ops: merge PR #172 list __reversed__ docs"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-316-docs-list-reversed-evidence-plan.md
---

# Merge PR #172 (plan 316)

## Summary

Land plan 316 docs sync on `main`: COMPATIBILITY §8.15 + validation-ladder for `list.__reversed__` — 707 Vitest / 122 files.

---

## Requirements

- R1. PR #172 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 172 --merge` into `main`
- R3. `npm run check && npm test && npm run golden:keys` on `main` after merge (122 files, 707 tests)
- R4. Prepend LIVING-PLAN delta: plan 316 merged via PR #172
- R5. Mark plan 317 `status: completed` on `main`; push `main`

---

## Implementation Units

- U1. Verify PR #172 checks and merge
- U2. Checkout `main`, pull, run validation ladder
- U3. Update LIVING-PLAN delta; commit plan 317 on `main`
- U4. Push `main`
