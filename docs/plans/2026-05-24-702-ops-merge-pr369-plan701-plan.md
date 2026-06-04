---
title: "ops: merge PR #369 plan 701 list isub (plan 702)"
type: ops
status: completed
date: 2026-05-24
origin: plan 701; open PR #369
---

# Ops: plan 701 merged + LIVING-PLAN handoff

## Summary

Squash-merge PR #369 (`list -= list` evidence, plan 701) onto `main`, then record the merge in **LIVING-PLAN** and align §8.6 canonical table prose if the merged branch left `sequence-sub.test.ts` row underspecified.

---

## Problem Frame

Plan 701 is implemented on `feat/plan-701-sequence-isub-list-list` with green CI (PR #369). `main` is still at plan 700 (PR #368). Ops handoff keeps one authoritative merge record and consistent KB Vitest counts (**1192** / **163**).

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Merge PR #369 when all checks pass |
| R2 | `LIVING-PLAN.md` 3-delta: plan 701 merged via PR #369; next steps unchanged (§8.15 when scoped; PEP 3118 out of scope) |
| R3 | §8.6 `COMPATIBILITY_AND_GAPS.md` canonical table row for `sequence-sub.test.ts` mentions list **`-=`** same-type reject (plan 701) |
| R4 | Confirm KB count rows already at 1192 / 163; fix any stale counts only |
| R5 | Mark this plan and plan 701 `status: completed` |
| R6 | `npm run check && npm test && npm run golden:keys` on `main` after merge |

---

## Scope Boundaries

- Docs + merge only; no runtime changes
- Do not commit `node_modules/` vitest cache

---

## Implementation Units

- U1. Merge PR #369 via `gh pr merge`
- U2. `docs/knowledgebase/LIVING-PLAN.md`
- U3. `docs/COMPATIBILITY_AND_GAPS.md` (canonical table only if needed)
- U4. Plan file status fields

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
