---
title: "feat: list __iadd__ int cross-type evidence (plan 686)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.6; post plan 684 sequence-ordering
---

# list __iadd__ int cross-type evidence

## Summary

Extend **`sequence-iadd.test.ts`** with **`list += int`** and **`int += list`** `PyTypeError` evidence. Scalar `+=` rejects for str/bytes/float/bool are in plans 656–658; **int** remains only in `operator-inplace-cross-type.test.ts`. Evidence-only.

---

## Problem Frame

§8.6 `sequence-iadd` documents list in-place extend and most cross-type `+=` rejects. **`list += int`** is the remaining scalar pair not named in the §8.6 file.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `iadd(list, int)` and `iadd(int, list)` raise `PyTypeError` with CPython-style `+=` messages |
| R2 | §8.6 COMPATIBILITY and validation-ladder updated for plan 686 |
| R3 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- Removing duplicate tests from `operator-inplace-cross-type.test.ts`.

---

## Implementation Units

### U1. Vitest — `test/cpython-derived/sequence-iadd.test.ts`

### U2. Docs sync

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
