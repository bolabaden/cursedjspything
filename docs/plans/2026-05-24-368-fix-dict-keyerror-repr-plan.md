---
title: "fix: dict KeyError uses key repr"
type: fix
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 367 next steps (§8.17)
---

# dict KeyError key repr (plan 368)

## Summary

Fix **`dict.__getitem__` / `__delitem__` / `__missing__`** so missing-key **`PyKeyError`** uses the key's **`repr`** (not `String(pyObject)` → `[object Object]`). Add Vitest and sync §8.17 docs.

## Requirements

- R1. `getItem(dict, pyStr('missing'))` → `PyKeyError` message `'missing'`
- R2. `getItem(dict, pyInt(2))` on empty dict → `PyKeyError` message `2`
- R3. `delItem` missing key → same repr-shaped message
- R4. COMPATIBILITY §8.17 + validation-ladder + LIVING-PLAN

## Scope Boundaries

- `dict.ts` only (not set.remove KeyError in this slice)
