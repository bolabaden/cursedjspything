---
title: "ops: merge PR #174 list __bool__ docs"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-320-docs-list-bool-evidence-plan.md
---

# Merge PR #174 (plan 320)

## Summary

Land plan 320 docs sync on `main`: COMPATIBILITY §8.15 + validation-ladder for `list.__bool__` — 710 Vitest / 123 files.

---

## Requirements

- R1. PR #174 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 174 --merge` into `main`
- R3. `npm run check && npm test && npm run golden:keys` on `main` after merge (123 files, 710 tests)
- R4. Prepend LIVING-PLAN delta: plan 320 merged via PR #174
- R5. Mark plan 321 `status: completed` on `main`; push `main`

---

## Implementation Units

- U1. Verify PR #174 checks and merge
- U2. Checkout `main`, pull, run validation ladder
- U3. Update LIVING-PLAN delta; commit plan 321 on `main`
- U4. Push `main`
