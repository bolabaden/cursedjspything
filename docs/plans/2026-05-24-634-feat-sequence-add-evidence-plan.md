---
title: "feat: list and tuple __add__ concatenation evidence (plan 634)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.6; post dict hash+eq stack
---

# list and tuple __add__ concatenation evidence

## Summary

Shift to §8.6 sequence ops: evidence that **`list.__add__`** and **`tuple.__add__`** concatenate same-type sequences (no cross-type coercion), preserving element count including equal-but-distinct objects (no dedupe). Evidence-only.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `add(list_a, list_b)` returns new list with combined elements |
| R2 | `add(tuple_a, tuple_b)` returns new tuple with combined elements |
| R3 | Concatenation keeps equal-but-distinct elements as separate entries (len 2) |
| R4 | Docs §8.6 and validation-ladder updated |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- list↔tuple `+` (already rejects in operator-list-tuple-cross-type).
- Runtime changes unless tests expose a bug.

## Implementation Units

### U1. `test/cpython-derived/sequence-add.test.ts` (new)

### U2. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
