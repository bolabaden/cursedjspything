---
title: "feat: list isub bytes/float/bool rejects (plan 695)"
type: feat
status: completed
date: 2026-05-24
origin: plan 694; mirror sequence-iadd scalar rejects
---

# list `-=` scalar operand rejects

## Summary

Extend **`sequence-sub.test.ts`** with **`list -=`** rejects for **bytes**, **float**, and **bool** (plan 694 covered int/str/tuple). Record plan 694 merge (PR #362) in LIVING-PLAN.

---

## Problem Frame

Plan 694 colocated list cross-type `-=` for int/str/tuple. **`sequence-iadd.test.ts`** already rejects list↔bytes/float/bool for `+=`; the same scalar gaps for `-=` are not named in §8.6 `sequence-sub` evidence.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `isub(list, bytes)`, `isub(list, float)`, `isub(list, bool)` raise `PyTypeError` with `-=` messages; list unchanged (`len` check) |
| R2 | §8.6 COMPATIBILITY + validation-ladder cite bytes/float/bool `-=` in `sequence-sub.test.ts` |
| R3 | LIVING-PLAN: plan 694 merge PR #362 delta; plan 695 delta |
| R4 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

- Tests + docs only
- No `list -= list` (binary `sub` path; plan 680)

---

## Implementation Units

- U1. `test/cpython-derived/sequence-sub.test.ts`
- U2. `docs/COMPATIBILITY_AND_GAPS.md`, `validation-ladder.md`
- U3. `docs/knowledgebase/LIVING-PLAN.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
