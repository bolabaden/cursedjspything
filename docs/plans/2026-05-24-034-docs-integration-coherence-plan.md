---
title: "docs: integration branch docs coherence and superseded PR cleanup"
type: docs
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Integration branch docs coherence

## Summary

Close plan 021 on PR #21 (restore `cpython-reference-submodule` dual-builder wording), refresh compatibility-summary for plans 023–033, and close superseded PRs #19/#20.

---

## Problem Frame

PR #21 superseded PR #19 (plan 021) and PR #20 (plan 022/033) but regressed plan 021 R3 (`pyrt-cases.ts` dropped from contributor bullet). compatibility-summary still describes pre-integration parity state.

---

## Requirements

- R1. `cpython-reference-submodule.md`: restore `cases.py` + `pyrt-cases.ts` in human-review bullet
- R2. `compatibility-summary.md`: bool MRO, str/scalar evidence, sequence exceptions, offline version-gates; Vitest 203
- R3. `parity-gaps-priorities.md` row #10: cite `pyrt-cases-version-gates.test.ts`
- R4. Mark plan 021 `status: completed`
- R5. Close PR #19 and PR #20 with superseded-by-#21 comments
- R6. LIVING-PLAN delta
- R7. `npm run check`, `npm test`

---

## Scope Boundaries

- Docs + PR housekeeping only
- No runtime changes

---

## Implementation Units

- U1. KB doc fixes (R1–R3, R4)
- U2. `gh pr close` for #19, #20 (R5)
- U3. LIVING-PLAN (R6)

---

## Test Scenarios

- N/A docs; L1/L2 unchanged green

---

## Sources & References

- `docs/plans/2026-05-23-021-docs-golden-kb-coherence-plan.md`
- PR #19, #20, #21
