---
title: "feat: set inplace ops hash+eq evidence (plan 616)"
type: feat
status: completed
date: 2026-05-24
origin: plan 614; §8.15 gap
---

# set inplace |= &= -= ^= hash+eq evidence

## Summary

Extend **`set-frozenset-inplace.test.ts`** with equal-but-distinct key cases for **`ior`**, **`iand`**, **`isub`**, **`ixor`** with frozenset/set rhs. Complements **`set-membership.test.ts`** (set-only rhs for `&=`/`-=`). Docs sync §8.5 / §8.15.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `ior` dedupes equal keys when merging frozenset rhs |
| R2 | `iand` / `isub` find members via hash+eq with frozenset rhs |
| R3 | `ixor` toggles membership by hash+eq with frozenset rhs |
| R4 | Docs + validation-ladder updated |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.

## Implementation Units

### U1. `test/cpython-derived/set-frozenset-inplace.test.ts`

### U2. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
