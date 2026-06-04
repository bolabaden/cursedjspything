---
title: "feat: set ordering hash+eq evidence (plan 612)"
type: feat
status: active
date: 2026-05-24
origin: plan 610; §8.15 gap
---

# set/frozenset ordering comparisons hash+eq evidence

## Summary

Extend **`frozenset-set-ordering.test.ts`** with equal-but-distinct key cases for **`<=`**, **`<`**, **`>=`**, **`>`** on set/frozenset. Runtime uses **`setMemberHas`** via `set-ordering.ts`; evidence + §8.5 / §8.15 docs sync.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `<=` / `<` treat equal distinct keys as subset members |
| R2 | `>=` / `>` treat equal distinct keys as superset members |
| R3 | Cross-type set/frozenset ordering with equal keys |
| R4 | §8.5 + §8.15 + validation-ladder updated |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.

## Implementation Units

### U1. `test/cpython-derived/frozenset-set-ordering.test.ts`

### U2. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
