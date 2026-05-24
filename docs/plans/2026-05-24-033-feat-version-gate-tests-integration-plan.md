---
title: "test: land version-gate regression tests on integration branch"
type: feat
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-022-feat-golden-version-gate-tests-plan.md
---

# Land version-gate tests on PR #21

## Summary

Cherry-pick plan 022 / PR #20 `pyrt-cases-version-gates.test.ts` onto `feat/int-bool-cross-type` so version-gate coverage ships with the numeric-tower integration branch; sync validation-ladder L2/L3b/L5.

---

## Problem Frame

PR #20 holds version-gate tests separately while PR #21 lacks offline gate-semantics coverage. LIVING-PLAN lists PR #20 merge as pending; landing tests on #21 reduces stacked merge friction.

---

## Requirements

- R1. Add `test/golden/pyrt-cases-version-gates.test.ts` (same as plan 022)
- R2. validation-ladder: L2 row, L3b gate-semantics paragraph, L5 offline-first note
- R3. Update Vitest counts in parity-gaps, runtime-overview, repo-signals (203 tests, 25 files)
- R4. `npm run check`, `npm test`, `npm run golden:keys`
- R5. LIVING-PLAN delta

---

## Scope Boundaries

- Test + docs only
- No golden JSON or builder changes
- PR #20 may be closed as superseded after #21 merges (out of band)

---

## Implementation Units

- U1. Add version-gate test file
- U2. validation-ladder + KB counts
- U3. LIVING-PLAN

---

## Test Scenarios

- T1. Seven version-gate tests pass (3.9–3.14 profiles + descriptor stability)
- T2. Full suite green

---

## Sources & References

- `origin/feat/golden-version-gate-tests`
- `docs/plans/2026-05-24-022-feat-golden-version-gate-tests-plan.md`
