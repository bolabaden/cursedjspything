---
title: "feat: dict __contains__ and subscript hash+eq evidence (plan 628)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.5 post-626
---

# dict __contains__ and __getitem__ hash+eq evidence

## Summary

Lock CPython parity for **`dict.__contains__`** (`in` / `contains()`) and **`__getitem__`** (`getItem`) with equal-but-distinct keys via `dictHas` / `dictGet`. Complements get/setdefault/pop/eq/ne/view tests. Evidence-only.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `contains(dict, equal_key)` true when stored under distinct equal key |
| R2 | `getItem(dict, equal_key)` returns mapped value |
| R3 | Both false / KeyError-appropriate absence for unrelated keys |
| R4 | Docs §8.5 and validation-ladder updated |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.

## Implementation Units

### U1. `test/cpython-derived/dict-contains-hash-eq.test.ts` (new)

### U2. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
