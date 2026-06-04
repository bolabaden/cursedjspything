---
title: "feat: list/tuple __sub__ dict reject evidence (plan 700)"
type: feat
status: completed
date: 2026-05-24
origin: plan 699 merge; close sequence-sub container gaps
---

# list/tuple `-` dict reject evidence

## Summary

Add **`sub(list, dict)`** and **`sub(tuple, dict)`** (both orders) `PyTypeError` evidence in **`sequence-sub.test.ts`**. Record plan 699 merge (PR #367).

---

## Problem Frame

Plans 694–699 filled list `-=` and list/tuple cross-type `-` for scalars and sequences. **`list -= dict`** is covered; binary **`list - dict`** and **`tuple - dict`** are not named in §8.6 `sequence-sub` evidence.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `sub(list, dict)` and `sub(dict, list)` raise `PyTypeError` |
| R2 | `sub(tuple, dict)` and `sub(dict, tuple)` raise `PyTypeError` |
| R3 | §8.6 COMPATIBILITY + validation-ladder updated |
| R4 | LIVING-PLAN: plan 699 merge PR #367; plan 700 delta with Vitest count |
| R5 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

- Tests + docs only

---

## Implementation Units

- U1. `test/cpython-derived/sequence-sub.test.ts`
- U2. `docs/COMPATIBILITY_AND_GAPS.md`, `validation-ladder.md`, `LIVING-PLAN.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
