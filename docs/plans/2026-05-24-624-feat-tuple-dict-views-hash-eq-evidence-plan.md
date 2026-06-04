---
title: "feat: tuple __contains__ and dict items view hash+eq evidence (plan 624)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN; plan 622 §8.6 / dict views
---

# tuple __contains__ and dict items view hash+eq evidence

## Summary

Evidence that **`tuple.__contains__`** and **`dict_items` view `__contains__`** use rich `eq()` / `dictGet` (hash+eq keys). Complements plan 622 sequence equality and plan 606 dict views. Evidence-only unless tests fail.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `tuple.__contains__` true for equal-but-distinct elements |
| R2 | `dict_items` view `contains` matches `(equal_key, value)` pairs |
| R3 | `dict_items` false when key equal but value differs |
| R4 | Docs §8.6 / §8.5 and validation-ladder updated |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- `dict_values` / `dict_keys` beyond items (keys view already has hash+eq in 606).

## Implementation Units

### U1. `test/cpython-derived/tuple-eq-hash-eq.test.ts` — add `__contains__` cases

### U2. `test/cpython-derived/dict-keys-values-items-views.test.ts` — items view hash+eq contains

### U3. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
