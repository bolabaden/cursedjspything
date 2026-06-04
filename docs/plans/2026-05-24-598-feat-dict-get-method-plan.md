---
title: "feat: dict.get with hash+eq lookup (plan 598)"
type: feat
status: completed
date: 2026-05-24
origin: plan 596; dict method surface gap
---

# dict.get method

## Brainstorm

| CPython | pyrt before 598 |
|---------|-----------------|
| `d.get(k)` → value or `None` | Only `d[k]` → `KeyError` on miss |
| `d.get(k, default)` | N/A |
| Equal-but-distinct keys | `dictFindKey` exists; `get` should use it |

## Summary

Add `dict.get(key, default=None)` using `dictGet`; Vitest + §8.5 docs.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Present key returns value |
| R2 | Missing key returns `None` when no default |
| R3 | Missing key returns supplied default |
| R4 | Equal-but-distinct keys resolve via `dictGet` |
| R5 | Unhashable probe raises `TypeError` |
| R6 | `dict-get.test.ts`; validation-ladder + COMPATIBILITY |
| R7 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- `keys`/`values`/`items` views; `setdefault`; PEP 3118.

## Implementation Units

### U1. `dict.ts` — `get` method

### U2. Tests + docs

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
