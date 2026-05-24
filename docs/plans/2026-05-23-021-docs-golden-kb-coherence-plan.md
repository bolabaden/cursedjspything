---
title: "docs: golden harness KB coherence after builder refactors"
type: refactor
status: in_progress
date: 2026-05-23
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Golden harness KB coherence after builder refactors

## Summary

Align knowledgebase and runbook docs with plans 019/020 (shared `version_gte` / `versionGte` and `owner_with_instance_attr` / `ownerWithInstanceAttr` helpers in both golden builders), then merge PR #18.

---

## Problem Frame

Plans 019/020 landed symmetric helpers in `pyrt-cases.ts` and `cases.py`. Before this plan, KB runbooks described only the dual-file edit workflow without the shared helper pattern.

---

## Requirements

- R1. `validation-ladder.md` L3b documents symmetric helpers and when to extend them
- R2. `tier-b-lib-test-reference.md` workflow step 4 references helper pattern for version gates / descriptor fixtures
- R3. `cpython-reference-submodule.md` golden path mentions `pyrt-cases.ts` (not stale `run.ts`-only wording)
- R4. LIVING-PLAN delta: PR #18 merged; next = Tier B cherry-pick or runtime gap
- R5. Squash-merge PR #18 when CI green

---

## Scope Boundaries

- Docs/KB only (no golden output or runtime behavior changes)
- No new golden keys

---

## Implementation Units

- U1. KB doc coherence updates (R1–R3)
- U2. LIVING-PLAN delta + merge PR #18 (R4–R5)

---

## Test Scenarios

- T1. No test changes; `npm run check` still passes if touched TS comments only
- T2. Doc links and terminology consistent across updated KB files

---

## Sources & References

- `docs/plans/2026-05-23-019-refactor-golden-pyrt-cases-simplify-plan.md`
- `docs/plans/2026-05-23-020-refactor-golden-cases-py-simplify-plan.md`
- `scripts/golden/pyrt-cases.ts`, `scripts/golden/cases.py`
