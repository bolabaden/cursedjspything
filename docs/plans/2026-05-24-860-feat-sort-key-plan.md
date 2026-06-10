---
title: "feat: list.sort/sorted key= support (plan 860)"
type: feat
status: completed
date: 2026-05-24
origin: plan 859 deferred sort key=
---

# `list.sort` / `sorted` `key=`

## Summary

Plans 858–859 added sort without `key`. Extend `list.sort` and builtin `sorted` to accept an optional callable `key` (via `Slot.call`), preserving the existing positional `reverse` bool convention when the first optional arg is bool.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `sort(key?, reverse?)` / `sorted(iterable, key?, reverse?)` — callable key invokes `__call__` per element |
| R2 | Key must return `PyObject`; incomparable keys propagate `TypeError` |
| R3 | `sort(pyTrue)` / `sorted(iterable, pyTrue)` still mean `reverse=True` only |
| R4 | `resolveSortOptions` shared helper; `callSlotOrThrow` for key invoke (no protocols import cycle) |
| R5 | Extend `list-sort.test.ts` + `sorted-builtin.test.ts`; update docs |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Keyword-only `key=`/`reverse=` at Python syntax layer deferred (embedder positional API only).
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
