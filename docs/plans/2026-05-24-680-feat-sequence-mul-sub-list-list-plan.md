---
title: "feat: list list mul/sub TypeError evidence (plan 680)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.6; post plan 678 sequence-add tuple+int
---

# list __mul__ / __sub__ same-type reject evidence

## Summary

Extend **`sequence-mul-cross-type.test.ts`** with **`list * list`** reject and add **`sequence-sub.test.ts`** with **`list - list`** reject. Evidence-only; duplicates kept in `operator-list-tuple-cross-type.test.ts`.

---

## Problem Frame

§8.6 colocated sequence `+` / `+=` / `*=` / heterogeneous `*` evidence. **`list * list`** and **`list - list`** remain only in `operator-list-tuple-cross-type.test.ts`.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `mul(list, list)` raises `PyTypeError` with CPython-style `*` message |
| R2 | `sub(list, list)` raises `PyTypeError` with CPython-style `-` message |
| R3 | §8.6 COMPATIBILITY and validation-ladder updated for plan 680 |
| R4 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- Tuple `__sub__` (immutable; no list-style `-` between tuples in same file scope).
- Float repeat-count `*` (covered in `sequence-repeat-nonint.test.ts`).

---

## Implementation Units

### U1. Vitest — `sequence-mul-cross-type.test.ts`, `sequence-sub.test.ts` (new)

### U2. Docs sync

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
