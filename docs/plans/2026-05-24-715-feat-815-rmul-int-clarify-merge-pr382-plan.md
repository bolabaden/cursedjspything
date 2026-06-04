---
title: "feat: §8.15 __rmul__ int clarify + merge PR #382 (plan 715)"
type: feat
status: completed
date: 2026-05-24
origin: plans 705/707/709; open PR #382
---

# §8.15 sequence __rmul__ int clarify + ops handoff

## Summary

Squash-merge PR #382 (plan 714). Fix §8.15 line that implies plain **`int`** works on **`__rmul__`** for sequences — **`__mul__`** accepts int/bool repeat counts; separate **`__rmul__`** rejects plain **`int`** on str/bytes/list/tuple (plans 705/707/709). LIVING-PLAN deltas.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Merge PR #382 when green |
| R2 | `COMPATIBILITY_AND_GAPS.md` §8.15 `sequenceRepeatCount` sentence: split __mul__ vs __rmul__ int behavior |
| R3 | LIVING-PLAN: plan 714 merge + plan 715 landed |
| R4 | `npm run check && npm test && npm run golden:keys` |

---

## Scope Boundaries

- Docs + merge only

---

## Implementation Units

- U0. Merge PR #382
- U1. `docs/COMPATIBILITY_AND_GAPS.md` §8.15
- U2. `docs/knowledgebase/LIVING-PLAN.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
