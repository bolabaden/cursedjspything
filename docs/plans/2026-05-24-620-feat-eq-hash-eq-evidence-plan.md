---
title: "feat: dict and set/frozenset __eq__ hash+eq evidence (plan 620)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN; §8.5 / §8.15 post-618
---

# dict and set/frozenset __eq__ hash+eq evidence

## Summary

Add CPython-derived tests proving **`dict.__eq__`**, **set/frozenset cross-type `__eq__`**, and **set `pop`** use hash+eq key matching (equal-but-distinct keys). Evidence-only; runtime already uses `dictFindKey` / `setLikeContentsEqual`. Docs sync §8.5 / §8.15 and validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `dict` equality matches values under equal-but-distinct keys; unequal values or missing keys → false |
| R2 | `set` / `frozenset` cross-type `__eq__` treats equal keys as same element |
| R3 | `set.pop` / `remove` find members by equality (pop returns canonical stored key) |
| R4 | Docs + validation-ladder updated |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- Operator `==` on unrelated types beyond existing coverage.

## Implementation Units

### U1. `test/cpython-derived/dict-eq-hash-eq.test.ts` (new)

### U2. `test/cpython-derived/frozenset-set-eq.test.ts` — equal-key cases

### U3. `test/cpython-derived/set-mutation.test.ts` — `pop` with equal-but-distinct key

### U4. Docs: `COMPATIBILITY_AND_GAPS.md` §8.5, `validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
