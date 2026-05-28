---
title: "ops: merge PR #139 format evidence docs"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-250-docs-format-evidence-sync-plan.md
---

# Merge PR #139 (plan 250)

## Summary

Land plan 250 on `main`: format evidence docs sync (COMPATIBILITY §8.15 + validation-ladder) — 643 Vitest / 105 files unchanged.

---

## Requirements

- R1. PR #139 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 139 --merge` into `main`
- R3. `npm run check && npm test && npm run golden:keys` on `main` after merge (105 files, 643 tests)
- R4. Prepend LIVING-PLAN delta: plan 250 merged via PR #139
- R5. Mark plan 251 `status: completed` on `main`; push `main`

---

## Implementation Units

- U1. Verify PR #139 checks and merge
- U2. Checkout `main`, pull, run validation ladder
- U3. Update LIVING-PLAN delta; commit plan 251 on `main`
- U4. Push `main`
