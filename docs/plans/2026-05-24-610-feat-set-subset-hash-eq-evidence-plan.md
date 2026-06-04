---
title: "feat: set subset methods hash+eq evidence (plan 610)"
type: feat
status: active
date: 2026-05-24
origin: plan 590; §8.15 gap
---

# set/frozenset subset methods hash+eq evidence

## Summary

Extend **`frozenset-set-methods.test.ts`** with equal-but-distinct key cases for **`issubset`**, **`issuperset`**, and **`isdisjoint`**. Runtime already uses **`setMemberHas`** via `set-ordering.ts`; this slice locks evidence + updates §8.5 / §8.15 docs.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `issubset` / `issuperset` treat equal distinct keys as members |
| R2 | `isdisjoint` is false when sets share equal-but-distinct keys |
| R3 | Coverage on both `set` and `frozenset` |
| R4 | §8.5 + §8.15 + validation-ladder cite hash+eq subset methods |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.

## Implementation Units

### U1. `test/cpython-derived/frozenset-set-methods.test.ts`

### U2. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
