---
title: "ops: merge PR #124 int format g/G/%"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-220-feat-int-format-g-percent-plan.md
---

# Merge PR #124 (plan 220)

## Summary

Land plan 220 on `main`: int general and percent format codes (`g`, `G`, `%`) — 622 Vitest / 105 files.

---

## Requirements

- R1. PR #124 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 124 --merge` into `main`
- R3. `npm run check && npm test && npm run golden:keys` on `main` after merge (105 files, 622 tests)
- R4. Prepend LIVING-PLAN delta: plan 220 merged via PR #124; int format stack complete for deferred g/G/%
- R5. Mark plan 221 `status: completed` on `main`; push `main`

---

## Implementation Units

- U1. Verify PR #124 checks and merge
- U2. Checkout `main`, pull, run validation ladder
- U3. Update LIVING-PLAN delta; commit plan 221 on `main`
- U4. Push `main`
