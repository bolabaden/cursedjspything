---
title: "feat: tuple index/count methods (plan 861)"
type: feat
status: completed
date: 2026-05-24
origin: list index/count parity; tuple lacks search methods
---

# tuple `index` / `count`

## Summary

pyrt `list` has `index`/`count` (plan 856); `tuple` does not. Add immutable-sequence search methods mirroring list: `eq()`-based match, optional `start`/`stop` bounds, `ValueError` on missing `index`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `index(value, start?, stop?)` — first `eq()` match; `ValueError: tuple.index(x): x not in tuple` on miss |
| R2 | `count(value, start?, stop?)` — tally `eq()` matches in range |
| R3 | Extract shared `sequenceIndex`/`sequenceCount` from list helpers; list delegates to shared |
| R4 | `tuple-index-count.test.ts` + update §8.17 / LIVING-PLAN |
| R5 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Tuple mutation methods out of scope (immutable).
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
