---
title: "feat: dict __delitem__ and items view value eq evidence (plan 632)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.5; complete dict mutation/view edges
---

# dict __delitem__ and items view value equality evidence

## Summary

Close remaining dict evidence gaps: **`delItem`** (`__delitem__`) deletes by hash+eq key, and **`dict_items`** view `contains` matches pairs when the value is equal-but-distinct under rich `eq()`. Evidence-only.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `delItem(dict, k2)` removes entry stored under equal-but-distinct `k1` |
| R2 | `dict_items` `contains((k, v2))` true when dict maps `k` to equal-but-distinct `v1` |
| R3 | Items false when value differs under equal keys |
| R4 | Docs §8.5 and validation-ladder updated |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.

## Implementation Units

### U1. `test/cpython-derived/dict-delitem-hash-eq.test.ts` (new)

### U2. `test/cpython-derived/dict-keys-values-items-views.test.ts` — items value eq contains

### U3. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
