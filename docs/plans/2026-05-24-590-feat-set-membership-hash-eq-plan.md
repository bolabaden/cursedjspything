---
title: "feat: set/frozenset membership by hash+eq (plan 590)"
type: feat
status: active
date: 2026-05-24
origin: plan 588; exhaustive LFG pass
---

# Set/frozenset membership by hash+eq

## Brainstorm

| Finding | CPython | pyrt before |
|---------|---------|-------------|
| `set.remove(k2)` when `k1` in set and `k1 == k2` | Removes | `KeyError` (JS `Set` identity) |
| `pySet([k1, k2])` with `k1 == k2` | len 1 | len 2 |
| `__contains__`, `discard`, inplace ops, algebra | hash+eq | `.has()` identity |

Plans 580–584 added **hashability** checks but not **equality-based** lookup. Dict already uses `dictFindKey`; set/frozenset need the same model.

## Summary

Introduce `set-membership.ts` (`setFindMember`, `setAddMember`, `setDeleteMember`, `setMemberHas`) and wire set/frozenset contains, mutation, constructors, algebra, and ordering to hash+eq membership.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `contains(set, k2)` true when `k1` stored and `k1 == k2` (custom eq+hash keys) |
| R2 | `remove`/`discard` find members by eq, not only identity |
| R3 | `pySet([k1,k2])` and `pyFrozenSet([k1,k2])` dedupe equal keys → len 1 |
| R4 | `add` does not duplicate equal keys |
| R5 | `set-algebra.ts` and `set-ordering.ts` use hash+eq membership |
| R6 | `set-membership.test.ts` + extend `set-mutation.test.ts`; §8.5/8.6 docs; validation-ladder |
| R7 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Full CPython set table (open addressing); PEP 3118.

## Implementation Units

### U1. `set-membership.ts` + runtime wiring

`set.ts`, `frozenset.ts`, `set-algebra.ts`, `set-ordering.ts`

### U2. Tests + docs

`test/cpython-derived/set-membership.test.ts`, `set-mutation.test.ts`, `COMPATIBILITY_AND_GAPS.md`, `validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```

## Review checklist

- [ ] Inplace `|=`, `&=`, `-=`, `^=` use membership helpers
- [ ] `update`/`setAddMember` dedupe on equal keys
- [ ] Frozenset `__contains__` aligned with set
