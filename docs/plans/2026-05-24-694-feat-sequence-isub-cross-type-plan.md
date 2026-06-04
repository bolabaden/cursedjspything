---
title: "feat: list cross-type isub TypeError evidence (plan 694)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md; post plan 693 merge
---

# list cross-type `-=` / `__isub__` evidence

## Summary

Extend **`sequence-sub.test.ts`** with CPython-derived **`list -=`** rejects for **int**, **str**, and **tuple** operands via `isub()`. Fix duplicate LIVING-PLAN deltas and record plan 693 merge.

---

## Problem Frame

Plan 680 locked **`list - list`** in `sequence-sub.test.ts`. Cross-type **`list -=`** mismatches are not named in §8.6 evidence (scalar/container inplace rejects live in `operator-inplace-cross-type.test.ts` for `iadd` only). LIVING-PLAN has duplicate plan 692 merge blocks and no plan 693 merge entry.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `isub(list, int)`, `isub(list, str)`, `isub(list, tuple)` raise `PyTypeError` with CPython-style `-=` messages |
| R2 | §8.6 COMPATIBILITY prose cites `sequence-sub.test.ts` for list `__sub__` / `-=` rejects |
| R3 | validation-ladder row for `sequence-sub.test.ts` updated |
| R4 | LIVING-PLAN: prepend plan 693 merge delta; remove duplicate plan 692 merge blocks |
| R5 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

### In scope

- Vitest + docs only

### Outside scope

- Runtime changes unless tests expose a bug
- Tuple `__isub__` (immutable)
- `list -= list` (falls through to `sub`; already covered as binary `sub`)

---

## Implementation Units

- U1. `test/cpython-derived/sequence-sub.test.ts`
- U2. `docs/COMPATIBILITY_AND_GAPS.md` §8.6
- U3. `docs/knowledgebase/50-execution/validation-ladder.md`
- U4. `docs/knowledgebase/LIVING-PLAN.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
