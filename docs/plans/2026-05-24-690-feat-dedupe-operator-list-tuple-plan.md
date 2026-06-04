---
title: "feat: remove duplicate operator-list-tuple tests (plan 690)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN; post plan 688 sequence evidence index
---

# Remove duplicate operator-list-tuple tests

## Summary

Delete **`operator-list-tuple-cross-type.test.ts`** now that §8.6 canonical coverage lives in **`sequence-*`** files (plan 688 index). Removes **23** redundant Vitest cases; no runtime changes.

---

## Problem Frame

Plan 688 marked the operator file as legacy duplicate. Keeping both files wastes CI time and confuses which evidence is authoritative.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Delete `test/cpython-derived/operator-list-tuple-cross-type.test.ts` |
| R2 | Remove validation-ladder row; update COMPATIBILITY §8.6 index and §8.15 operator list |
| R3 | `npm run check && npm test && npm run golden:keys` green; Vitest count drops by 23 with no coverage loss |

---

## Scope Boundaries

### Outside scope

- Runtime changes.
- Editing historical plan files.

---

## Implementation Units

### U1. Delete test file

### U2. Docs sync

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```

Expected: **1170** Vitest / **163** files.
