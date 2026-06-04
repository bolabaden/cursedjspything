---
title: "feat: tuple __sub__ reject evidence + parity-gaps sync (plan 697)"
type: feat
status: completed
date: 2026-05-24
origin: plan 696 merge; §8.6 sequence-sub completeness
---

# tuple `-` reject evidence + docs sync

## Summary

Extend **`sequence-sub.test.ts`** with CPython-derived **`tuple.__sub__`** rejects (tuple↔tuple, tuple↔int). Sync **`parity-gaps-priorities.md`** to **1177** Vitest tests. Record plan 696 merge (PR #364) in LIVING-PLAN.

---

## Problem Frame

`sequence-sub.test.ts` only covers **list** `__sub__` / `__isub__`. Tuple subtraction is unsupported in CPython but lacks §8.6 evidence. `parity-gaps-priorities.md` still cites **1170** tests after plans 694–696.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `sub(tuple, tuple)`, `sub(tuple, int)`, `sub(int, tuple)` raise `PyTypeError` |
| R2 | §8.6 COMPATIBILITY table + prose cite tuple `-` in `sequence-sub.test.ts` |
| R3 | validation-ladder row updated |
| R4 | `parity-gaps-priorities.md` verification section → 1179 / 163 |
| R5 | LIVING-PLAN: plan 696 merge PR #364; plan 697 delta |
| R6 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

- Tests + docs only
- No tuple `__isub__` (immutable; no inplace op)

---

## Implementation Units

- U1. `test/cpython-derived/sequence-sub.test.ts`
- U2. `docs/COMPATIBILITY_AND_GAPS.md`, `validation-ladder.md`, `parity-gaps-priorities.md`
- U3. `docs/knowledgebase/LIVING-PLAN.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
