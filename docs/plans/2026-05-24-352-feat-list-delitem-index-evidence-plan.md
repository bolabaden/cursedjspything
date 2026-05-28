---
title: "feat: list delItem index §8.17 evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 351 next steps
---

# List delItem index §8.17 evidence

## Summary

Extend **`sequence-index-type.test.ts`** with `delItem` cases for list non-integer keys and out-of-range deletion. Runtime already raises **`PyTypeError`** / **`PyIndexError`**; closes a §8.17 evidence gap.

---

## Requirements

- R1. `delItem(list, non-int)` → `PyTypeError` with `list indices must be integers`
- R2. `delItem(list, bad-index)` → `PyIndexError` with `list deletion index out of range`
- R3. Happy-path `delItem` removes element
- R4. LIVING-PLAN delta; no runtime changes unless tests fail

---

## Validation

- `npm run check && npm test && npm run golden:keys`
