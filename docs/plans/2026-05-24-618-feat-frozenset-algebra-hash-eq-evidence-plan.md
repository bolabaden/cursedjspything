---
title: "feat: frozenset/set operator algebra hash+eq evidence (plan 618)"
type: feat
status: active
date: 2026-05-24
origin: plan 616; §8.15 gap
---

# frozenset/set | & - ^ hash+eq evidence

## Summary

Extend **`frozenset-set-algebra.test.ts`** with equal-but-distinct key cases for **`|`, `&`, `-`, `^`** including cross-type lhs result-type rules. Complements **`set-algebra-membership.test.ts`** (plan 592). Docs sync §8.5 / §8.15.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `\|` dedupes equal keys; preserves frozenset/set lhs type cross-type |
| R2 | `&`, `-`, `^` use hash+eq with cross-type operands |
| R3 | Docs + validation-ladder updated |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.

## Implementation Units

### U1. `test/cpython-derived/frozenset-set-algebra.test.ts`

### U2. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
