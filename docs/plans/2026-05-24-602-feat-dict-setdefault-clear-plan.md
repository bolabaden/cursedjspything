---
title: "feat: dict.setdefault and dict.clear (plan 602)"
type: feat
status: active
date: 2026-05-24
origin: plan 600; dict method surface
---

# dict.setdefault and dict.clear

## Summary

Add **`dict.setdefault(key[, default])`** (insert via `dictSet` when missing; return existing or new value) and **`dict.clear()`** (empty the map). Vitest + §8.5 docs.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `setdefault` returns existing value without replacing |
| R2 | `setdefault` inserts `default` (or `None`) when key absent |
| R3 | Equal-but-distinct keys: `setdefault(k2)` finds `k1` |
| R4 | `clear()` empties dict; `len` 0 |
| R5 | `dict-setdefault-clear.test.ts`; COMPATIBILITY + validation-ladder |
| R6 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- `pop`/`popitem`; `keys`/`values`/`items` views.

## Implementation Units

### U1. `dict.ts` methods + tests + docs

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
