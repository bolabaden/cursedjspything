---
title: "feat: tuple __mul__ str cross-type evidence (plan 664)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.6; post plan 662 tuple __add__ scalar rejects
---

# tuple __mul__ str cross-type evidence

## Summary

Add **`test/cpython-derived/sequence-mul-cross-type.test.ts`** locking **`tuple * str`** and **`str * tuple`** `PyTypeError` evidence. List↔str `*` rejects stay in `operator-list-tuple-cross-type.test.ts`; tuple↔bytes `*` is there too. Evidence-only.

---

## Problem Frame

§8.6 sequence `__mul__` float repeat counts are in `sequence-repeat-nonint.test.ts`. Heterogeneous **sequence × sequence/scalar** rejects for **tuple↔str** are not named in a dedicated sequence-mul evidence file.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `mul(tuple, str)` and `mul(str, tuple)` raise `PyTypeError` with CPython-style `*` messages |
| R2 | §8.6 COMPATIBILITY and validation-ladder row for `sequence-mul-cross-type.test.ts` |
| R3 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- Duplicating list↔str/bytes/tuple `*` matrix in `operator-list-tuple-cross-type.test.ts`.

---

## Implementation Units

### U1. Vitest — `test/cpython-derived/sequence-mul-cross-type.test.ts` (new)

### U2. Docs sync

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
