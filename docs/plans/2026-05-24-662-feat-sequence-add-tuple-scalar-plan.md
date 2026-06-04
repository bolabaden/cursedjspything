---
title: "feat: tuple __add__ float/bool + rejects (plan 662)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.6; post plan 660 tuple+str/bytes
---

# tuple __add__ float/bool + rejects

## Summary

Extend **`sequence-add.test.ts`** with **`tuple + float`**, **`float + tuple`**, **`tuple + bool`**, and **`bool + tuple`** `PyTypeError` evidence. Completes tuple scalar cross-type **`+`** beside plan 660 (str/bytes). Evidence-only.

---

## Problem Frame

Plan 660 documented tuple↔str/bytes `+` rejects in `sequence-add.test.ts`. Tuple↔int is in `operator-list-tuple-cross-type.test.ts`; tuple↔float/bool `+` is not named in the §8.6 sequence-add evidence file.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `add(tuple, float)` and `add(float, tuple)` raise `PyTypeError` with CPython-style `+` messages |
| R2 | `add(tuple, bool)` and `add(bool, tuple)` raise `PyTypeError` with CPython-style `+` messages |
| R3 | §8.6 COMPATIBILITY and validation-ladder updated for plan 662 |
| R4 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- Duplicating tuple↔int/list rejects in `operator-list-tuple-cross-type.test.ts`.

---

## Implementation Units

### U1. Vitest — `test/cpython-derived/sequence-add.test.ts`

### U2. Docs sync — `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
