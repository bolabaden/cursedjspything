---
title: "feat: min/max key and default (plan 867)"
type: feat
status: completed
date: 2026-05-24
origin: plan 862 deferred key=/default= for min/max
---

# `min` / `max` `key=` and `default=`

## Summary

pyrt `min`/`max` (plan 862) compare raw elements only. Extend embedder API with optional trailing `key` (callable) and `default` (iterable-empty only), reusing shared key comparison from `list.ts`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `min(iterable, key)` / `max(iterable, key)` — compare via `key(item)` |
| R2 | `min(iterable, key, default)` / `min(iterable, default)` when empty — return `default` |
| R3 | Empty iterable without `default` → `ValueError` (unchanged) |
| R4 | Multiple positional values + `key` at end — no `default` allowed |
| R5 | `default` with multiple positional → `TypeError: Cannot specify a default for min()/max() with multiple positional arguments` |
| R6 | Non-callable `key` → `TypeError` (same pattern as `sorted`) |
| R7 | Extend `min-max-builtin.test.ts`; export unchanged from `barrel/stable.ts` |
| R8 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Keyword-only Python syntax deferred (positional trailing `key`/`default` only).
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
