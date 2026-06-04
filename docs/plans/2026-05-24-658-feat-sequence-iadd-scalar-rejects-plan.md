---
title: "feat: list __iadd__ float/bool += rejects (plan 658)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.6; post plan 656 list+=str/bytes
---

# list __iadd__ float/bool += rejects

## Summary

Extend **`sequence-iadd.test.ts`** with **`list += float`** and **`list += bool`** `PyTypeError` evidence. Completes scalar cross-type **`+=`** rejects beside plan 656 (str/bytes) and existing `list += int` in `operator-inplace-cross-type.test.ts`. Evidence-only.

---

## Problem Frame

Plan 656 documented list↔str/bytes `+=` rejects in the dedicated §8.6 file. Numeric scalar **`+=`** mismatches for list (float, bool) are not named there; bool/float ordering for list `+`/`*` live in `operator-list-tuple-cross-type.test.ts` but not `+=`.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `iadd(list, float)` raises `PyTypeError` with CPython-style `+=` message |
| R2 | `iadd(list, bool)` raises `PyTypeError` with CPython-style `+=` message |
| R3 | §8.6 COMPATIBILITY and validation-ladder updated for plan 658 |
| R4 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- Moving `list += int` from `operator-inplace-cross-type.test.ts` (avoid churn).
- `list += tuple` (valid; plan 374).

---

## Implementation Units

### U1. Vitest — `test/cpython-derived/sequence-iadd.test.ts`

**Test scenarios:**

- T1. `iadd(list, pyFloat)` → `PyTypeError` / `'list' and 'float'` / `+=`; list length unchanged
- T2. `iadd(list, pyTrue)` → `PyTypeError` / `'list' and 'bool'` / `+=`; list length unchanged

### U2. Docs sync

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
