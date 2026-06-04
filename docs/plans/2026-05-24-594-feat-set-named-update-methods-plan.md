---
title: "feat: set intersection_update / difference_update / symmetric_difference_update (plan 594)"
type: feat
status: completed
date: 2026-05-24
origin: plan 592; §8.15 set method surface gap
---

# Set named inplace algebra update methods

## Brainstorm

| CPython API | pyrt before 594 |
|-------------|-----------------|
| `set.update` | Yes (plan 278) |
| `set.intersection_update` | Missing (`&=` exists via `__iand__`) |
| `set.difference_update` | Missing (`-=`) |
| `set.symmetric_difference_update` | Missing (`^=`) |

Named methods must use **hash+eq** membership (plans 590–592), accept **set/frozenset or iterable** operands like `update`, and mutate in place.

## Summary

Add `intersection_update`, `difference_update`, and `symmetric_difference_update` on `set` with shared operand parsing, `setMemberHas` / `setAddMember` / `setDeleteMember`, Vitest coverage (including equal-key cases), and §8.15 docs sync.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `intersection_update` keeps only elements also in operand |
| R2 | `difference_update` removes elements found in operand |
| R3 | `symmetric_difference_update` toggles membership like `^=` |
| R4 | Operands: set/frozenset or iterable; same TypeError spirit as `update` for bad operands |
| R5 | Hash+eq: `intersection_update({k2})` on `{k1}` when `k1==k2` leaves one member |
| R6 | `set-named-update-methods.test.ts`; COMPATIBILITY §8.15 + validation-ladder |
| R7 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Multiple `*others` varargs; frozenset methods; PEP 3118.

## Implementation Units

### U1. `set.ts` helpers + three methods

Refactor operand → `Set` collector; wire methods.

### U2. Tests + docs

`test/cpython-derived/set-named-update-methods.test.ts`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
