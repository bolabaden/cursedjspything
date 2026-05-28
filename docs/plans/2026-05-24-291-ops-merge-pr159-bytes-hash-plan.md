---
title: "ops: merge PR #159 bytes hash"
type: ops
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-290-feat-bytes-hash-plan.md
---

# Merge PR #159 (plan 290)

## Summary

Land plan 290 on `main`: `bytes.__hash__` — 690 Vitest / 116 files.

---

## Requirements

- R1. PR #159 CI green and `MERGEABLE` before merge
- R2. `gh pr merge 159 --merge` into `main`
- R3. `npm run check && npm test && npm run golden:keys` on `main` after merge (116 files, 690 tests)
- R4. Prepend LIVING-PLAN delta: plan 290 merged via PR #159
- R5. Mark plan 291 `status: completed` on `main`; push `main`

---

## Implementation Units

- U1. Verify PR #159 checks and merge
- U2. Checkout `main`, pull, run validation ladder
- U3. Update LIVING-PLAN delta; commit plan 291 on `main`
- U4. Push `main`
