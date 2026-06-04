---
title: "feat: tuple __add__ int cross-type TypeError evidence (plan 678)"
type: feat
status: active
date: 2026-05-24
origin: LIVING-PLAN §8.6; post plan 676 sequence-imul
---

# tuple __add__ int cross-type TypeError evidence

## Summary

Extend **`sequence-add.test.ts`** with CPython-derived **`tuple + int`** / **`int + tuple`** `PyTypeError` evidence. List↔int `+` rejects are in plan 674; tuple↔int remains only in `operator-list-tuple-cross-type.test.ts`. Evidence-only.

---

## Problem Frame

Plans 660–662 and 674 colocated tuple/list scalar cross-type **`+`** rejects except **tuple↔int**, which is the last tuple `__add__` cross-type pair not named in the §8.6 `sequence-add` file.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `add(tuple, int)` and `add(int, tuple)` raise `PyTypeError` with CPython-style `+` messages |
| R2 | §8.6 COMPATIBILITY and validation-ladder updated for plan 678 |
| R3 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- Removing duplicate tests from `operator-list-tuple-cross-type.test.ts`.

---

## Implementation Units

### U1. Vitest — `test/cpython-derived/sequence-add.test.ts`

### U2. Docs sync

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
