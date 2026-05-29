---
title: "fix: set remove KeyError uses item repr"
type: fix
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 369 next steps (§8.17)
---

# set.remove KeyError item repr (plan 370)

## Summary

Fix **`set.remove`** missing-element **`PyKeyError`** to use item **`repr`** (same bug class as plan 368 dict). Extend **`set-mutation.test.ts`** message assertions; sync §8.17 docs.

## Scope Boundaries

- `set.ts` `remove` only; `pop` empty-set message unchanged
