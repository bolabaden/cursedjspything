---
title: "ops: merge PR #175 tuple __bool__ evidence"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-322-feat-tuple-bool-evidence-plan.md
---

# Merge PR #175 (plan 322)

## Summary

Land plan 322 on `main`: `tuple-bool.test.ts` Vitest evidence for existing `Slot.bool` — 713 Vitest / 124 files.

---

## Requirements

- R1. PR #175 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 175 --merge` into `main`
- R3. `npm run check && npm test && npm run golden:keys` on `main` after merge (124 files, 713 tests)
- R4. Prepend LIVING-PLAN delta: plan 322 merged via PR #175
- R5. Mark plan 323 `status: completed` on `main`; push `main`

---

## Implementation Units

- U1. Verify PR #175 checks and merge
- U2. Checkout `main`, pull, run validation ladder
- U3. Update LIVING-PLAN delta; commit plan 323 on `main`
- U4. Push `main`
