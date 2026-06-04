---
title: "feat: tuple __add__ cross-type TypeError evidence (plan 660)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.6; post plan 658 sequence-iadd scalar rejects
---

# tuple __add__ cross-type TypeError evidence

## Summary

Extend **`sequence-add.test.ts`** with CPython-derived **`tuple +`** rejects for **str** and **bytes** (both operand orders). List cross-type **`+`** rejects remain in `operator-list-tuple-cross-type.test.ts`. Evidence-only.

---

## Problem Frame

Plan 634 locked same-type list/tuple `__add__` happy paths. `operator-list-tuple-cross-type.test.ts` covers list↔int/str/tuple and tuple↔int, but **tuple↔str** and **tuple↔bytes** `+` are not named in the §8.6 `sequence-add` evidence file.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `add(tuple, str)` and `add(str, tuple)` raise `PyTypeError` with CPython-style `+` messages |
| R2 | `add(tuple, bytes)` and `add(bytes, tuple)` raise `PyTypeError` with CPython-style `+` messages |
| R3 | §8.6 COMPATIBILITY and validation-ladder updated for plan 660 |
| R4 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- Duplicating list↔tuple/int/str rejects already in `operator-list-tuple-cross-type.test.ts`.
- Tuple `__iadd__` (immutable).

---

## Implementation Units

### U1. Vitest — `test/cpython-derived/sequence-add.test.ts`

**Test scenarios:**

- T1. `add(tuple, str)` / `add(str, tuple)` → `PyTypeError` / `+` / type names
- T2. `add(tuple, bytes)` / `add(bytes, tuple)` → `PyTypeError` / `+` / type names

### U2. Docs sync

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
