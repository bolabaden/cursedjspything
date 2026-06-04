---
title: "feat: list __iadd__ cross-type TypeError evidence (plan 656)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.6; post plan 636 sequence-iadd happy path
---

# list __iadd__ cross-type TypeError evidence

## Summary

Extend **`sequence-iadd.test.ts`** with CPython-derived rejects for **`list +=`** with **str** and **bytes** operands. **`list += int`** stays in `operator-inplace-cross-type.test.ts`; **`list += tuple`** stays in `operator-list-tuple-cross-type.test.ts`. Evidence-only.

---

## Problem Frame

Plan 636 locked same-type list extend. Cross-type **`+`** / **`*`** rejects for list↔str and list↔bytes live in `operator-list-tuple-cross-type.test.ts`, but **`+=`** for those pairs is not named in §8.6 / `sequence-iadd` evidence.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `iadd(list, str)` raises `PyTypeError` with CPython-style `+=` message |
| R2 | `iadd(list, bytes)` raises `PyTypeError` with CPython-style `+=` message |
| R3 | §8.6 / §8.15 COMPATIBILITY prose and validation-ladder row updated |
| R4 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- Duplicating `list += int` / `list += dict` (already in `operator-inplace-cross-type.test.ts`).
- Tuple `__iadd__` (immutable).

---

## Key Technical Decisions

- Colocate rejects with plan 636 file (`sequence-iadd.test.ts`) so §8.6 list `__iadd__` evidence is one ladder row.

---

## Implementation Units

### U1. Vitest — `test/cpython-derived/sequence-iadd.test.ts`

**Goal:** Lock list `__iadd__` rejects for str and bytes.

**Files:** `test/cpython-derived/sequence-iadd.test.ts`

**Test scenarios:**

- T1. `iadd(list, str)` → `PyTypeError` / `'list' and 'str'` / `+=`
- T2. `iadd(list, bytes)` → `PyTypeError` / `'list' and 'bytes'` / `+=`

**Verification:** New tests pass; list unchanged on throw (optional assert length stable).

### U2. Docs sync

**Goal:** Traceability in COMPATIBILITY §8.6 (and §8.15 operator list if needed) + validation-ladder note for plan 656.

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
