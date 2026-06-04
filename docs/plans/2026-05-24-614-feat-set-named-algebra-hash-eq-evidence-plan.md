---
title: "feat: set named algebra hash+eq evidence (plan 614)"
type: feat
status: active
date: 2026-05-24
origin: plan 612; §8.15 gap
---

# set/frozenset named algebra hash+eq evidence

## Summary

Extend **`frozenset-set-named-algebra.test.ts`** with equal-but-distinct key cases for **`union`**, **`intersection`**, **`difference`**, and **`symmetric_difference`**, including cross-type frozenset/set lhs. Complements **`set-algebra-membership.test.ts`** (plan 592). Docs sync §8.5 / §8.15.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `union` dedupes equal keys; preserves lhs type cross-type |
| R2 | `intersection` / `difference` find members by hash+eq cross-type |
| R3 | `symmetric_difference` uses hash+eq cross-type |
| R4 | Docs + validation-ladder updated |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.

## Implementation Units

### U1. `test/cpython-derived/frozenset-set-named-algebra.test.ts`

### U2. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
