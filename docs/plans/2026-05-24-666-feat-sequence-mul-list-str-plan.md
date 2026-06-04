---
title: "feat: list __mul__ str cross-type evidence (plan 666)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.6; post plan 664 tuple*str
---

# list __mul__ str cross-type evidence

## Summary

Extend **`sequence-mul-cross-type.test.ts`** with **`list * str`** and **`str * list`** `PyTypeError` evidence beside plan 664 tuple cases. Evidence-only.

---

## Problem Frame

Plan 664 added tuple↔str `*` rejects to `sequence-mul-cross-type.test.ts`. List↔str `*` is only named in `operator-list-tuple-cross-type.test.ts`, not the §8.6 sequence-mul evidence file.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `mul(list, str)` and `mul(str, list)` raise `PyTypeError` with CPython-style `*` messages |
| R2 | §8.6 COMPATIBILITY and validation-ladder updated for plan 666 |
| R3 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- Tuple↔bytes/list `*` (remain in `operator-list-tuple-cross-type.test.ts` for now).

---

## Implementation Units

### U1. Vitest — `test/cpython-derived/sequence-mul-cross-type.test.ts`

### U2. Docs sync

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
