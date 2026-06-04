---
title: "feat: list/tuple cross-type ordering evidence (plan 684)"
type: feat
status: active
date: 2026-05-24
origin: LIVING-PLAN §8.6; post plan 682 sequence-eq cross-type
---

# list/tuple cross-type ordering evidence

## Summary

Add **`sequence-ordering-cross-type.test.ts`** using `registerCrossTypeOrderingRejects` for **list↔tuple** `lt`/`le`/`gt`/`ge` `TypeError` evidence. Today this lives only in `operator-list-tuple-cross-type.test.ts`. Evidence-only.

---

## Problem Frame

Plan 682 colocated cross-type `eq`/`ne`. Cross-type **ordering** for list↔tuple is still only in the §8.15 operator file, not a `sequence-*` §8.6 evidence file.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `lt`/`le`/`gt`/`ge` for list↔tuple raise `PyTypeError` in both orders with CPython-style messages |
| R2 | §8.6 COMPATIBILITY and validation-ladder updated for plan 684 |
| R3 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- Removing duplicate tests from `operator-list-tuple-cross-type.test.ts`.
- Other type-pair ordering (covered elsewhere via `cross-type-ordering` helper consumers).

---

## Implementation Units

### U1. Vitest — `test/cpython-derived/sequence-ordering-cross-type.test.ts` (new)

Reuse `helpers/cross-type-ordering.ts`.

### U2. Docs sync

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
