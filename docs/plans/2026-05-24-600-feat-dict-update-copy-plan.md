---
title: "feat: dict.update and dict.copy (plan 600)"
type: feat
status: completed
date: 2026-05-24
origin: plan 598; dict method surface
---

# dict.update and dict.copy

## Brainstorm

| API | pyrt before 600 |
|-----|-----------------|
| `dict.update(mapping)` | Only `|=` on dict rhs |
| `dict.update(iterable of pairs)` | Missing |
| `dict.copy()` | Missing |
| `|=` with iterable | Missing (dict-only) |

Unify **`dictUpdateFrom`** for `update`, `|=`, using **`dictSet`** (hash+eq).

## Summary

Add `update` and `copy`; refactor `__ior__` to share `dictUpdateFrom` (dict or iterable of 2-tuples/lists). Tests + docs.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `update(other)` merges dict or iterable of pairs |
| R2 | `copy()` shallow copy via `dictSet` |
| R3 | `|=` accepts same operands as `update` |
| R4 | Equal-but-distinct keys overwrite on update |
| R5 | Bad operand / bad pair length → `TypeError` / `ValueError` |
| R6 | `dict-update-copy.test.ts`; COMPATIBILITY + validation-ladder |
| R7 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- `keys`/`values`/`items` views; kwargs `update(**kw)`; PEP 3118.

## Implementation Units

### U1. `dict.ts` — `dictUpdateFrom`, `update`, `copy`, `ior` refactor

### U2. Tests + docs

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
