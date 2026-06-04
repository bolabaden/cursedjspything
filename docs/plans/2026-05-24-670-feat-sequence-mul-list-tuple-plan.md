---
title: "feat: list/tuple __mul__ cross-type evidence (plan 670)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.6; post plan 668 sequence-mul bytes
---

# list/tuple __mul__ cross-type evidence

## Summary

Extend **`sequence-mul-cross-type.test.ts`** with **`list * tuple`** and **`tuple * list`** `PyTypeError` evidence. Completes list↔tuple heterogeneous `*` documentation in the §8.6 sequence-mul file (plans 664–668 cover str/bytes). Evidence-only.

---

## Problem Frame

`sequence-mul-cross-type.test.ts` documents list/tuple↔str/bytes `*` rejects. List↔tuple `*` rejects exist only in `operator-list-tuple-cross-type.test.ts`.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `mul(list, tuple)` and `mul(tuple, list)` raise `PyTypeError` with CPython-style `*` messages |
| R2 | §8.6 COMPATIBILITY and validation-ladder updated for plan 670 |
| R3 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- `list += tuple` (valid; stays in `operator-list-tuple-cross-type.test.ts`).

---

## Implementation Units

### U1. Vitest — `test/cpython-derived/sequence-mul-cross-type.test.ts`

### U2. Docs sync

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
