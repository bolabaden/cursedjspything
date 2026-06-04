---
title: "feat: list __isub__ list reject evidence (plan 701)"
type: feat
status: completed
date: 2026-05-24
origin: plan 700 merge PR #368; close list __isub__ matrix
---

# list `__isub__` same-type reject evidence

## Summary

Add **`isub(list, list)`** `PyTypeError` evidence in **`sequence-sub.test.ts`**, completing the list **`-=`** reject matrix alongside existing cross-type cases. Record plan 700 merge (PR #368) in **LIVING-PLAN**.

---

## Problem Frame

Plans 694–700 documented cross-type **`list -= …`** rejects. **`list -= list`** matches CPython **`TypeError`** (same message family as **`list - list`**) but is not named in §8.6 evidence.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `isub(list, list)` raises `PyTypeError` with `-=` message; list unchanged (`len` check) |
| R2 | §8.6 COMPATIBILITY prose mentions list **`-=`** same-type reject |
| R3 | `validation-ladder.md` row for `sequence-sub.test.ts` updated |
| R4 | LIVING-PLAN: plan 700 merge PR #368; plan 701 delta with Vitest count |
| R5 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

- Tests + docs only; no runtime changes expected

---

## Implementation Units

- U1. `test/cpython-derived/sequence-sub.test.ts`
- U2. `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/knowledgebase/LIVING-PLAN.md`
- U3. KB count sync if test count changes: `parity-gaps-priorities.md`, `repo-signals.md`, `runtime-overview.md`

---

## Test Scenarios (U1)

- Two distinct `pyList` instances; `isub(lhs, rhs)` throws `PyTypeError` matching `/unsupported operand type\(s\) for -=: 'list' and 'list'/`
- `len(lhs)` unchanged after failed `isub`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
