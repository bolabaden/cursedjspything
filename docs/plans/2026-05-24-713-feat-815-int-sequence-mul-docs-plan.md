---
title: "feat: §8.15 int*list/tuple mul docs + merge PR #380 (plan 713)"
type: feat
status: completed
date: 2026-05-24
origin: plan 709 runtime; open PR #380
---

# §8.15 int * list/tuple mul evidence sync + ops handoff

## Summary

Squash-merge PR #380 (plan 712 handoff). Plan 709 landed **`int * list`** / **`int * tuple`** rejects in §8.6 only — extend **§8.15** prose to match **`int * str`** / **`int * bytes`** pattern. LIVING-PLAN deltas for plan 712 merge + this slice.

---

## Problem Frame

`COMPATIBILITY_AND_GAPS.md` §8.15 documents **`int * str`** and **`int * bytes`** mul reject paths but omits **`int * list`** / **`int * tuple`** (covered in §8.6 table only). Embedders reading §8.15 miss the unified int-on-reflected-sequence-mul story.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Merge PR #380 when green |
| R2 | §8.15 prose: **`int * list`** / **`int * tuple`** reject; **`list * int`** / **`tuple * int`** repeat; cite `sequence-mul-cross-type.test.ts` plan 709 |
| R3 | `validation-ladder.md` row if sequence-mul cross-type listed |
| R4 | LIVING-PLAN: plan 712 merge via PR #380 + plan 713 landed |
| R5 | `npm run check && npm test && npm run golden:keys` |

---

## Scope Boundaries

- Docs + merge only (runtime already on main via #377)
- No test or runtime changes unless drift found

---

## Implementation Units

- U0. Merge PR #380
- U1. `docs/COMPATIBILITY_AND_GAPS.md` §8.15
- U2. `docs/knowledgebase/50-execution/validation-ladder.md` (if applicable)
- U3. `docs/knowledgebase/LIVING-PLAN.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
