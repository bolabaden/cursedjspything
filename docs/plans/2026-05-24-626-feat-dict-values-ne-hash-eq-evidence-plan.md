---
title: "feat: dict values view and __ne__ hash+eq evidence (plan 626)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN; plan 624 dict views
---

# dict values view contains and dict __ne__ evidence

## Summary

Evidence that **`dict_values` view `__contains__`** uses rich `eq()` on values, and **`dict` inequality** via `ne()` mirrors `dict.__eq__` with hash+eq keys (plan 620 complement). Evidence-only unless tests fail.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `dict_values` view `contains` true for equal-but-distinct value objects |
| R2 | `ne(dict_a, dict_b)` false when `eq` would be true with equal-but-distinct keys |
| R3 | `ne` true when dict contents differ |
| R4 | Docs §8.5 and validation-ladder updated |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- Explicit `dict.__ne__` slot (uses rich compare `ne` path).

## Implementation Units

### U1. `test/cpython-derived/dict-keys-values-items-views.test.ts` — values view equal-value contains

### U2. `test/cpython-derived/dict-eq-hash-eq.test.ts` — `ne()` cases

### U3. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
