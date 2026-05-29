---
title: "feat: list/tuple cross-type operator evidence + list += tuple"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 373 next steps
---

# list/tuple cross-type operator evidence

## Summary

Close niche §8.15 list↔tuple gaps: Vitest for equality, ordering TypeErrors, binary/in-place rejects, and **`list += tuple`** extend parity (CPython accepts tuple via `__iadd__`).

## Problem Frame

List and tuple share sequence repetition patterns but differ on cross-type equality and ordering. CPython also allows `list += tuple` while rejecting `list + tuple`. pyrt needs explicit evidence and tuple extend on `__iadd__`.

## Scope Boundaries

- In scope: `list.ts` `__iadd__` tuple extend; `operator-list-tuple-cross-type.test.ts`; §8.15 evidence + LIVING-PLAN delta
- Out of scope: CPython-specific concat error strings (`can only concatenate…`); generic dispatch messages are acceptable

---

### U1. list __iadd__ tuple extend

**Goal:** `list += tuple` extends in place like CPython.

**Files:** `src/runtime/builtins/list.ts`

**Approach:** When `other.type.name === "tuple"`, push tuple native items into list native array and return `self`. Avoid circular import with `tupleType`.

**Test scenarios:**
- `iadd(list, tuple([2,3]))` mutates list length and indices
- Returns same list instance

**Verification:** Targeted Vitest passes.

---

### U2. Cross-type Vitest evidence

**Goal:** Lock list↔tuple equality, ordering, binary, and in-place TypeError messages.

**Files:** `test/cpython-derived/operator-list-tuple-cross-type.test.ts`

**Patterns to follow:** `operator-str-int-remaining-binary.test.ts`, `operator-sequence-cross-type-add.test.ts`

**Test scenarios:**
- `eq`/`ne` cross-type false/true
- `lt`/`le`/`gt`/`ge` TypeError both orders
- `add`, `mul`, `sub`, `imul` incompatible pairs

**Verification:** New test file green.

---

### U3. Docs alignment

**Goal:** Record evidence in compatibility doc and LIVING-PLAN.

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/LIVING-PLAN.md`

**Verification:** §8.15 evidence list includes new test file; plan 374 delta prepended.
