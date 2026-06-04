---
title: "feat: list __iadd__ in-place extend evidence (plan 636)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.6; post plan 634 sequence __add__
---

# list __iadd__ in-place extend evidence

## Summary

§8.6 follow-up: evidence that **`list.__iadd__`** extends a list with another list in place (returns `self`, no dedupe). Tuple has no `__iadd__` in pyrt — out of scope. Evidence-only.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `iadd(list_a, list_b)` mutates `list_a` and appends `list_b` elements |
| R2 | `iadd` returns the same list instance |
| R3 | In-place extend keeps equal-but-distinct elements (len 2) |
| R4 | Docs §8.6 and validation-ladder updated |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- `list += tuple` (covered in `operator-list-tuple-cross-type.test.ts`).
- Tuple `__iadd__` (immutable).
- Runtime changes unless tests expose a bug.

## Implementation Units

### U1. `test/cpython-derived/sequence-iadd.test.ts` (new)

### U2. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
