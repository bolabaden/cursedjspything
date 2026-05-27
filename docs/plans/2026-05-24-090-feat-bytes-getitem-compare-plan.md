---
title: "feat: bytes getitem and rich compare"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 089 next steps
---

# Bytes getitem and rich compare

## Summary

Expand minimal `bytesType` with integer **`__getitem__`** (returns `int` 0–255) and bytes-bytes **rich compare** (`ne`, `lt`, `le`, `gt`, `ge`), matching CPython lexicographic ordering.

---

## Problem Frame

Plan 089 next step calls for bytes API expansion. Indexing and ordering are foundational for bytes parity and unblock further slices (slice, decode).

---

## Requirements

- R1. `bytes.__getitem__`: int index → `pyInt` byte value; negative indices; `PyIndexError` OOB; `PyTypeError` non-int
- R2. Rich compare slots for bytes↔bytes only; `NotImplemented` vs other types
- R3. Add `test/cpython-derived/bytes-getitem-compare.test.ts`
- R4. COMPATIBILITY §8.15 / validation-ladder / LIVING-PLAN delta
- R5. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No slice indexing yet
- No decode / buffer protocol

---

## Implementation Units

- U1. **Runtime** — extend `src/runtime/builtins/bytes.ts`
- U2. **Tests** — getitem + compare evidence
- U3. **Docs** — evidence inventory update
- U4. Feature branch + PR

---

## Test Scenarios

- T1. `b'abc'[0]` → 97; `b'abc'[-1]` → 99
- T2. OOB index → `PyIndexError`; str index → `PyTypeError`
- T3. `b'a' < b'b'`, `b'a' == b'a'`, `b'b' != b'a'`
- T4. `eq(b, int)` → false (NotImplemented path via compare dispatch)
