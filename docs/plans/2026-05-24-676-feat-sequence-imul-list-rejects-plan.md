---
title: "feat: list __imul__ cross-type TypeError evidence (plan 676)"
type: feat
status: active
date: 2026-05-24
origin: LIVING-PLAN §8.6; post plan 674 sequence-add list cross-type +
---

# list __imul__ cross-type TypeError evidence

## Summary

Add **`sequence-imul.test.ts`** with CPython-derived **`list *=`** rejects for **float**, **list**, and **tuple** operands. Evidence-only; duplicates kept in `operator-list-tuple-cross-type.test.ts`.

---

## Problem Frame

Plans 636–672 colocated list `__iadd__` evidence in `sequence-iadd.test.ts`. List `__imul__` rejects exist only in `operator-list-tuple-cross-type.test.ts`, so §8.6 in-place `*=` evidence is incomplete.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `imul(list, float)` raises `PyTypeError` with CPython-style `*=` message |
| R2 | `imul(list, list)` and `imul(list, tuple)` raise `PyTypeError` with CPython-style `*=` messages |
| R3 | §8.6 COMPATIBILITY and validation-ladder updated for plan 676 |
| R4 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- Tuple `__imul__` (immutable).
- Removing duplicate tests from `operator-list-tuple-cross-type.test.ts`.

---

## Implementation Units

### U1. Vitest — `test/cpython-derived/sequence-imul.test.ts` (new)

### U2. Docs sync

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
