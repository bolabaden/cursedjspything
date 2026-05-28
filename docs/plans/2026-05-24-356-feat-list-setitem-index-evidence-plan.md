---
title: "feat: list setItem index out of range §8.17 evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 355 next steps
---

# List setItem out-of-range §8.17 evidence

## Summary

Extend **`sequence-index-type.test.ts`** with list `setItem` out-of-range **`PyIndexError`** (`list assignment index out of range`). Completes get/set/del index error coverage for lists.

---

## Requirements

- R1. `setItem(list, bad-index, value)` → `PyIndexError` with assignment message
- R2. LIVING-PLAN delta; no runtime changes unless tests fail

---

## Validation

- `npm run check && npm test && npm run golden:keys`
