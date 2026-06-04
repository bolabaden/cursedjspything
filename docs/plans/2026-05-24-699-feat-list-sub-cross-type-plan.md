---
title: "feat: list cross-type __sub__ reject evidence (plan 699)"
type: feat
status: completed
date: 2026-05-24
origin: plan 698 merge; complete sequence-sub vs sequence-add
---

# list cross-type `-` reject evidence

## Summary

Extend **`sequence-sub.test.ts`** with list↔tuple/int/str/bytes/float/bool **binary `-`** rejects (plan 680 had list−list only; 694–698 covered `-=`). Record plan 698 merge (PR #366).

---

## Problem Frame

`sequence-add.test.ts` documents list cross-type `+` rejects; `sequence-sub.test.ts` documents list `-=` but not list **`-`** against non-list operands except list−list.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `sub(list, …)` cross-type rejects mirror `sequence-add` list `+` pairs |
| R2 | §8.6 COMPATIBILITY + validation-ladder updated |
| R3 | LIVING-PLAN: plan 698 merge PR #366; plan 699 delta with Vitest count |
| R4 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

- Tests + docs only
- No `list - dict` unless runtime matches CPython (defer if absent)

---

## Implementation Units

- U1. `test/cpython-derived/sequence-sub.test.ts`
- U2. `docs/COMPATIBILITY_AND_GAPS.md`, `validation-ladder.md`, `LIVING-PLAN.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
