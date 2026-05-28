---
title: "ops: merge PR #133 None format"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-238-feat-none-format-plan.md
---

# Merge PR #133 (plan 238)

## Summary

Land plan 238 on `main`: `NoneType.__format__` empty-spec parity — 633 Vitest / 105 files.

---

## Requirements

- R1. PR #133 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 133 --merge` into `main`
- R3. `npm run check && npm test && npm run golden:keys` on `main` after merge (105 files, 633 tests)
- R4. Prepend LIVING-PLAN delta: plan 238 merged via PR #133
- R5. Mark plan 239 `status: completed` on `main`; push `main`

---

## Implementation Units

- U1. Verify PR #133 checks and merge
- U2. Checkout `main`, pull, run validation ladder
- U3. Update LIVING-PLAN delta; commit plan 239 on `main`
- U4. Push `main`
