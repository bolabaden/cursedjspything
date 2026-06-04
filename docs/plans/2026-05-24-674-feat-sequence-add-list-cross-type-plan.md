---
title: "feat: list __add__ cross-type TypeError evidence (plan 674)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.6; post plan 672 sequence-iadd list+=tuple
---

# list __add__ cross-type TypeError evidence

## Summary

Extend **`sequence-add.test.ts`** with CPython-derived **`list +`** rejects for **tuple**, **int**, **str**, **bytes**, **float**, and **bool** (both operand orders). Tuple scalar rejects remain from plans 660–662. Evidence-only.

---

## Problem Frame

Plans 660–662 colocated tuple cross-type **`+`** rejects in `sequence-add.test.ts`. List↔tuple/int/str rejects live only in `operator-list-tuple-cross-type.test.ts`, so §8.6 list `__add__` cross-type evidence is split across files.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `add(list, tuple)` / `add(tuple, list)` raise `PyTypeError` with CPython-style `+` messages |
| R2 | `add(list, int)` / `add(int, list)` raise `PyTypeError` with CPython-style `+` messages |
| R3 | `add(list, str)` / `add(str, list)` raise `PyTypeError` with CPython-style `+` messages |
| R4 | `add(list, bytes)` / `add(bytes, list)` and list↔float/bool `+` reject with CPython-style messages |
| R5 | §8.6 COMPATIBILITY and validation-ladder updated for plan 674 |
| R6 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- Removing duplicate tests from `operator-list-tuple-cross-type.test.ts`.

---

## Implementation Units

### U1. Vitest — `test/cpython-derived/sequence-add.test.ts`

**Test scenarios:** list↔tuple, list↔int, list↔str, list↔bytes, list↔float, list↔bool — each both orders, `PyTypeError` message shape.

### U2. Docs sync

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
