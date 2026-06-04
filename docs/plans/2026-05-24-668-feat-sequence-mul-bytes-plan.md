---
title: "feat: list/tuple __mul__ bytes cross-type evidence (plan 668)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.6; post plan 666 list/tuple*str
---

# list/tuple __mul__ bytes cross-type evidence

## Summary

Extend **`sequence-mul-cross-type.test.ts`** with **`list * bytes`**, **`bytes * list`**, **`tuple * bytes`**, and **`bytes * tuple`** `PyTypeError` evidence beside plans 664–666 str cases. Evidence-only.

---

## Problem Frame

`sequence-mul-cross-type.test.ts` documents list/tuple↔str `*` rejects. List/tuple↔bytes `*` is only in `operator-list-tuple-cross-type.test.ts`.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `mul(list, bytes)` and `mul(bytes, list)` raise `PyTypeError` with CPython-style `*` messages |
| R2 | `mul(tuple, bytes)` and `mul(bytes, tuple)` raise `PyTypeError` with CPython-style `*` messages |
| R3 | §8.6 COMPATIBILITY and validation-ladder updated for plan 668 |
| R4 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- list/tuple↔int/float `*` repeat semantics (covered elsewhere).

---

## Implementation Units

### U1. Vitest — `test/cpython-derived/sequence-mul-cross-type.test.ts`

### U2. Docs sync

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
