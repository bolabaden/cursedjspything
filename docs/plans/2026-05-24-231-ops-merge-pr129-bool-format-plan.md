---
title: "ops: merge PR #129 bool format"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-230-feat-bool-format-plan.md
---

# Merge PR #129 (plan 230)

## Summary

Land plan 230 on `main`: `bool.__format__` with int delegation — 628 Vitest / 105 files.

---

## Requirements

- R1. PR #129 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 129 --merge` into `main`
- R3. `npm run check && npm test && npm run golden:keys` on `main` after merge (105 files, 628 tests)
- R4. Prepend LIVING-PLAN delta: plan 230 merged via PR #129
- R5. Mark plan 231 `status: completed` on `main`; push `main`

---

## Implementation Units

- U1. Verify PR #129 checks and merge
- U2. Checkout `main`, pull, run validation ladder
- U3. Update LIVING-PLAN delta; commit plan 231 on `main`
- U4. Push `main`
