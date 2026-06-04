---
title: "feat: tuple and frozenset __hash__ equal-element evidence (plan 630)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.5 post-628; shift past dict hash+eq stack
---

# tuple and frozenset __hash__ equal-element evidence

## Summary

After dict hash+eq evidence (596–628), extend **hashable builtin** tests so **`tuple.__hash__`** and **`frozenset.__hash__`** are evidenced when elements are equal-but-distinct under rich `eq()` (same `hash()` per key type). Evidence-only.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `hash(pyTuple([k1])) === hash(pyTuple([k2]))` for equal-key pair |
| R2 | `hash(pyFrozenSet([k1])) === hash(pyFrozenSet([k2]))` and order-independent for `{k1,k2}` deduped set |
| R3 | Docs §8.5 tuple/frozenset hash prose + validation-ladder |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- list/dict hash (remain unhashable).

## Implementation Units

### U1. `test/cpython-derived/tuple-hash.test.ts` — equal-key element hash

### U2. `test/cpython-derived/frozenset-hash.test.ts` — equal-key frozenset hash

### U3. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
